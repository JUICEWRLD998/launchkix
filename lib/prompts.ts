/** LauchKix — Prompt engineering for launch kit generation */

import type { AppBrief } from "@/types/kit";

/**
 * System prompt - defines AI role and output format
 */
export const SYSTEM_PROMPT = `You are a senior mobile app growth marketer and ASO (App Store Optimization) specialist with 10+ years of experience launching successful apps.

Your expertise includes:
- Crafting compelling App Store and Google Play Store listings that convert
- ASO keyword research and optimization
- Social media launch strategies for X (Twitter), LinkedIn, and Instagram
- Email marketing for product launches
- Community engagement (Reddit, Product Hunt, Indie Hackers)
- Landing page copywriting that drives action

CRITICAL RULES:
1. Output ONLY valid JSON matching the exact schema provided
2. NO markdown code fences (no \`\`\`json or \`\`\`)
3. NO explanatory text before or after the JSON
4. Respect character limits for store fields (they will be specified)
5. Match the requested tone exactly
6. Tailor content to the target audience and goal
7. All content must be actionable, specific, and ready-to-use

CHARACTER LIMITS (MUST RESPECT):
- App Store title: max 30 characters
- App Store subtitle: max 30 characters
- App Store promotional text: max 170 characters
- Google Play short description: max 80 characters

TONE GUIDELINES:
- professional: Clear, trustworthy, benefit-focused, no hype
- playful: Fun, energetic, personality-driven, emojis OK
- bold: Confident, direct, results-focused, strong claims
- friendly: Warm, conversational, helpful, approachable`;

/**
 * Build prompt for generating complete launch kit
 */
export function buildFullKitPrompt(brief: AppBrief): string {
  const platformText =
    brief.platforms.length === 2
      ? "iOS and Android"
      : brief.platforms[0] === "ios"
      ? "iOS only"
      : "Android only";

  return `Generate a complete launch marketing kit for this mobile app:

APP DETAILS:
- Name: ${brief.name}
- Tagline: ${brief.tagline}
- Description: ${brief.description}
- Platforms: ${platformText}
- Category: ${brief.category}
- Target Audience: ${brief.targetAudience}
- Tone: ${brief.tone}
- Primary Goal: ${brief.goal === "downloads" ? "Maximize downloads" : brief.goal === "waitlist" ? "Build waitlist signups" : "Drive paid conversions"}

OUTPUT SCHEMA (respond with ONLY this JSON, no markdown fences):
{
  "appStore": {
    "title": "string (max 30 chars)",
    "subtitle": "string (max 30 chars)",
    "promotionalText": "string (max 170 chars)",
    "description": "string (full description, break into paragraphs with \\n\\n)",
    "whatsNew": "string (what's new in this version)"
  },
  "playStore": {
    "shortDescription": "string (max 80 chars)",
    "fullDescription": "string (full description, break into paragraphs with \\n\\n)"
  },
  "aso": {
    "primaryKeywords": ["string array, 5-10 high-volume keywords"],
    "secondaryKeywords": ["string array, 5-15 supporting keywords"],
    "longTail": ["string array, 3-10 long-tail keyword phrases"],
    "tips": ["string array, 3-5 ASO strategy tips specific to this app"]
  },
  "socialCalendar": [
    {
      "day": 1,
      "platform": "X",
      "hook": "string (attention-grabbing opening)",
      "body": "string (2-3 sentence post)",
      "cta": "string (clear call-to-action)"
    }
    // ... 7 total posts (days 1-7), mix of X, LinkedIn, Instagram
  ],
  "email": {
    "subjects": ["string array, 3-5 subject line options"],
    "body": "string (HTML-friendly email body for early users/waitlist)"
  },
  "communityPost": {
    "title": "string (Reddit/PH style: honest, intriguing)",
    "body": "string (authentic launch story, problem → solution → ask)"
  }
}

IMPORTANT:
- Make the 7-day social calendar diverse: mix platforms, angles (benefits, behind-scenes, social proof, urgency, tips)
- All content must sound ${brief.tone}
- Focus on the goal: ${brief.goal}
- Speak directly to: ${brief.targetAudience}
- Keep store titles under limits (this is critical for ASO)
- Be specific to "${brief.name}" - avoid generic phrases`;
}

/**
 * Build prompt for regenerating a single section
 */
export function buildSectionPrompt(
  brief: AppBrief,
  section: keyof Omit<
    import("@/types/kit").LaunchKit,
    "landingPage" | "pressBlurb" | "variants"
  >
): string {
  const platformText =
    brief.platforms.length === 2
      ? "iOS and Android"
      : brief.platforms[0] === "ios"
      ? "iOS only"
      : "Android only";

  const sectionSchemas: Record<string, string> = {
    appStore: `{
  "title": "string (max 30 chars, no subtitle appended)",
  "subtitle": "string (max 30 chars)",
  "promotionalText": "string (max 170 chars)",
  "description": "string (full description)",
  "whatsNew": "string"
}`,
    playStore: `{
  "shortDescription": "string (max 80 chars)",
  "fullDescription": "string (full description)"
}`,
    aso: `{
  "primaryKeywords": ["5-10 keyword strings"],
  "secondaryKeywords": ["5-15 keyword strings"],
  "longTail": ["3-10 long-tail phrase strings"],
  "tips": ["3-5 ASO tip strings"]
}`,
    socialCalendar: `[
  { "day": 1, "platform": "X", "hook": "string", "body": "string", "cta": "string" },
  { "day": 2, "platform": "LinkedIn", "hook": "string", "body": "string", "cta": "string" },
  { "day": 3, "platform": "Instagram", "hook": "string", "body": "string", "cta": "string" },
  { "day": 4, "platform": "X", "hook": "string", "body": "string", "cta": "string" },
  { "day": 5, "platform": "LinkedIn", "hook": "string", "body": "string", "cta": "string" },
  { "day": 6, "platform": "Instagram", "hook": "string", "body": "string", "cta": "string" },
  { "day": 7, "platform": "X", "hook": "string", "body": "string", "cta": "string" }
]`,
    email: `{
  "subjects": ["3-5 subject line strings"],
  "body": "string (email body)"
}`,
    communityPost: `{
  "title": "string (Reddit/ProductHunt-style title)",
  "body": "string (authentic post body)"
}`,
  };

  return `Regenerate ONLY the "${section}" section for this app:

APP DETAILS:
- Name: ${brief.name}
- Tagline: ${brief.tagline}
- Description: ${brief.description}
- Platforms: ${platformText}
- Category: ${brief.category}
- Target Audience: ${brief.targetAudience}
- Tone: ${brief.tone}
- Goal: ${brief.goal}

OUTPUT (respond with ONLY this JSON, no markdown):
${sectionSchemas[section]}

Make it ${brief.tone} and focused on ${brief.goal} for ${brief.targetAudience}.`;
}

/**
 * Build prompt for P1 feature: landing page copy
 */
export function buildLandingPagePrompt(brief: AppBrief): string {
  return `Generate landing page copy for "${brief.name}".

APP CONTEXT:
- Tagline: ${brief.tagline}
- Description: ${brief.description}
- Target: ${brief.targetAudience}
- Tone: ${brief.tone}

OUTPUT JSON (no markdown):
{
  "hero": "string (compelling headline, 6-12 words)",
  "subhead": "string (benefit-focused subheadline, 1-2 sentences)",
  "features": ["string array, 3 key features with benefit statements"],
  "cta": "string (action-oriented CTA text)"
}`;
}

/**
 * Build prompt for P1 feature: press blurb
 */
export function buildPressBlurbPrompt(brief: AppBrief): string {
  return `Generate a press/media kit blurb for "${brief.name}".

APP CONTEXT:
- Name: ${brief.name}
- Tagline: ${brief.tagline}
- Description: ${brief.description}
- Category: ${brief.category}

OUTPUT JSON (no markdown):
{
  "summary": "string (100-word press summary, newswire style)",
  "founderQuote": "string (1-2 sentence founder quote template with [Founder Name] placeholder)"
}`;
}

/**
 * Parse tone for human-readable display
 */
export function getToneDescription(tone: AppBrief["tone"]): string {
  const descriptions = {
    professional: "Clear, trustworthy, benefit-focused",
    playful: "Fun, energetic, personality-driven",
    bold: "Confident, direct, results-focused",
    friendly: "Warm, conversational, helpful",
  };
  return descriptions[tone];
}

/**
 * Parse goal for human-readable display
 */
export function getGoalDescription(goal: AppBrief["goal"]): string {
  const descriptions = {
    downloads: "Maximize app downloads",
    waitlist: "Build waitlist signups",
    paid: "Drive paid conversions",
  };
  return descriptions[goal];
}
