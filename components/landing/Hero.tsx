"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fadeUp, staggerParent } from "@/lib/motion";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <Container size="lg">
        <motion.div
          className={styles.content}
          variants={staggerParent(0.12, 0.1)}
          initial="hidden"
          animate="show"
        >
          <motion.div className={styles.badge} variants={fadeUp}>
            <Sparkles size={14} />
            <span>AI-Powered Launch Marketing</span>
          </motion.div>

          <motion.h1 className={styles.title} variants={fadeUp}>
            Ship the app.{" "}
            <span className={styles.accent}>We'll ship the launch.</span>
          </motion.h1>

          <motion.p className={styles.subtitle} variants={fadeUp}>
            Paste your mobile app details and get a complete launch marketing
            kit in under 60 seconds — store listings, ASO keywords, social
            calendar, emails, and press copy.
          </motion.p>

          <motion.div className={styles.actions} variants={fadeUp}>
            <Link href="/generate" className={buttonClassName("accent", "lg")}>
              Generate Launch Kit
            </Link>
            <Link
              href="/pricing"
              className={buttonClassName("secondary", "lg")}
            >
              See Pricing
            </Link>
          </motion.div>

          <motion.div className={styles.trust} variants={fadeUp}>
            <p className={styles.trustText}>
              Free tier • No credit card • 1 kit per day
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
