import { NextRequest, NextResponse } from "next/server";
import { getOpenRouterClient } from "@/lib/openrouter";
import { SYSTEM_PROMPT, buildFullKitPrompt } from "@/lib/prompts";
import {
  AppBriefSchema,
  LaunchKitSchema,
  extractJSON,
} from "@/lib/schema";

/** Simple in-memory rate limiter (resets on cold start — fine for hackathon) */
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;          // requests per window
const RATE_WINDOW_MS = 60_000;  // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────
  const ip = getIP(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  // ── Parse + validate request body ─────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const briefParse = AppBriefSchema.safeParse(body);
  if (!briefParse.success) {
    const issues = (briefParse.error as any).issues ?? [];
    return NextResponse.json(
      {
        error: "Invalid app brief.",
        details: issues.map((i: any) => ({
          field: i.path?.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  const brief = briefParse.data;
  const startMs = Date.now();

  // ── Call OpenRouter ────────────────────────────────────────
  let rawContent: string;
  let modelUsed: string;

  try {
    const client = getOpenRouterClient();
    const response = await client.chatCompletion({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildFullKitPrompt(brief) },
      ],
      temperature: 0.7,
      maxTokens: 6000,
      json: true,
    });
    rawContent = response.content;
    modelUsed = response.model;
  } catch (err: any) {
    console.error("[/api/generate] OpenRouter error:", err.message);
    return NextResponse.json(
      { error: "AI generation failed. Please try again.", details: err.message },
      { status: 502 }
    );
  }

  // ── Parse AI response ──────────────────────────────────────
  const jsonContent = extractJSON(rawContent);
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonContent);
  } catch {
    // First repair attempt: ask model to fix its own JSON
    console.warn("[/api/generate] JSON parse failed, attempting repair...");
    try {
      const client = getOpenRouterClient();
      const repairResponse = await client.chatCompletion({
        messages: [
          { role: "system", content: "You are a JSON repair assistant. Fix the broken JSON and return ONLY valid JSON. No markdown. No explanation." },
          { role: "user", content: `Fix this broken JSON:\n\n${rawContent}` },
        ],
        temperature: 0,
        maxTokens: 6000,
        json: true,
      });
      parsed = JSON.parse(extractJSON(repairResponse.content));
    } catch {
      return NextResponse.json(
        { error: "AI returned an unreadable response. Please retry." },
        { status: 502 }
      );
    }
  }

  // ── Validate against schema ────────────────────────────────
  const kitParse = LaunchKitSchema.safeParse(parsed);
  if (!kitParse.success) {
    console.error("[/api/generate] Schema validation failed:", (kitParse.error as any).issues);
    return NextResponse.json(
      { error: "AI response did not match expected format. Please retry." },
      { status: 502 }
    );
  }

  const durationMs = Date.now() - startMs;

  return NextResponse.json(
    {
      kit: kitParse.data,
      meta: {
        model: modelUsed,
        durationMs,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 200 }
  );
}
