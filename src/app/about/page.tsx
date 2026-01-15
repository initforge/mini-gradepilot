"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IconChartBar, IconScale, IconBookOpen, IconLock, IconLightning } from "@/components/Icons";

const workspaces = [
    { name: "GPA Workspace", href: "/gpa", icon: IconChartBar, desc: "Analyze your GPA, set targets with Aim Mode" },
    { name: "Course Analyzer", href: "/course", icon: IconScale, desc: "Break down course grades, project finals" },
    { name: "Transcript", href: "/transcript", icon: IconBookOpen, desc: "Track cumulative GPA over time" },
];

// Social icons data
const socialLinks = [
    {
        name: "Twitter",
        href: "https://twitter.com/gradepilot",
        color: "#14b8a6",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 24, height: 24 }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    },
    {
        name: "GitHub",
        href: "https://github.com/gradepilot",
        color: "#8b5cf6",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 24, height: 24 }}>
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
        )
    },
    {
        name: "Email",
        href: "mailto:hello@gradepilot.com",
        color: "#f97316",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 24, height: 24 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
            </svg>
        )
    },
];

// Animated Social Icon Component
function SocialIcon({ link }: { link: typeof socialLinks[0] }) {
    const [hovered, setHovered] = useState(false);

    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                boxShadow: hovered ? `0 8px 25px ${link.color}40` : "0 4px 15px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                transform: hovered ? "translateY(-5px)" : "translateY(0)",
                textDecoration: "none",
            }}
        >
            {/* Fill effect background */}
            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: hovered ? "100%" : "0%",
                background: link.color,
                borderRadius: "50%",
                transition: "height 0.3s ease",
            }} />

            {/* Icon */}
            <div style={{
                position: "relative",
                zIndex: 1,
                color: hovered ? "white" : "#1e293b",
                transition: "color 0.3s ease",
            }}>
                {link.icon}
            </div>

            {/* Label tooltip */}
            <div style={{
                position: "absolute",
                top: -35,
                left: "50%",
                transform: `translateX(-50%) scale(${hovered ? 1 : 0})`,
                background: link.color,
                color: "white",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                transition: "transform 0.3s ease",
            }}>
                {link.name}
            </div>
        </a>
    );
}

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            <section style={{
                background: "linear-gradient(135deg, #0d9488 0%, #115e59 100%)",
                color: "white",
                padding: "var(--space-16) 0 var(--space-12)",
                textAlign: "center",
            }}>
                <div className="container">
                    <h1 style={{
                        fontSize: "var(--text-4xl)",
                        fontWeight: 800,
                        marginBottom: "var(--space-4)",
                        color: "white"
                    }}>
                        About GradePilot
                    </h1>
                    <p style={{
                        fontSize: "var(--text-xl)",
                        opacity: 0.9,
                        maxWidth: "600px",
                        margin: "0 auto",
                        lineHeight: 1.6,
                        color: "white"
                    }}>
                        Academic decision workspaces designed for US high school and college students.
                        No login required, 100% private.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="section">
                <div className="container container--narrow">
                    <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
                        <h2 style={{ marginBottom: "var(--space-3)" }}>Our Mission</h2>
                        <p style={{
                            color: "var(--color-text-muted)",
                            fontSize: "var(--text-lg)",
                            maxWidth: "700px",
                            margin: "0 auto",
                            lineHeight: 1.7
                        }}>
                            We believe academic tools should be <strong>free</strong>, <strong>fast</strong>,
                            and <strong>private</strong>. Every student deserves access to quality analysis
                            without paywalls, intrusive ads, or data collection.
                        </p>
                    </div>

                    {/* Core Values Grid */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "var(--space-5)",
                        marginBottom: "var(--space-12)"
                    }}>
                        <div className="card card--elevated" style={{ padding: "var(--space-6)", textAlign: "center" }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: "var(--radius-lg)",
                                background: "var(--color-primary-light)", color: "var(--color-primary)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto var(--space-4)"
                            }}>
                                <IconChartBar className="w-8 h-8" />
                            </div>
                            <h3 style={{ marginBottom: "var(--space-2)" }}>3 Workspaces</h3>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                                Integrated environments for every academic decision. Not fragmented tools.
                            </p>
                        </div>
                        <div className="card card--elevated" style={{ padding: "var(--space-6)", textAlign: "center" }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: "var(--radius-lg)",
                                background: "#ede9fe", color: "var(--color-secondary)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto var(--space-4)"
                            }}>
                                <IconLock className="w-8 h-8" />
                            </div>
                            <h3 style={{ marginBottom: "var(--space-2)" }}>100% Private</h3>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                                All calculations happen in your browser. Your data never leaves your device.
                            </p>
                        </div>
                        <div className="card card--elevated" style={{ padding: "var(--space-6)", textAlign: "center" }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: "var(--radius-lg)",
                                background: "var(--color-success-bg)", color: "var(--color-success)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto var(--space-4)"
                            }}>
                                <IconLightning className="w-8 h-8" />
                            </div>
                            <h3 style={{ marginBottom: "var(--space-2)" }}>No Login</h3>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                                Start analyzing immediately. No registration or account needed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Built for US Students */}
            <section className="section">
                <div className="container container--narrow">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-10)", alignItems: "center" }}>
                        <div>
                            <h2 style={{ marginBottom: "var(--space-4)" }}>Built for US Students</h2>
                            <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-4)", lineHeight: 1.7 }}>
                                Our workspaces use the standard <strong>4.0 GPA scale</strong> common in American
                                high schools and colleges.
                            </p>
                            <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-4)", lineHeight: 1.7 }}>
                                We support <strong>weighted GPAs</strong> with Honors (+0.5) and AP/IB (+1.0)
                                bonuses, exactly as used by most US institutions.
                            </p>
                            <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                                Whether you're tracking semester progress or planning for college admissions,
                                GradePilot gives you the analysis tools you need.
                            </p>
                        </div>
                        <div style={{
                            background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                            borderRadius: "var(--radius-xl)",
                            padding: "var(--space-8)",
                            color: "white",
                            textAlign: "center"
                        }}>
                            <div style={{ fontSize: "var(--text-6xl)", fontWeight: 800, marginBottom: "var(--space-2)" }}>4.0</div>
                            <div style={{ fontSize: "var(--text-lg)", opacity: 0.9 }}>Standard GPA Scale</div>
                            <div style={{ fontSize: "var(--text-sm)", opacity: 0.7, marginTop: "var(--space-4)" }}>
                                A=4.0 • B=3.0 • C=2.0 • D=1.0 • F=0
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workspaces */}
            <section className="section section--alt">
                <div className="container container--narrow">
                    <h2 style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>Our Workspaces</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)" }}>
                        {workspaces.map((ws) => (
                            <Link key={ws.href} href={ws.href} className="card card--hover" style={{
                                padding: "var(--space-5)", textAlign: "center",
                                textDecoration: "none", color: "inherit"
                            }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: "var(--radius-lg)",
                                    background: "var(--color-primary-light)", color: "var(--color-primary)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto var(--space-3)"
                                }}>
                                    <ws.icon className="w-7 h-7" />
                                </div>
                                <div style={{ fontWeight: 700, marginBottom: "var(--space-1)" }}>{ws.name}</div>
                                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{ws.desc}</div>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
                        <Link href="/" className="btn btn--primary">Explore All Workspaces →</Link>
                    </div>
                </div>
            </section>
        </>
    );
}

