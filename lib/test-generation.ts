/** Test script for AI generation - run with: npx tsx lib/test-generation.ts */

// Load environment variables from .env.local
import * as fs from "fs";
import * as path from "path";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join("=").trim();
      }
    }
  });
}

import { getOpenRouterClient } from "./openrouter";
import { buildFullKitPrompt, SYSTEM_PROMPT } from "./prompts";
import { parseAIResponse, extractJSON } from "./schema";
import type { AppBrief } from "@/types/kit";

const sampleBrief: AppBrief = {
  name: "FitTrack Pro",
  tagline: "Your AI fitness coach in your pocket",
  description:
    "FitTrack Pro uses AI to create personalized workout plans based on your fitness level, goals, and available equipment. Track your progress with smart analytics, get real-time form corrections using your phone camera, and stay motivated with achievement badges and social challenges.",
  platforms: ["ios", "android"],
  category: "Health & Fitness",
  targetAudience: "Fitness beginners and intermediate gym-goers aged 25-40",
  tone: "friendly",
  goal: "downloads",
  language: "en",
};

async function testGeneration() {
  console.log("🚀 Testing LauchKix AI Generation\n");
  console.log("Sample App Brief:");
  console.log(JSON.stringify(sampleBrief, null, 2));
  console.log("\n" + "=".repeat(60) + "\n");

  try {
    const client = getOpenRouterClient();
    const prompt = buildFullKitPrompt(sampleBrief);

    console.log("📝 Sending request to OpenRouter...\n");

    const startTime = Date.now();
    const response = await client.chatCompletion({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      maxTokens: 4000,
      json: true,
    });
    const durationMs = Date.now() - startTime;

    console.log(`✅ Response received in ${durationMs}ms`);
    console.log(`🤖 Model: ${response.model}\n`);

    console.log("📄 Raw response (first 500 chars):");
    console.log(response.content.substring(0, 500) + "...\n");

    // Extract JSON if wrapped in markdown
    const jsonContent = extractJSON(response.content);

    // Parse with Zod
    console.log("🔍 Validating with Zod schema...\n");
    const parseResult = parseAIResponse(jsonContent);

    if (!parseResult.success) {
      console.log("❌ Validation FAILED\n");
      parseResult.error.issues.forEach((err) => {
        console.log(`  - ${err.path.join(".")}: ${err.message}`);
      });
      // Also dump raw for debugging
      console.log("\nRaw parse error:");
      console.log(JSON.stringify(parseResult.error, null, 2).substring(0, 800));
      console.log("\n❌ TEST FAILED - Schema validation errors\n");
      return false;
    }

    if (parseResult.success) {
      console.log("✅ Validation SUCCESS!\n");
      console.log("📊 Generated Launch Kit Structure:");
      const kit = parseResult.data;
      console.log(`  - App Store title: "${kit.appStore.title}" (${kit.appStore.title.length} chars)`);
      console.log(`  - Play Store short: "${kit.playStore.shortDescription}" (${kit.playStore.shortDescription.length} chars)`);
      console.log(`  - ASO primary keywords: ${kit.aso.primaryKeywords.length} items`);
      console.log(`  - Social calendar: ${kit.socialCalendar.length} posts`);
      console.log(`  - Email subjects: ${kit.email.subjects.length} options`);
      console.log(`  - Community post: "${kit.communityPost.title}"\n`);

      // Check character limits
      const issues = [];
      if (kit.appStore.title.length > 30) issues.push(`App Store title too long (${kit.appStore.title.length}/30)`);
      if (kit.appStore.subtitle.length > 30) issues.push(`Subtitle too long (${kit.appStore.subtitle.length}/30)`);
      if (kit.appStore.promotionalText.length > 170) issues.push(`Promo text too long (${kit.appStore.promotionalText.length}/170)`);
      if (kit.playStore.shortDescription.length > 80) issues.push(`Play short desc too long (${kit.playStore.shortDescription.length}/80)`);

      if (issues.length > 0) {
        console.log("⚠️  Character limit warnings:");
        issues.forEach((issue) => console.log(`  - ${issue}`));
      } else {
        console.log("✅ All character limits respected!");
      }

      console.log("\n🎉 TEST PASSED — AI generation working correctly!\n");
      return true;
    }

    return false;
  } catch (error) {
    console.log("❌ TEST FAILED - Exception thrown\n");
    console.error(error);
    return false;
  }
}

// Run test if executed directly
if (require.main === module) {
  testGeneration()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

export { testGeneration, sampleBrief };
