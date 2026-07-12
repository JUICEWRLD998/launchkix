"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { fadeUp, staggerParent, inView } from "@/lib/motion";
import { Container } from "@/components/layout/Container";
import { buttonClassName } from "@/components/ui/Button";
import patterns from "@/styles/patterns.module.css";
import clsx from "clsx";
import styles from "./PricingStrip.module.css";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying LauchKix with your first app launch.",
    features: [
      "1 kit per day",
      "All core sections included",
      "Copy & export as Markdown",
      "English language only",
    ],
    cta: "Start Free",
    href: "/generate",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For indie founders launching multiple apps or iterating fast.",
    features: [
      "Unlimited kits",
      "Multi-language support",
      "A/B variants for testing",
      "Priority model & faster generation",
      "Export as JSON",
    ],
    cta: "Get Pro",
    href: "/pricing",
    featured: true,
  },
  {
    name: "Studio",
    price: "$49",
    period: "per month",
    description: "For small teams and agencies launching apps for clients.",
    features: [
      "Everything in Pro",
      "5 team seats (coming soon)",
      "Shared kit history (coming soon)",
      "Custom brand tone presets",
      "Priority support",
    ],
    cta: "Get Studio",
    href: "/pricing",
    featured: false,
  },
];

export function PricingStrip() {
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
          <h2 className={styles.title}>Simple, transparent pricing</h2>
          <p className={styles.subtitle}>
            Start free, upgrade when you're ready. All plans include core launch kit features.
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={staggerParent(0.12, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              className={clsx(
                patterns.glassCard,
                patterns.edgeLight,
                styles.card,
                tier.featured && styles.featured
              )}
              variants={fadeUp}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.tierName}>{tier.name}</h3>
                <div className={styles.priceBlock}>
                  <span className={styles.price}>{tier.price}</span>
                  <span className={styles.period}>/{tier.period}</span>
                </div>
                <p className={styles.description}>{tier.description}</p>
              </div>

              <ul className={styles.features}>
                {tier.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    <Check size={18} className={styles.checkIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={buttonClassName(
                  tier.featured ? "accent" : "secondary",
                  "md",
                  styles.ctaButton
                )}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
