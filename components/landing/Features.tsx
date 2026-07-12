"use client";

import { motion } from "framer-motion";
import { Sparkles, Rocket, RefreshCw, Globe, Zap, Copy } from "lucide-react";
import { fadeUp, staggerParent, inView } from "@/lib/motion";
import { Container } from "@/components/layout/Container";
import patterns from "@/styles/patterns.module.css";
import clsx from "clsx";
import styles from "./Features.module.css";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Kit Generation",
    description:
      "Gemini 2.5 Flash generates structured, on-brand launch content tailored to your app's tone, audience, and platform in seconds.",
  },
  {
    icon: Rocket,
    title: "Complete Launch System",
    description:
      "Store listings (App Store + Play), ASO keywords, 7-day social calendar, launch emails, and community posts — everything you need.",
  },
  {
    icon: RefreshCw,
    title: "Regenerate Any Section",
    description:
      "Not perfect the first time? Regenerate individual sections while keeping the rest of your kit intact. Iterate until it's right.",
  },
  {
    icon: Globe,
    title: "Multi-Platform Ready",
    description:
      "iOS, Android, or both — LauchKix understands platform-specific requirements and optimizes copy for each store.",
  },
  {
    icon: Zap,
    title: "Under 60 Seconds",
    description:
      "From blank form to complete launch kit in under a minute. No waiting, no manual research, no writer's block.",
  },
  {
    icon: Copy,
    title: "One-Click Copy & Export",
    description:
      "Copy individual sections or export your entire kit as Markdown. Ready to paste directly into your store console or CMS.",
  },
];

export function Features() {
  return (
    <section className={styles.section}>
      <Container size="xl">
        <motion.div
          className={styles.header}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={fadeUp}
        >
          <h2 className={styles.title}>Launch faster, launch better</h2>
          <p className={styles.subtitle}>
            Everything you need to promote your mobile app, powered by AI and
            optimized for real stores.
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={staggerParent(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className={clsx(patterns.glassCard, patterns.edgeLight, styles.card)}
              variants={fadeUp}
            >
              <div className={styles.icon}>
                <feature.icon size={24} />
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardBody}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
