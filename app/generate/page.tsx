"use client";

import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppIntakeForm } from "@/components/form/AppIntakeForm";
import { ExampleChips } from "@/components/form/ExampleChips";
import { KitResult, KitResultSkeleton } from "@/components/kit/KitResult";
import { Nav } from "@/components/layout/Nav";
import { Container } from "@/components/layout/Container";
import { MeshBackground } from "@/components/layout/MeshBackground";
import { useToastContext } from "@/components/providers/ToastProvider";
import { saveToHistory } from "@/lib/storage";
import { fadeUp, scaleIn } from "@/lib/motion";
import type {
  AppBrief,
  LaunchKit,
  LaunchKitResponse,
  GenerationMeta,
} from "@/types/kit";
import styles from "./page.module.css";

type State = "idle" | "loading" | "success" | "error";
type GenerateApiResponse = Partial<LaunchKitResponse> & { error?: string };

export default function GeneratePage() {
  const [state, setState] = useState<State>("idle");
  const [kit, setKit] = useState<LaunchKit | null>(null);
  const [meta, setMeta] = useState<GenerationMeta | null>(null);
  const [brief, setBrief] = useState<AppBrief | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [formKey, setFormKey] = useState(0); // bump to reset form fill
  const resultsRef = useRef<HTMLDivElement>(null);
  const { success: toastSuccess, error: toastError } = useToastContext();

  const handleGenerate = useCallback(async (submittedBrief: AppBrief) => {
    setState("loading");
    setErrorMsg("");
    setBrief(submittedBrief);

    // Scroll to results on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submittedBrief),
      });

      const data = (await res.json()) as GenerateApiResponse;

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed. Please try again.");
      }

      if (!data.kit || !data.meta) {
        throw new Error("Generation returned an incomplete response.");
      }

      setKit(data.kit);
      setMeta(data.meta);
      setState("success");
      saveToHistory(submittedBrief, data.kit, data.meta);
      toastSuccess("Launch kit ready!", `Generated in ${(data.meta.durationMs / 1000).toFixed(1)}s`);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err) {
      setState("error");
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setErrorMsg(msg);
      toastError("Generation failed", msg);
    }
  }, [toastSuccess, toastError]);

  const handleExampleSelect = useCallback((exampleBrief: AppBrief) => {
    setBrief(exampleBrief);
    setFormKey((k) => k + 1); // triggers re-render with new initialValues
  }, []);

  const handleSectionRegenerate = useCallback(
    (section: string, sectionData: Partial<LaunchKit>) => {
      setKit((prev) => (prev ? { ...prev, ...sectionData } : prev));
      toastSuccess(`${section} regenerated`);
    },
    [toastSuccess]
  );

  const handleRetry = () => {
    if (brief) handleGenerate(brief);
  };

  return (
    <div className={styles.page}>
      <MeshBackground />

      <div className={styles.content}>
        <Nav sticky glass />

        <Container size="xl">
          <div className={styles.layout}>
            {/* ── Left: Form panel ── */}
            <aside className={styles.formPanel}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className={styles.formStack}
              >
                <ExampleChips
                  onSelect={handleExampleSelect}
                  disabled={state === "loading"}
                />
                <AppIntakeForm
                  key={formKey}
                  onSubmit={handleGenerate}
                  loading={state === "loading"}
                  initialValues={brief ?? undefined}
                />
              </motion.div>
            </aside>

            {/* ── Right: Results panel ── */}
            <section
              ref={resultsRef}
              className={styles.resultsPanel}
              aria-live="polite"
              aria-label="Generated launch kit"
            >
              <AnimatePresence mode="wait">
                {/* Empty state */}
                {state === "idle" && (
                  <motion.div
                    key="empty"
                    variants={scaleIn}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0 }}
                    className={styles.emptyState}
                  >
                    <h2 className={styles.emptyTitle}>
                      Your launch kit will appear here
                    </h2>
                    <p className={styles.emptyBody}>
                      Fill in your app details and click{" "}
                      <strong>Generate Launch Kit</strong> — or pick one of the
                      examples to see it in action.
                    </p>
                    <ul className={styles.emptyFeatures}>
                      <li>App Store &amp; Google Play listings</li>
                      <li>ASO keyword pack</li>
                      <li>7-day social media calendar</li>
                      <li>Launch email + community post</li>
                    </ul>
                  </motion.div>
                )}

                {/* Loading state */}
                {state === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={styles.loadingHeader}>
                      <div className={styles.loadingDot} aria-hidden="true" />
                      <p className={styles.loadingText}>
                        Crafting your launch kit with AI...
                      </p>
                    </div>
                    <KitResultSkeleton />
                  </motion.div>
                )}

                {/* Error state */}
                {state === "error" && (
                  <motion.div
                    key="error"
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0 }}
                    className={styles.errorState}
                  >
                    <h2 className={styles.errorTitle}>Generation failed</h2>
                    <p className={styles.errorBody}>{errorMsg}</p>
                    <button
                      onClick={handleRetry}
                      className={styles.retryBtn}
                    >
                      Try again
                    </button>
                  </motion.div>
                )}

                {/* Success state */}
                {state === "success" && kit && brief && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {meta && (
                      <div className={styles.metaBar}>
                        <span className={styles.metaBadge}>
                          {brief.name}
                        </span>
                        <span className={styles.metaTime}>
                          {(meta.durationMs / 1000).toFixed(1)}s · {meta.model}
                        </span>
                      </div>
                    )}
                    <KitResult
                      kit={kit}
                      brief={brief}
                      onRegenerate={handleSectionRegenerate}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </Container>
      </div>
    </div>
  );
}
