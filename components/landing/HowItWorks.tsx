"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerParent, inView } from "@/lib/motion";
import { Container } from "@/components/layout/Container";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    number: "01",
    title: "Paste app details",
    description:
      "Fill in your app name, description, platform, category, target audience, and tone. Or use one of our example apps to try instantly.",
  },
  {
    number: "02",
    title: "Generate in 15 seconds",
    description:
      "Gemini AI analyzes your brief and generates a structured launch kit with store listings, ASO keywords, social calendar, and emails.",
  },
  {
    number: "03",
    title: "Copy and launch",
    description:
      "Review, regenerate any section you want to tweak, then copy to your clipboard or export as Markdown. Ready to publish.",
  },
];

export function HowItWorks() {
  return (
    <section className={styles.section}>
      <Container size="lg">
        <motion.div
          className={styles.header}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={fadeUp}
        >
          <h2 className={styles.title}>How it works</h2>
          <p className={styles.subtitle}>
            From blank form to complete launch kit in three simple steps.
          </p>
        </motion.div>

        <motion.div
          className={styles.steps}
          variants={staggerParent(0.15, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {steps.map((step) => (
            <motion.div key={step.number} className={styles.step} variants={fadeUp}>
              <div className={styles.badge}>
                <span className={styles.number}>{step.number}</span>
              </div>
              <div className={styles.content}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
