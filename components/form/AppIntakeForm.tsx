"use client";

import { useState, type FormEvent } from "react";
import clsx from "clsx";
import { Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import patterns from "@/styles/patterns.module.css";
import styles from "./AppIntakeForm.module.css";
import type { AppBrief, Platform, Tone, Goal } from "@/types/kit";

interface FormErrors {
  name?: string;
  tagline?: string;
  description?: string;
  platforms?: string;
  category?: string;
  targetAudience?: string;
  tone?: string;
  goal?: string;
}

interface AppIntakeFormProps {
  onSubmit: (brief: AppBrief) => void;
  loading?: boolean;
  initialValues?: Partial<AppBrief>;
}

const CATEGORIES = [
  "Health & Fitness",
  "Productivity",
  "Finance",
  "Social",
  "Education",
  "Entertainment",
  "Food & Drink",
  "Travel",
  "Shopping",
  "Utilities",
  "Games",
  "Business",
  "Music",
  "Photo & Video",
  "Other",
];

const TONE_OPTIONS: { value: Tone; label: string; desc: string }[] = [
  { value: "friendly", label: "Friendly", desc: "Warm and approachable" },
  { value: "professional", label: "Professional", desc: "Clear and trustworthy" },
  { value: "bold", label: "Bold", desc: "Confident and direct" },
  { value: "playful", label: "Playful", desc: "Light and energetic" },
];

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "downloads", label: "Maximize Downloads" },
  { value: "waitlist", label: "Build Waitlist" },
  { value: "paid", label: "Drive Paid Conversions" },
];

const DEFAULTS: AppBrief = {
  name: "",
  tagline: "",
  description: "",
  platforms: ["ios", "android"],
  category: "",
  targetAudience: "",
  tone: "friendly",
  goal: "downloads",
  language: "en",
};

function validate(values: AppBrief): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "App name is required";
  if (!values.tagline.trim()) errors.tagline = "Tagline is required";
  if (!values.description.trim() || values.description.length < 10)
    errors.description = "Description must be at least 10 characters";
  if (values.platforms.length === 0)
    errors.platforms = "Select at least one platform";
  if (!values.category) errors.category = "Category is required";
  if (!values.targetAudience.trim())
    errors.targetAudience = "Target audience is required";
  return errors;
}

export function AppIntakeForm({
  onSubmit,
  loading = false,
  initialValues,
}: AppIntakeFormProps) {
  const [values, setValues] = useState<AppBrief>({
    ...DEFAULTS,
    ...initialValues,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  function togglePlatform(p: Platform) {
    setValues((prev) => {
      const has = prev.platforms.includes(p);
      const next = has
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p];
      return { ...prev, platforms: next };
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(values);
    }
  }

  const fieldError = (k: keyof FormErrors) => (touched ? errors[k] : undefined);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={clsx(styles.form, patterns.glassCard, patterns.edgeLight)}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Launch Brief</h2>
        <p className={styles.subtitle}>
          Add the core app details. LauchKix will turn them into launch-ready marketing assets.
        </p>
      </div>

      <div className={styles.fields}>
        {/* App Name */}
        <Input
          label="App Name"
          required
          placeholder="e.g. FitTrack Pro"
          value={values.name}
          onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
          error={fieldError("name")}
          maxLength={100}
        />

        {/* Tagline */}
        <Input
          label="Tagline"
          required
          placeholder="e.g. Your AI fitness coach in your pocket"
          value={values.tagline}
          onChange={(e) => setValues((p) => ({ ...p, tagline: e.target.value }))}
          error={fieldError("tagline")}
          maxLength={200}
        />

        {/* Description */}
        <Textarea
          label="App Description"
          required
          placeholder="Describe what the app does, the core features, and what makes it useful."
          value={values.description}
          onChange={(e) =>
            setValues((p) => ({ ...p, description: e.target.value }))
          }
          error={fieldError("description")}
          rows={4}
          maxLength={2000}
        />

        {/* Platform */}
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>
            Platform <span className={styles.required}>*</span>
          </span>
          <div className={styles.platformRow}>
            {(["ios", "android"] as Platform[]).map((p) => (
              <button
                key={p}
                type="button"
                role="checkbox"
                aria-checked={values.platforms.includes(p)}
                onClick={() => togglePlatform(p)}
                className={clsx(
                  styles.platformBtn,
                  values.platforms.includes(p) && styles.platformBtnActive
                )}
              >
                {p === "ios" ? "iOS" : "Android"}
              </button>
            ))}
          </div>
          {fieldError("platforms") && (
            <p className={styles.errorText} role="alert">
              {fieldError("platforms")}
            </p>
          )}
        </div>

        {/* Category */}
        <Select
          label="Category"
          required
          value={values.category}
          onChange={(e) =>
            setValues((p) => ({ ...p, category: e.target.value }))
          }
          error={fieldError("category")}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        {/* Target Audience */}
        <Input
          label="Target Audience"
          required
          placeholder="e.g. Gym beginners aged 25–40"
          value={values.targetAudience}
          onChange={(e) =>
            setValues((p) => ({ ...p, targetAudience: e.target.value }))
          }
          error={fieldError("targetAudience")}
        />

        {/* Tone */}
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Tone</span>
          <div className={styles.toneGrid}>
            {TONE_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={values.tone === t.value}
                onClick={() => setValues((p) => ({ ...p, tone: t.value }))}
                className={clsx(
                  styles.toneBtn,
                  values.tone === t.value && styles.toneBtnActive
                )}
              >
                <span className={styles.toneBtnLabel}>{t.label}</span>
                <span className={styles.toneBtnDesc}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Primary Goal</span>
          <div className={styles.goalRow}>
            {GOAL_OPTIONS.map((g) => (
              <button
                key={g.value}
                type="button"
                role="radio"
                aria-checked={values.goal === g.value}
                onClick={() => setValues((p) => ({ ...p, goal: g.value }))}
                className={clsx(
                  styles.goalBtn,
                  values.goal === g.value && styles.goalBtnActive
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI trust badge */}
      <div className={styles.trustRow}>
        <Badge variant="accent" size="sm">
          Review generated copy before publishing
        </Badge>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="accent"
        size="lg"
        loading={loading}
        className={styles.submitBtn}
      >
        {loading ? "Generating kit..." : "Generate Launch Kit"}
      </Button>
    </form>
  );
}

// Expose fill method via ref if needed for ExampleChips
export type { AppIntakeFormProps };
