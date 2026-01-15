import type { Metadata } from "next";
import { IconFacebook, IconEmail, IconWhatsApp, IconTelegram } from "@/components/Icons";

export const metadata: Metadata = {
    title: "Contact Us | GradePilot",
    description: "Get in touch with the GradePilot team via Facebook, Email, WhatsApp, or Telegram.",
};

export default function ContactPage() {
    return (
        <>
            {/* Hero Section */}
            <section style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                padding: "var(--space-12) 0",
                textAlign: "center",
            }}>
                <div className="container">
                    <h1 style={{ fontSize: "var(--text-4xl)", fontWeight: 800, marginBottom: "var(--space-3)", color: "white" }}>
                        Contact Us
                    </h1>
                    <p style={{ opacity: 0.9, fontSize: "var(--text-lg)", color: "white" }}>
                        We'd love to hear from you. Reach out to us directly.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="section">
                <div className="container container--narrow">
                    <div className="grid-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>

                        {/* Facebook */}
                        <a
                            href="https://www.facebook.com/profile.php?id=61552279437194"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card card--hover"
                            style={{
                                padding: "var(--space-6)",
                                textDecoration: "none",
                                color: "inherit",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                background: "white",
                                border: "1px solid var(--color-border)"
                            }}
                        >
                            <div style={{
                                width: 72, height: 72, borderRadius: "50%",
                                background: "rgba(24, 119, 242, 0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "var(--space-4)",
                            }}>
                                <IconFacebook className="w-8 h-8" style={{ width: 40, height: 40 }} />
                            </div>
                            <h3 style={{ marginBottom: "var(--space-2)" }}>Facebook</h3>
                            <p style={{ color: "var(--color-text-muted)" }}>Follow us for updates</p>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:elderfate@proton.me"
                            className="card card--hover"
                            style={{
                                padding: "var(--space-6)",
                                textDecoration: "none",
                                color: "inherit",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                background: "white",
                                border: "1px solid var(--color-border)"
                            }}
                        >
                            <div style={{
                                width: 72, height: 72, borderRadius: "50%",
                                background: "rgba(139, 92, 246, 0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "var(--space-4)",
                            }}>
                                <IconEmail className="w-8 h-8" style={{ width: 36, height: 36 }} />
                            </div>
                            <h3 style={{ marginBottom: "var(--space-2)" }}>Email</h3>
                            <p style={{ color: "var(--color-text-muted)" }}>elderfate@proton.me</p>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/84932433459"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card card--hover"
                            style={{
                                padding: "var(--space-6)",
                                textDecoration: "none",
                                color: "inherit",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                background: "white",
                                border: "1px solid var(--color-border)"
                            }}
                        >
                            <div style={{
                                width: 72, height: 72, borderRadius: "50%",
                                background: "rgba(37, 211, 102, 0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "var(--space-4)",
                            }}>
                                <IconWhatsApp className="w-8 h-8" style={{ width: 40, height: 40 }} />
                            </div>
                            <h3 style={{ marginBottom: "var(--space-2)" }}>WhatsApp</h3>
                            <p style={{ color: "var(--color-text-muted)" }}>+84 932433459</p>
                        </a>

                        {/* Telegram */}
                        <a
                            href="https://t.me/xuanlinh2209"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card card--hover"
                            style={{
                                padding: "var(--space-6)",
                                textDecoration: "none",
                                color: "inherit",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                background: "white",
                                border: "1px solid var(--color-border)"
                            }}
                        >
                            <div style={{
                                width: 72, height: 72, borderRadius: "50%",
                                background: "rgba(0, 136, 204, 0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "var(--space-4)",
                            }}>
                                <IconTelegram className="w-8 h-8" style={{ width: 40, height: 40 }} />
                            </div>
                            <h3 style={{ marginBottom: "var(--space-2)" }}>Telegram</h3>
                            <p style={{ color: "var(--color-text-muted)" }}>xuanlinh2209</p>
                        </a>

                    </div>
                </div>
            </section>
        </>
    );
}
