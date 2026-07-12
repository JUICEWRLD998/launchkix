"use client";

import Link from "next/link";
import { type HTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./Nav.module.css";
import { Container } from "./Container";
import { buttonClassName } from "@/components/ui/Button";

export interface NavProps extends HTMLAttributes<HTMLElement> {
  sticky?: boolean;
  glass?: boolean;
}

export function Nav({ sticky = false, glass = false, className, ...props }: NavProps) {
  return (
    <nav
      className={clsx(
        styles.nav,
        sticky && styles.sticky,
        glass && styles.glass,
        className
      )}
      {...props}
    >
      <Container size="xl">
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>
              Lauch<span className={styles.logoAccent}>Kix</span>
            </span>
          </Link>

          <div className={styles.links}>
            <Link href="/generate" className={styles.link}>
              Generate
            </Link>
            <Link href="/pricing" className={styles.link}>
              Pricing
            </Link>
          </div>

          <div className={styles.actions}>
            <Link
              href="/generate"
              className={buttonClassName("accent", "md", styles.ctaButton)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}
