"use client";

import clsx from "clsx";
import { EXAMPLE_APPS } from "@/lib/examples";
import type { AppBrief } from "@/types/kit";
import styles from "./ExampleChips.module.css";

interface ExampleChipsProps {
  onSelect: (brief: AppBrief) => void;
  disabled?: boolean;
}

export function ExampleChips({ onSelect, disabled }: ExampleChipsProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Try an example:</span>
      <div className={styles.chips}>
        {EXAMPLE_APPS.map((example) => (
          <button
            key={example.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(example.brief)}
            className={clsx(styles.chip, disabled && styles.chipDisabled)}
          >
            <span className={styles.chipMark} aria-hidden="true" />
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
