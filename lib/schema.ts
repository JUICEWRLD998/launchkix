/** LauchKix — Zod schemas for validation and AI response parsing */

import { z } from "zod";

/** Platform enum */
export const PlatformSchema = z.enum(["ios", "android"]);

/** Tone enum */
export const ToneSchema = z.enum(["professional", "playful", "bold", "friendly"]);

/** Goal enum */
export const GoalSchema = z.enum(["downloads", "waitlist", "paid"]);

/** Language enum */
export const LanguageSchema = z.enum(["en", "es", "fr"]);

/** AppBrief input validation */
export const AppBriefSchema = z.object({
  name: z.string().min(1, "App name is required").max(100),
  tagline: z.string().min(1, "Tagline is required").max(200),
  description: z.string().min(10, "Description too short").max(2000),
  platforms: z.array(PlatformSchema).min(1, "Select at least one platform"),
  category: z.string().min(1, "Category is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  tone: ToneSchema,
  goal: GoalSchema,
  language: LanguageSchema.optional().default("en"),
});

/** Social post schema */
export const SocialPostSchema = z.object({
  day: z.number().int().min(1).max(7),
  platform: z.enum(["X", "LinkedIn", "Instagram"]),
  hook: z.string(),
  body: z.string(),
  cta: z.string(),
});

/** App Store listing schema */
export const AppStoreListingSchema = z.object({
  title: z.string().transform((v) => v.slice(0, 30)),
  subtitle: z.string().transform((v) => v.slice(0, 30)),
  promotionalText: z.string().transform((v) => v.slice(0, 170)),
  description: z.string(),
  whatsNew: z.string(),
});

/** Play Store listing schema */
export const PlayStoreListingSchema = z.object({
  shortDescription: z.string().transform((v) => v.slice(0, 80)),
  fullDescription: z.string(),
});

/** ASO keywords schema */
export const ASOKeywordsSchema = z.object({
  primaryKeywords: z.array(z.string()).min(5).max(10),
  secondaryKeywords: z.array(z.string()).min(5).max(15),
  longTail: z.array(z.string()).min(3).max(10),
  tips: z.array(z.string()).min(3).max(5),
});

/** Launch email schema */
export const LaunchEmailSchema = z.object({
  subjects: z.array(z.string()).min(3).max(5),
  body: z.string(),
});

/** Community post schema */
export const CommunityPostSchema = z.object({
  title: z.string(),
  body: z.string(),
});

/** Landing page copy schema (P1) */
export const LandingPageCopySchema = z.object({
  hero: z.string(),
  subhead: z.string(),
  features: z.array(z.string()).min(3).max(5),
  cta: z.string(),
});

/** Press blurb schema (P1) */
export const PressBlurbSchema = z.object({
  summary: z.string(),
  founderQuote: z.string(),
});

/** Store listing variants schema (P1) */
export const StoreListingVariantsSchema = z.object({
  a: z.object({
    title: z.string(),
    shortDescription: z.string(),
  }),
  b: z.object({
    title: z.string(),
    shortDescription: z.string(),
  }),
});

/** Complete launch kit schema */
export const LaunchKitSchema = z.object({
  appStore: AppStoreListingSchema,
  playStore: PlayStoreListingSchema,
  aso: ASOKeywordsSchema,
  socialCalendar: z.array(SocialPostSchema).length(7, "Must have 7 days"),
  email: LaunchEmailSchema,
  communityPost: CommunityPostSchema,
  landingPage: LandingPageCopySchema.optional(),
  pressBlurb: PressBlurbSchema.optional(),
  variants: StoreListingVariantsSchema.optional(),
});

export function formatZodIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

/** Helper: Parse AI response with automatic repair attempt */
export function parseAIResponse(
  jsonString: string
): ReturnType<typeof LaunchKitSchema.safeParse> {
  try {
    const parsed = JSON.parse(jsonString);
    return LaunchKitSchema.safeParse(parsed);
  } catch {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: "custom",
          message: "Invalid JSON format",
          path: [],
        },
      ]),
    } as ReturnType<typeof LaunchKitSchema.safeParse>;
  }
}

/** Helper: Extract JSON from markdown code blocks if needed */
export function extractJSON(text: string): string {
  // Remove markdown code fences if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return text.trim();
}
