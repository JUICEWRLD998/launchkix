import Link from "next/link";
import { Check, Users, Zap, Globe, TrendingUp } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/landing/Footer";
import { buttonClassName } from "@/components/ui/Button";
import patterns from "@/styles/patterns.module.css";
import clsx from "clsx";
import styles from "./page.module.css";

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
      "Community support",
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
      "Email support",
    ],
    cta: "Get Pro",
    href: "/generate",
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
      "Quarterly strategy session",
    ],
    cta: "Get Studio",
    href: "/generate",
    featured: false,
  },
];

const whoItsFor = [
  {
    icon: Users,
    title: "Solo Indie Founders",
    description:
      "You built the app solo. Now ship the marketing in 60 seconds instead of wasting weekends on copywriting.",
  },
  {
    icon: Zap,
    title: "Small App Studios",
    description:
      "Launching multiple apps per quarter? Generate consistent, on-brand launch kits for every release.",
  },
  {
    icon: Globe,
    title: "Student Teams",
    description:
      "Built an app for a hackathon or class project? Get professional launch materials instantly.",
  },
  {
    icon: TrendingUp,
    title: "SMB Internal Apps",
    description:
      "Launching internal or client-facing mobile apps? Professional marketing materials without hiring a copywriter.",
  },
];

export default function PricingPage() {
  return (
    <div className="appShell">
      <div className={patterns.mesh} />
      <div className={patterns.filmGrain} />
      <Nav sticky glass />

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <Container size="lg">
            <div className={styles.heroContent}>
              <h1 className={styles.title}>
                Choose your <span className={styles.accent}>launch plan</span>
              </h1>
              <p className={styles.subtitle}>
                Start free, upgrade when you're ready. All plans include core
                launch kit features. No hidden fees, cancel anytime.
              </p>
            </div>
          </Container>
        </section>

        {/* Pricing tiers */}
        <section className={styles.pricingSection}>
          <Container size="xl">
            <div className={styles.grid}>
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={clsx(
                    patterns.glassCard,
                    patterns.edgeLight,
                    styles.card,
                    tier.featured && styles.featured
                  )}
                >
                  {tier.featured && (
                    <div className={styles.popularBadge}>Most Popular</div>
                  )}
                  <div className={styles.cardHeader}>
                    <h2 className={styles.tierName}>{tier.name}</h2>
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
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Who it's for */}
        <section className={styles.whoSection}>
          <Container size="xl">
            <div className={styles.whoHeader}>
              <h2 className={styles.sectionTitle}>Who it's for</h2>
              <p className={styles.sectionSubtitle}>
                LauchKix is built for anyone launching a mobile app who needs
                professional marketing materials fast.
              </p>
            </div>

            <div className={styles.whoGrid}>
              {whoItsFor.map((item) => (
                <div
                  key={item.title}
                  className={clsx(
                    patterns.glassCard,
                    patterns.edgeLight,
                    styles.whoCard
                  )}
                >
                  <div className={styles.whoIcon}>
                    <item.icon size={24} />
                  </div>
                  <h3 className={styles.whoTitle}>{item.title}</h3>
                  <p className={styles.whoDescription}>{item.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ROI comparison */}
        <section className={styles.roiSection}>
          <Container size="lg">
            <div
              className={clsx(
                patterns.glassCard,
                patterns.edgeLight,
                styles.roiCard
              )}
            >
              <h2 className={styles.roiTitle}>
                LauchKix Pro vs. Hiring a Freelancer
              </h2>
              <div className={styles.roiGrid}>
                <div className={styles.roiColumn}>
                  <div className={styles.roiLabel}>Freelance Copywriter</div>
                  <div className={styles.roiPrice}>$150–$400</div>
                  <div className={styles.roiTime}>3–7 days turnaround</div>
                  <ul className={styles.roiList}>
                    <li>1 revision included</li>
                    <li>One-time deliverable</li>
                    <li>No A/B variants</li>
                    <li>Email back-and-forth</li>
                  </ul>
                </div>

                <div className={styles.roiDivider} />

                <div className={styles.roiColumn}>
                  <div className={styles.roiLabel}>LauchKix Pro</div>
                  <div className={styles.roiPrice}>$19/month</div>
                  <div className={styles.roiTime}>60 seconds per kit</div>
                  <ul className={styles.roiList}>
                    <li>Unlimited regenerations</li>
                    <li>Unlimited kits</li>
                    <li>A/B variants included</li>
                    <li>Instant delivery</li>
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <Container size="md">
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to launch?</h2>
              <p className={styles.ctaText}>
                Start with a free kit today. No credit card required.
              </p>
              <Link
                href="/generate"
                className={buttonClassName("accent", "lg")}
              >
                Generate Your First Kit
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
