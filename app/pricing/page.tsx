import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";
import { MeshBackground } from "@/components/layout/MeshBackground";
import { Nav } from "@/components/layout/Nav";
import styles from "./page.module.css";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "For one-off launch planning and hackathon demos.",
    features: [
      "1 launch kit",
      "Store listing copy",
      "ASO keyword ideas",
      "Social calendar preview",
    ],
  },
  {
    name: "Founder",
    price: "$19/mo",
    description: "For indie founders preparing real mobile app launches.",
    featured: true,
    features: [
      "Unlimited launch kits",
      "Regenerate by section",
      "Markdown export",
      "Saved launch history",
    ],
  },
  {
    name: "Studio",
    price: "$49/mo",
    description: "For small teams launching multiple client or internal apps.",
    features: [
      "Team-ready launch kits",
      "A/B store variants",
      "Press and landing copy",
      "Priority generation limits",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <MeshBackground />
      <div className={styles.content}>
        <Nav sticky glass />
        <main className={styles.main}>
          <Container size="xl">
            <section className={styles.hero}>
              <Badge variant="accent" size="sm">
                Business model
              </Badge>
              <h1 className={styles.title}>Simple pricing for launch week</h1>
              <p className={styles.lead}>
                LauchKix starts free, then scales into paid plans for founders
                and studios who need repeatable launch assets.
              </p>
            </section>

            <section className={styles.grid} aria-label="Pricing plans">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  glass
                  edgeLight={plan.featured}
                  padding="lg"
                  className={styles.plan}
                >
                  <div className={styles.planHeader}>
                    <div>
                      <h2 className={styles.planName}>{plan.name}</h2>
                      <p className={styles.planDesc}>{plan.description}</p>
                    </div>
                    {plan.featured && (
                      <Badge variant="success" size="sm">
                        Best fit
                      </Badge>
                    )}
                  </div>
                  <p className={styles.price}>{plan.price}</p>
                  <ul className={styles.features}>
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </section>

            <div className={styles.ctaRow}>
              <Link href="/generate" className={buttonClassName("accent", "lg")}>
                Generate a launch kit
              </Link>
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
}
