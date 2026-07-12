import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOpenRouterClient } from "@/lib/openrouter";
import { SYSTEM_PROMPT, buildSectionPrompt } from "@/lib/prompts";
import { AppBriefSchema, extractJSON } from "@/lib/schema";
import {
  AppStoreListingSchema,
  PlayStoreListingSchema,
  ASOKeywordsSchema,
  SocialPostSchema,
  LaunchEmailSchema,
  CommunityPostSchema,
} from "@/lib/schema";

/** All regeneratable section keys and their schemas */
const SECTION_SCHEMAS = {
  appStore: AppStoreListingSchema,
  playStore: PlayStoreListingSchema,
  aso: ASOKeywordsSchema,
  socialCalendar: z.array(SocialPostSchema).length(7),
  email: LaunchEmailSchema,
  communityPost: CommunityPostSchema,
} as const;

export type RegeneratableSection = keyof typeof SECTION_SCHEMAS;

const RegenerateBodySchema = z.object({
  brief: AppBriefSchema,
  section: z.enum([
    "appStore",
    "playStore",
    "aso",
    "socialCalendar",
    "email",
    "communityPost",
  ]),
});

export async function POST(req: NextRequest) {
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

  const bodyParse = RegenerateBodySchema.safeParse(body);
  if (!bodyParse.success) {
    const issues = (bodyParse.error as any).issues ?? [];
    return NextResponse.json(
      {
        error: "Invalid request.",
        details: issues.map((i: any) => ({
          field: i.path?.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  const { brief, section } = bodyParse.data;
  const startMs = Date.now();

  // ── Call OpenRouter ────────────────────────────────────────
  let rawContent: string;
  let modelUsed: string;

  try {
    const client = getOpenRouterClient();
    const response = await client.chatCompletion({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildSectionPrompt(brief, section) },
      ],
      temperature: 0.75, // slightly higher for creative variation
      maxTokens: 2000,
      json: true,
    });
    rawContent = response.content;
    modelUsed = response.model;
  } catch (err: any) {
    console.error(`[/api/regenerate] OpenRouter error (${section}):`, err.message);
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
    console.warn(`[/api/regenerate] JSON parse failed for section "${section}", attempting repair...`);
    try {
      const client = getOpenRouterClient();
      const repairResponse = await client.chatCompletion({
        messages: [
          {
            role: "system",
            content:
              "You are a JSON repair assistant. Fix the broken JSON and return ONLY valid JSON. No markdown. No explanation.",
          },
          {
            role: "user",
            content: `Fix this broken JSON:\n\n${rawContent}`,
          },
        ],
        temperature: 0,
        maxTokens: 2000,
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

  // ── Validate against the specific section schema ───────────
  // The AI sometimes wraps responses: { communityPost: { ... } } or deeper.
  // Walk down the object tree until the schema matches or we run out of levels.
  const sectionSchema = SECTION_SCHEMAS[section];

  function findCandidate(value: unknown, depth = 0): unknown {
    if (depth > 3) return value;
    const attempt = sectionSchema.safeParse(value);
    if (attempt.success) return value;
    if (typeof value !== "object" || value === null || Array.isArray(value)) return value;
    // Try the key matching the section name first, then any single child value
    const record = value as Record<string, unknown>;
    const byName = record[section];
    if (byName !== undefined) return findCandidate(byName, depth + 1);
    const children = Object.values(record);
    if (children.length === 1) return findCandidate(children[0], depth + 1);
    return value;
  }

  const candidate = findCandidate(parsed);
  const sectionParse = sectionSchema.safeParse(candidate);

  if (!sectionParse.success) {
    console.error(
      `[/api/regenerate] Schema validation failed for "${section}":`,
      (sectionParse.error as any).issues
    );
    return NextResponse.json(
      { error: "AI response did not match expected format. Please retry." },
      { status: 502 }
    );
  }

  const durationMs = Date.now() - startMs;

  return NextResponse.json(
    {
      section,
      data: sectionParse.data,
      meta: {
        model: modelUsed,
        durationMs,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 200 }
  );
}
