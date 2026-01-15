import Link from "next/link";
import type { Metadata } from "next";
import { IconChartBar, IconCourse, IconTranscript } from "@/components/Icons";

export const metadata: Metadata = {
  title: "GradePilot - Academic Decision Workspace for US Students",
  description: "Analyze your academics, plan your path, make smarter decisions. Free workspaces for GPA analysis, course grades, and transcripts.",
};

// Workspace definitions - 4 core workspaces
const workspaces = [
  {
    id: "gpa",
    name: "GPA Workspace",
    tagline: "Analyze • Plan • Achieve",
    description: "Your academic command center. Track current GPA, set targets with Aim Mode, see which courses impact you most.",
    features: ["Current GPA Analysis", "Aim Mode (Target Setting)", "Weighted GPA Toggle", "% to GPA Converter"],
    href: "/gpa",
    icon: IconChartBar,
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    accent: "#14b8a6",
    shadow: "rgba(20, 184, 166, 0.3)",
  },
  {
    id: "course",
    name: "Course Grade Analyzer",
    tagline: "Break Down • Project • Succeed",
    description: "Deep dive into a single course. See your weighted breakdown, project final grades, know exactly what score you need.",
    features: ["Weight Breakdown", "Target Grade Mode", "What-If Scenarios", "Required Score Calculator"],
    href: "/course",
    icon: IconCourse,
    gradient: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
    accent: "#f97316",
    shadow: "rgba(234, 88, 12, 0.3)",
  },
  {
    id: "transcript",
    name: "Transcript Workspace",
    tagline: "Track • Trend • Transform",
    description: "Your academic timeline. Track cumulative GPA across semesters or years, visualize your progress over time.",
    features: ["College / High School Mode", "Cumulative GPA Tracking", "Semester Comparison", "Trend Visualization"],
    href: "/transcript",
    icon: IconTranscript,
    gradient: "linear-gradient(135deg, #115e59 0%, #0f766e 100%)",
    accent: "#14b8a6",
    shadow: "rgba(15, 118, 110, 0.3)",
  },
];

const faqs = [
  {
    q: "What makes GradePilot different from other GPA calculators?",
    a: "GradePilot is a workspace, not a calculator. Instead of jumping between tools, you work in integrated environments that understand how academic decisions connect. Aim Mode shows you exactly what grades you need. Impact analysis reveals which courses matter most.",
  },
  {
    q: "Is my data private?",
    a: "100%. All calculations happen in your browser. Your grades are stored locally on your device and never sent to any server. We don't require login, email, or any personal information.",
  },
  {
    q: "Does GradePilot work for my school's grading system?",
    a: "GradePilot uses the standard US 4.0 scale (A=4.0, B=3.0, etc.). For weighted GPA, we support Honors (+0.5) and AP/IB (+1.0) bonuses. If your school uses different weights, you can adjust calculations manually.",
  },
  {
    q: "Can I save my data?",
    a: "Your data is automatically saved in your browser. When you return, your courses and settings will be there. Note: clearing browser data will reset everything.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section - Bold, Decision-Focused */}
      <section style={{
        background: "linear-gradient(135deg, #0d9488 0%, #115e59 100%)",
        padding: "var(--space-16) 0 var(--space-12)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          background: "rgba(255,255,255,0.03)",
          borderRadius: "50%",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <h1 style={{
              fontSize: "var(--text-5xl)",
              fontWeight: 800,
              color: "white",
              marginBottom: "var(--space-4)",
              lineHeight: 1.1,
            }}>
              Academic Decision Workspace
            </h1>
            <p style={{
              fontSize: "var(--text-xl)",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "var(--space-8)",
              lineHeight: 1.6,
            }}>
              Stop jumping between calculators. GradePilot gives you integrated workspaces
              to analyze your academics, set goals, and make data-driven decisions.
            </p>

            {/* Quick Stats */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "var(--space-8)",
              marginBottom: "var(--space-8)",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "white" }}>3</div>
                <div style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.7)" }}>Workspaces</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "white" }}>100%</div>
                <div style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.7)" }}>Private</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "white" }}>No</div>
                <div style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.7)" }}>Login</div>
              </div>
            </div>

            <Link
              href="/gpa"
              className="btn"
              style={{
                background: "#f97316",
                color: "white",
                padding: "var(--space-4) var(--space-8)",
                fontSize: "var(--text-lg)",
                fontWeight: 600,
                borderRadius: "var(--radius-lg)",
                display: "inline-block",
                boxShadow: "0 8px 30px rgba(249, 115, 22, 0.4)",
              }}
            >
              Open GPA Workspace →
            </Link>
          </div>
        </div>
      </section>

      {/* Workspaces Grid */}
      <section className="section" style={{ background: "var(--color-bg-secondary)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
            <h2 style={{ marginBottom: "var(--space-2)" }}>Your Workspaces</h2>
            <p style={{ color: "var(--color-text-muted)", maxWidth: 600, margin: "0 auto" }}>
              Each workspace is designed for a specific decision. No clutter, no confusion.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-6)" }}>
            {workspaces.map((ws) => (
              <Link
                key={ws.id}
                href={ws.href}
                style={{
                  background: ws.gradient,
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-6)",
                  color: "white",
                  textDecoration: "none",
                  boxShadow: `0 15px 50px ${ws.shadow}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "block",
                }}
                className="card--hover"
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)" }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: "var(--radius-lg)",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "white",
                  }}>
                    <ws.icon className="w-8 h-8" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: 700, color: "white" }}>{ws.name}</h3>
                    <p style={{
                      margin: 0,
                      marginTop: "var(--space-1)",
                      fontSize: "var(--text-sm)",
                      opacity: 0.8,
                      fontStyle: "italic",
                      color: "white",
                    }}>
                      {ws.tagline}
                    </p>
                  </div>
                </div>

                <p style={{
                  margin: 0,
                  marginTop: "var(--space-4)",
                  opacity: 0.9,
                  lineHeight: 1.6,
                  fontSize: "var(--text-sm)",
                  color: "white",
                }}>
                  {ws.description}
                </p>

                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-2)",
                  marginTop: "var(--space-4)"
                }}>
                  {ws.features.map((feature) => (
                    <span
                      key={feature}
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        padding: "var(--space-1) var(--space-2)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 500,
                        color: "white",
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container container--narrow">
          <h2 style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
            Think Different. Work Smarter.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-6)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--color-primary-light)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto var(--space-4)",
                fontSize: "var(--text-2xl)",
                fontWeight: 800,
              }}>
                1
              </div>
              <h4 style={{ marginBottom: "var(--space-2)" }}>See Your Status</h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                Results first, always. Know where you stand before you make a decision.
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#ede9fe",
                color: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto var(--space-4)",
                fontSize: "var(--text-2xl)",
                fontWeight: 800,
              }}>
                2
              </div>
              <h4 style={{ marginBottom: "var(--space-2)" }}>Set Your Goal</h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                Enable Aim Mode to see exactly what grades you need to hit your target.
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#ffedd5",
                color: "#ea580c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto var(--space-4)",
                fontSize: "var(--text-2xl)",
                fontWeight: 800,
              }}>
                3
              </div>
              <h4 style={{ marginBottom: "var(--space-2)" }}>Focus Your Effort</h4>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                Impact analysis shows which courses matter most. Prioritize strategically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section section--alt">
        <div className="container container--narrow">
          <h2 style={{ marginBottom: "var(--space-6)", textAlign: "center" }}>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <details key={idx} className="faq-item">
                <summary className="faq-item__question">
                  {faq.q}
                  <span className="faq-item__icon">+</span>
                </summary>
                <div className="faq-item__answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "GradePilot",
            url: "https://gradepilot.org",
            description: "Academic decision workspaces for US students",
          }),
        }}
      />
    </>
  );
}
