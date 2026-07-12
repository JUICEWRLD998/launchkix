"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";
import { fadeUp, staggerParent, inView } from "@/lib/motion";
import { Container } from "@/components/layout/Container";
import patterns from "@/styles/patterns.module.css";
import clsx from "clsx";
import styles from "./ProblemSolution.module.css";

export function ProblemSolution() {
  return (
    <section className={styles.section}>
      <Container size="lg">
        <motion.div
          className={styles.grid}
          variants={staggerParent(0.15)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          {/* Problem */}
          <motion.div
            className={clsx(patterns.glassCard, patterns.edgeLight, styles.card)}
            variants={fadeUp}
          >
            <div className={styles.icon} data-variant="problem">
              <AlertCircle size={24} />
            </div>
            <h3 className={styles.cardTitle}>The Launch Gap</h3>
            <p className={styles.cardBody}>
              Indie founders and small teams ship great apps, then fail at
              promotion. Weak store copy. No content calendar. No launch emails.
              No positioning. Freelancers charge $100–500 for the same work.
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div
            className={clsx(patterns.glassCard, patterns.edgeLight, styles.card)}
            variants={fadeUp}
          >
            <div className={styles.icon} data-variant="solution">
              <CheckCircle size={24} />
            </div>
            <h3 className={styles.cardTitle}>Complete Launch System</h3>
            <p className={styles.cardBody}>
              LauchKix turns app facts into a full promo system in under a
              minute. Store listings, ASO keywords, 7-day social calendar,
              launch emails, and press copy — all copyable, regenerable, and
              ready to publish.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
