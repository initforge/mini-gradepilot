import type { Metadata } from "next";
import { IconBookOpen } from "@/components/Icons";

export const metadata: Metadata = {
    title: "Terms of Use | GradePilot",
    description: "GradePilot terms of use. Free academic calculators for educational purposes.",
};

export default function TermsPage() {
    return (
        <>
            {/* Hero Section */}
            <section style={{
                background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
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
                        <IconBookOpen className="w-8 h-8" />
                    </div>
                    <h1 style={{ fontSize: "var(--text-4xl)", fontWeight: 800, marginBottom: "var(--space-3)", color: "white" }}>
                        Terms of Use
                    </h1>
                    <p style={{ opacity: 0.9, fontSize: "var(--text-lg)", color: "white" }}>
                        Simple, fair terms for using GradePilot.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="section">
                <div className="container container--narrow">
                    {/* Summary Card */}
                    <div style={{
                        background: "var(--color-primary-light)",
                        border: "1px solid var(--color-primary)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-5)",
                        marginBottom: "var(--space-8)"
                    }}>
                        <h3 style={{ color: "var(--color-primary)", marginBottom: "var(--space-2)" }}>
                            ✓ In Plain English
                        </h3>
                        <p style={{ color: "var(--color-text)", fontSize: "var(--text-base)" }}>
                            GradePilot is free to use for educational purposes. Our calculators are tools to
                            help you — always verify important calculations with your school.
                        </p>
                    </div>

                    {/* Terms Sections */}
                    <div style={{ lineHeight: 1.8 }}>
                        <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                1. Acceptance of Terms
                            </h2>
                            <p style={{ color: "var(--color-text-muted)" }}>
                                By accessing and using GradePilot, you agree to these Terms of Use.
                                If you don't agree, please don't use our services.
                            </p>
                        </div>

                        <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                2. Service Description
                            </h2>
                            <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
                                GradePilot provides free academic tools including:
                            </p>
                            <ul style={{ color: "var(--color-text-muted)", paddingLeft: "var(--space-5)", marginBottom: "0" }}>
                                <li>Core workspaces (GPA, Course, Transcript)</li>
                                <li>GPA calculators (standard, weighted, college, high school)</li>
                                <li>Grade calculators (final grade, required grade)</li>
                            </ul>
                        </div>

                        <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                3. Educational Purpose
                            </h2>
                            <p style={{ color: "var(--color-text-muted)" }}>
                                Our calculators are provided for <strong style={{ color: "var(--color-text)" }}>educational and informational purposes only</strong>.
                                While we strive for accuracy, you should always verify important calculations
                                with your school's official records and systems.
                            </p>
                        </div>

                        <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                4. No Warranty
                            </h2>
                            <p style={{ color: "var(--color-text-muted)" }}>
                                GradePilot is provided "as is" without warranties of any kind. We do not guarantee
                                that our calculations will match your school's exact methods, as grading systems
                                can vary between institutions.
                            </p>
                        </div>

                        <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                5. Acceptable Use
                            </h2>
                            <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
                                You agree to use GradePilot only for lawful purposes. You may not:
                            </p>
                            <ul style={{ color: "var(--color-text-muted)", paddingLeft: "var(--space-5)", marginBottom: "0" }}>
                                <li>Attempt to hack, disrupt, or overload our services</li>
                                <li>Use automated scripts to access our calculators</li>
                                <li>Misrepresent calculated results as official school records</li>
                            </ul>
                        </div>

                        <div className="card" style={{ padding: "var(--space-6)" }}>
                            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-3)", color: "var(--color-primary)" }}>
                                6. Changes to Terms
                            </h2>
                            <p style={{ color: "var(--color-text-muted)" }}>
                                We may update these terms from time to time. Continued use of GradePilot
                                after changes constitutes acceptance of the new terms.
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
