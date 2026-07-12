/** LauchKix — 3 preset example app briefs for quick demo fills */

import type { AppBrief } from "@/types/kit";

export interface ExampleApp {
  label: string;
  brief: AppBrief;
}

export const EXAMPLE_APPS: ExampleApp[] = [
  {
    label: "Fitness",
    brief: {
      name: "FitTrack Pro",
      tagline: "Your AI fitness coach in your pocket",
      description:
        "FitTrack Pro uses AI to create personalized workout plans based on your fitness level, goals, and available equipment. Track your progress with smart analytics, get real-time form corrections using your phone camera, and stay motivated with achievement badges and social challenges.",
      platforms: ["ios", "android"],
      category: "Health & Fitness",
      targetAudience: "Fitness beginners and intermediate gym-goers aged 25–40",
      tone: "friendly",
      goal: "downloads",
      language: "en",
    },
  },
  {
    label: "Productivity",
    brief: {
      name: "FocusFlow",
      tagline: "Deep work, on demand",
      description:
        "FocusFlow combines the Pomodoro technique with AI task prioritization to help knowledge workers eliminate distractions and finish what matters. Get a smart daily plan, block distracting apps automatically, and track your deep-work streaks across projects.",
      platforms: ["ios", "android"],
      category: "Productivity",
      targetAudience: "Remote workers, freelancers, and students aged 20–35",
      tone: "professional",
      goal: "downloads",
      language: "en",
    },
  },
  {
    label: "Finance",
    brief: {
      name: "SpendSense",
      tagline: "Know where your money goes",
      description:
        "SpendSense automatically categorizes your transactions, spots spending patterns, and gives you plain-English budget advice without the spreadsheet headache. Connect all your accounts in 30 seconds, get weekly financial health scores, and set savings goals that actually stick.",
      platforms: ["ios", "android"],
      category: "Finance",
      targetAudience: "Young professionals aged 22–35 who want to save more",
      tone: "friendly",
      goal: "paid",
      language: "en",
    },
  },
];
