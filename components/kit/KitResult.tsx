"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { SectionCard } from "./SectionCard";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";
import { useToastContext } from "@/components/providers/ToastProvider";
import { staggerParent, fadeUp } from "@/lib/motion";
import styles from "./KitResult.module.css";
import type {
  LaunchKit,
  AppBrief,
  AppStoreListing,
  PlayStoreListing,
  ASOKeywords,
  SocialPost,
  LaunchEmail,
  CommunityPost,
} from "@/types/kit";

type RegeneratableSection =
  | "appStore"
  | "playStore"
  | "aso"
  | "socialCalendar"
  | "email"
  | "communityPost";

interface KitResultProps {
  kit: LaunchKit;
  brief: AppBrief;
  onRegenerate: (
    section: RegeneratableSection,
    data: Partial<LaunchKit>
  ) => void;
}

const TABS = [
  { value: "appStore", label: "App Store" },
  { value: "playStore", label: "Google Play" },
  { value: "aso", label: "ASO Keywords" },
  { value: "socialCalendar", label: "Social" },
  { value: "email", label: "Email" },
  { value: "communityPost", label: "Community" },
] as const;

function sectionLabel(section: RegeneratableSection) {
  return TABS.find((tab) => tab.value === section)?.label ?? "Section";
}

const PLATFORM_ICONS: Record<string, string> = {
  X: "𝕏",
  LinkedIn: "in",
  Instagram: "IG",
};

/** Format LaunchKit section into plain copyable text */
function kitSectionToText(kit: LaunchKit, section: RegeneratableSection): string {
  switch (section) {
    case "appStore": {
      const s = kit.appStore;
      return `Title: ${s.title}\nSubtitle: ${s.subtitle}\nPromotional Text: ${s.promotionalText}\n\nDescription:\n${s.description}\n\nWhat's New:\n${s.whatsNew}`;
    }
    case "playStore": {
      const s = kit.playStore;
      return `Short Description: ${s.shortDescription}\n\nFull Description:\n${s.fullDescription}`;
    }
    case "aso": {
      const s = kit.aso;
      return `Primary Keywords:\n${s.primaryKeywords.join(", ")}\n\nSecondary Keywords:\n${s.secondaryKeywords.join(", ")}\n\nLong-Tail Phrases:\n${s.longTail.join(", ")}\n\nASO Tips:\n${s.tips.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;
    }
    case "socialCalendar": {
      return kit.socialCalendar
        .map(
          (p) =>
            `Day ${p.day} — ${p.platform}\n${p.hook}\n${p.body}\nCTA: ${p.cta}`
        )
        .join("\n\n---\n\n");
    }
    case "email": {
      const s = kit.email;
      return `Subject Lines:\n${s.subjects.map((sub, i) => `${i + 1}. ${sub}`).join("\n")}\n\nEmail Body:\n${s.body}`;
    }
    case "communityPost": {
      const s = kit.communityPost;
      return `${s.title}\n\n${s.body}`;
    }
  }
}

/** Copy all sections as markdown */
function kitToMarkdown(kit: LaunchKit): string {
  return `# Launch Kit

## App Store Listing
**Title:** ${kit.appStore.title}
**Subtitle:** ${kit.appStore.subtitle}
**Promotional Text:** ${kit.appStore.promotionalText}

### Description
${kit.appStore.description}

### What's New
${kit.appStore.whatsNew}

---

## Google Play Listing
**Short Description:** ${kit.playStore.shortDescription}

### Full Description
${kit.playStore.fullDescription}

---

## ASO Keywords
**Primary:** ${kit.aso.primaryKeywords.join(", ")}
**Secondary:** ${kit.aso.secondaryKeywords.join(", ")}
**Long-Tail:** ${kit.aso.longTail.join(", ")}

### Tips
${kit.aso.tips.map((t, i) => `${i + 1}. ${t}`).join("\n")}

---

## 7-Day Social Calendar
${kit.socialCalendar.map((p) => `### Day ${p.day} — ${p.platform}\n${p.hook}\n\n${p.body}\n\n**CTA:** ${p.cta}`).join("\n\n---\n\n")}

---

## Launch Email
### Subject Lines
${kit.email.subjects.map((s, i) => `${i + 1}. ${s}`).join("\n")}

### Body
${kit.email.body}

---

## Community Post
### ${kit.communityPost.title}
${kit.communityPost.body}
`;
}

/* ─────────────────── Sub-renderers ─────────────────── */

function AppStoreSection({ data }: { data: AppStoreListing }) {
  return (
    <div className={styles.sectionBody}>
      <div className={styles.fieldRow}>
        <div className={styles.fieldItem}>
          <span className={styles.fieldKey}>Title</span>
          <span className={styles.fieldVal}>{data.title}</span>
          <span className={styles.charCount}>{data.title.length}/30</span>
        </div>
        <div className={styles.fieldItem}>
          <span className={styles.fieldKey}>Subtitle</span>
          <span className={styles.fieldVal}>{data.subtitle}</span>
          <span className={styles.charCount}>{data.subtitle.length}/30</span>
        </div>
      </div>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Promotional Text</span>
        <span className={styles.fieldVal}>{data.promotionalText}</span>
        <span className={styles.charCount}>{data.promotionalText.length}/170</span>
      </div>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Description</span>
        <p className={styles.body}>{data.description}</p>
      </div>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>What&apos;s New</span>
        <p className={styles.body}>{data.whatsNew}</p>
      </div>
    </div>
  );
}

function PlayStoreSection({ data }: { data: PlayStoreListing }) {
  return (
    <div className={styles.sectionBody}>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Short Description</span>
        <span className={styles.fieldVal}>{data.shortDescription}</span>
        <span className={styles.charCount}>{data.shortDescription.length}/80</span>
      </div>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Full Description</span>
        <p className={styles.body}>{data.fullDescription}</p>
      </div>
    </div>
  );
}

function ASOSection({ data }: { data: ASOKeywords }) {
  return (
    <div className={styles.sectionBody}>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Primary Keywords</span>
        <div className={styles.tagCloud}>
          {data.primaryKeywords.map((kw) => (
            <Badge key={kw} variant="accent" size="sm">{kw}</Badge>
          ))}
        </div>
      </div>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Secondary Keywords</span>
        <div className={styles.tagCloud}>
          {data.secondaryKeywords.map((kw) => (
            <Badge key={kw} variant="default" size="sm">{kw}</Badge>
          ))}
        </div>
      </div>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Long-Tail Phrases</span>
        <div className={styles.tagCloud}>
          {data.longTail.map((kw) => (
            <Badge key={kw} variant="default" size="sm">{kw}</Badge>
          ))}
        </div>
      </div>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>ASO Tips</span>
        <ol className={styles.tipList}>
          {data.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function SocialSection({ data }: { data: SocialPost[] }) {
  return (
    <motion.div
      className={styles.socialGrid}
      variants={staggerParent(0.06)}
      initial="hidden"
      animate="show"
    >
      {data.map((post) => (
        <motion.div key={post.day} variants={fadeUp} className={styles.socialPost}>
          <div className={styles.socialHeader}>
            <span className={styles.socialDay}>Day {post.day}</span>
            <Badge variant="default" size="sm">
              {PLATFORM_ICONS[post.platform] ?? post.platform} {post.platform}
            </Badge>
          </div>
          <p className={styles.socialHook}>{post.hook}</p>
          <p className={styles.body}>{post.body}</p>
          <div className={styles.socialCta}>
            <span className={styles.fieldKey}>CTA:</span>
            <span>{post.cta}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function EmailSection({ data }: { data: LaunchEmail }) {
  return (
    <div className={styles.sectionBody}>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Subject Lines</span>
        <ol className={styles.subjectList}>
          {data.subjects.map((sub, i) => (
            <li key={i} className={styles.subjectItem}>{sub}</li>
          ))}
        </ol>
      </div>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Email Body</span>
        <p className={styles.body}>{data.body}</p>
      </div>
    </div>
  );
}

function CommunitySection({ data }: { data: CommunityPost }) {
  return (
    <div className={styles.sectionBody}>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Post Title</span>
        <p className={styles.communityTitle}>{data.title}</p>
      </div>
      <div className={styles.fieldItem}>
        <span className={styles.fieldKey}>Post Body</span>
        <p className={styles.body}>{data.body}</p>
      </div>
    </div>
  );
}

/* ─────────────────── Main component ─────────────────── */

export function KitResult({ kit, brief, onRegenerate }: KitResultProps) {
  const [activeTab, setActiveTab] = useState<string>("appStore");
  const { success, error } = useToastContext();

  async function handleRegenerate(section: RegeneratableSection) {
    try {
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, section }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Regeneration failed");
      }
      onRegenerate(section, { [section]: json.data });
      success("Section regenerated", `${sectionLabel(section)} is ready.`);
    } catch (err) {
      error(
        "Regeneration failed",
        err instanceof Error ? err.message : "Please try again."
      );
    }
  }

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className={styles.root}
    >
      {/* Tab list */}
      <Tabs.List className={styles.tabList} aria-label="Launch kit sections">
        {TABS.map((tab) => (
          <Tabs.Trigger key={tab.value} value={tab.value} className={styles.tab}>
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {/* Tab panels */}
      <div className={styles.panels}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "appStore" && (
              <SectionCard
                title="App Store Listing"
                copyValue={kitSectionToText(kit, "appStore")}
                onRegenerate={() => handleRegenerate("appStore")}
              >
                <AppStoreSection data={kit.appStore} />
              </SectionCard>
            )}

            {activeTab === "playStore" && (
              <SectionCard
                title="Google Play Listing"
                copyValue={kitSectionToText(kit, "playStore")}
                onRegenerate={() => handleRegenerate("playStore")}
              >
                <PlayStoreSection data={kit.playStore} />
              </SectionCard>
            )}

            {activeTab === "aso" && (
              <SectionCard
                title="ASO Keyword Pack"
                copyValue={kitSectionToText(kit, "aso")}
                onRegenerate={() => handleRegenerate("aso")}
              >
                <ASOSection data={kit.aso} />
              </SectionCard>
            )}

            {activeTab === "socialCalendar" && (
              <SectionCard
                title="7-Day Social Calendar"
                copyValue={kitSectionToText(kit, "socialCalendar")}
                onRegenerate={() => handleRegenerate("socialCalendar")}
              >
                <SocialSection data={kit.socialCalendar} />
              </SectionCard>
            )}

            {activeTab === "email" && (
              <SectionCard
                title="Launch Email"
                copyValue={kitSectionToText(kit, "email")}
                onRegenerate={() => handleRegenerate("email")}
              >
                <EmailSection data={kit.email} />
              </SectionCard>
            )}

            {activeTab === "communityPost" && (
              <SectionCard
                title="Community Post"
                copyValue={kitSectionToText(kit, "communityPost")}
                onRegenerate={() => handleRegenerate("communityPost")}
              >
                <CommunitySection data={kit.communityPost} />
              </SectionCard>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Copy all footer */}
      <div className={styles.footer}>
        <span className={styles.footerMeta}>
          {TABS.length} sections generated
        </span>
        <CopyButton
          value={kitToMarkdown(kit)}
          successMessage="Full launch kit copied"
          variant="secondary"
          size="sm"
          className={styles.copyAllBtn}
        >
          Copy all as Markdown
        </CopyButton>
      </div>
    </Tabs.Root>
  );
}

/* ── Skeleton version for loading state ── */

export function KitResultSkeleton() {
  return (
    <div className={styles.root}>
      <div className={styles.tabList}>
        {TABS.map((tab) => (
          <Skeleton key={tab.value} variant="text" width={80} height={36} />
        ))}
      </div>
      <div className={styles.panels}>
        <div className={styles.skeletonCard}>
          <Skeleton variant="text" width="40%" height={28} animate />
          <SkeletonText lines={3} animate />
          <SkeletonText lines={5} animate />
          <SkeletonText lines={2} lastLineWidth="60%" animate />
        </div>
      </div>
    </div>
  );
}
