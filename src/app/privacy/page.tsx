import type { Metadata } from "next";
import { IconLock, IconChartBar } from "@/components/Icons";

export const metadata: Metadata = {
    title: "Privacy Policy | GradePilot",
    description: "GradePilot's privacy policy. All calculations happen in your browser - we don't collect or store your data.",
};

export default function PrivacyPage() {
    return (
        <>
            {/* Hero Section */}
            <section style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                color: "white",
                padding: "var(--space-12) 0",
                textAlign: "center",
            }}>
                <div className="container">
                    <div style={{
                        width: 64, height: 64, borderRadius: "var(--radius-lg)",
                        background: "rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto var(--space-4)"
                    }}>
                        <IconLock className="w-8 h-8" />
                    </div>
                    <h1 style={{ fontSize: "var(--text-4xl)", fontWeight: 800, marginBottom: "var(--space-3)", color: "white" }}>
                        Privacy Policy
                    </h1>
                    <p style={{ opacity: 0.9, fontSize: "var(--text-lg)", color: "white" }}>
                        Your privacy matters. Here's how we protect it.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="section">
                <div className="container container--narrow">
                    {/* TL;DR Card */}
                    <div style={{
                        background: "var(--color-success-bg)",
                        border: "1px solid var(--color-success)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-5)",
                        marginBottom: "var(--space-8)"
                    }}>
                        <h3 style={{ color: "var(--color-success)", marginBottom: "var(--space-2)" }}>
                            ✓ The Short Version
                        </h3>
                        <p style={{ color: "var(--color-text)", fontSize: "var(--text-base)" }}>
                            <strong>We don't collect your data.</strong> All calculations happen in your browser.
                            Your grades and GPA data are stored locally on your device and never sent to any server.
                        </p>
                    </div>

                    {/* Policy Sections */}
                    <div style={{ lineHeight: 1.8 }}>
                        <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                1. Data Collection
                            </h2>
                            <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
                                <strong style={{ color: "var(--color-text)" }}>We collect zero personal data.</strong> GradePilot
                                is designed as a privacy-first application. We do not:
                            </p>
                            <ul style={{ color: "var(--color-text-muted)", paddingLeft: "var(--space-5)", marginBottom: "0" }}>
                                <li>Require any login or registration</li>
                                <li>Collect your name, email, or any personal information</li>
                                <li>Track your grades, courses, or GPA calculations</li>
                                <li>Use cookies for tracking purposes</li>
                            </ul>
                        </div>

                        <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                2. Local Storage
                            </h2>
                            <p style={{ color: "var(--color-text-muted)" }}>
                                Your calculation data is saved in your browser's <strong style={{ color: "var(--color-text)" }}>localStorage</strong>.
                                This data stays on your device and is never transmitted to our servers. You can clear
                                this data at any time by clearing your browser's site data.
                            </p>
                        </div>

                        <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                3. Analytics
                            </h2>
                            <p style={{ color: "var(--color-text-muted)" }}>
                                We may use privacy-respecting analytics to understand general usage patterns
                                (page views, popular tools). This data is aggregated and anonymous — we cannot
                                identify individual users or see your calculation data.
                            </p>
                        </div>

                        <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                4. Third Parties
                            </h2>
                            <p style={{ color: "var(--color-text-muted)" }}>
                                We do not sell, trade, or transfer your information to third parties.
                                Since we don't collect personal data, there's nothing to share.
                            </p>
                        </div>

                        <div className="card" style={{ padding: "var(--space-6)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                5. Contact
                            </h2>
                            <p style={{ color: "var(--color-text-muted)" }}>
                                Questions about our privacy practices? Reach out through our
                                <a href="/contact" style={{ color: "var(--color-primary)", marginLeft: "4px" }}>contact page</a>.
                            </p>
                        </div>
                    </div>

                    <p style={{
                        textAlign: "center",
                        color: "var(--color-text-muted)",
                        fontSize: "var(--text-sm)",
                        marginTop: "var(--space-8)"
                    }}>
                        Last updated: January 2026
                    </p>
                </div>
            </section>
        </>
    );
}
