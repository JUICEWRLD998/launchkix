import Link from "next/link";
import { Container } from "@/components/layout/Container";
import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container size="xl">
        <div className={styles.content}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>
                Lauch<span className={styles.logoAccent}>Kix</span>
              </span>
            </Link>
            <p className={styles.tagline}>
              Ship the app. We'll ship the launch.
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Product</h4>
              <nav className={styles.linkList}>
                <Link href="/generate" className={styles.link}>
                  Generate Kit
                </Link>
                <Link href="/pricing" className={styles.link}>
                  Pricing
                </Link>
              </nav>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Resources</h4>
              <nav className={styles.linkList}>
                <a
                  href="https://github.com"
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  href="https://hackonvibe.com"
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HackOnVibe 2026
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} LauchKix. Built for{" "}
            <a
              href="https://hackonvibe.com"
              className={styles.hackathonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              HackOnVibe 2026
            </a>{" "}
            · Business Success track
          </p>
        </div>
      </Container>
    </footer>
  );
}
