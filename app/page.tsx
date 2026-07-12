import { MeshBackground } from "@/components/layout/MeshBackground";
import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/landing/Hero";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingStrip } from "@/components/landing/PricingStrip";
import { Footer } from "@/components/landing/Footer";
import patterns from "@/styles/patterns.module.css";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className="appShell">
      <div className={patterns.mesh} />
      <div className={patterns.filmGrain} />
      <Nav sticky glass />
      <main className={styles.main}>
        <Hero />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <PricingStrip />
      </main>
      <Footer />
    </div>
  );
}
