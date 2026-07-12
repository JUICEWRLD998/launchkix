"use client";

import { useState, type ReactNode } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { fadeUp } from "@/lib/motion";
import patterns from "@/styles/patterns.module.css";
import styles from "./SectionCard.module.css";

interface SectionCardProps {
  title: string;
  /** Plain text for the copy button */
  copyValue: string;
  /** Rendered content inside the card */
  children: ReactNode;
  /** Called when user clicks Regenerate */
  onRegenerate?: () => Promise<void>;
  /** Show an "AI-generated" trust badge */
  showBadge?: boolean;
  className?: string;
}

export function SectionCard({
  title,
  copyValue,
  children,
  onRegenerate,
  showBadge = true,
  className,
}: SectionCardProps) {
  const [regenerating, setRegenerating] = useState(false);

  async function handleRegenerate() {
    if (!onRegenerate || regenerating) return;
    setRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={clsx(
        styles.card,
        patterns.glassCard,
        patterns.edgeLight,
        className
      )}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>{title}</h3>
          {showBadge && (
            <Badge variant="default" size="sm">
              AI-generated
            </Badge>
          )}
        </div>
        <div className={styles.actions}>
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              loading={regenerating}
              onClick={handleRegenerate}
              aria-label={`Regenerate ${title}`}
            >
              <RotateCcw size={14} strokeWidth={1.8} aria-hidden="true" />
              Regenerate
            </Button>
          )}
          <CopyButton value={copyValue} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className={clsx(styles.content, regenerating && styles.contentLoading)}>
        {children}
      </div>
    </motion.div>
  );
}
