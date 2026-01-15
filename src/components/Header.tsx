"use client";

import Link from "next/link";
import { useState } from "react";
import { GradePilotLogo, IconChartBar, IconCourse, IconTranscript } from "./Icons";

const workspaces = [
    { name: "GPA Workspace", href: "/gpa", icon: IconChartBar, desc: "Analyze GPA, set goals", color: "#14b8a6", bgColor: "#ccfbf1" },
    { name: "Course Analyzer", href: "/course", icon: IconCourse, desc: "Grade breakdown, projections", color: "#f97316", bgColor: "#ffedd5" },
    { name: "Transcript", href: "/transcript", icon: IconTranscript, desc: "Track cumulative GPA", color: "#8b5cf6", bgColor: "#ede9fe" },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [workspacesDropdownOpen, setWorkspacesDropdownOpen] = useState(false);

    return (
        <header className="header">
            <div className="header__inner">
                <Link href="/" className="header__logo">
                    <GradePilotLogo className="w-8 h-8" />
                    <span>GradePilot</span>
                </Link>

                <nav className="header__nav">
                    <div
                        className="header__dropdown"
                        onMouseEnter={() => setWorkspacesDropdownOpen(true)}
                        onMouseLeave={() => setWorkspacesDropdownOpen(false)}
                        style={{ position: "relative" }}
                    >
                        <button
                            className="header__link"
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                            }}
                        >
                            Workspaces
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                <path d="M2 4l4 4 4-4" />
                            </svg>
                        </button>
                        {workspacesDropdownOpen && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    background: "white",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius-lg)",
                                    boxShadow: "var(--shadow-lg)",
                                    padding: "var(--space-3)",
                                    minWidth: "280px",
                                    zIndex: 1000,
                                }}
                            >
                                {workspaces.map((ws) => (
                                    <Link
                                        key={ws.href}
                                        href={ws.href}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "var(--space-3)",
                                            padding: "var(--space-3)",
                                            fontSize: "var(--text-sm)",
                                            color: "var(--color-text)",
                                            borderRadius: "var(--radius-md)",
                                            transition: "background var(--transition-fast)",
                                            textDecoration: "none",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = ws.bgColor;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                        }}
                                    >
                                        <div style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "var(--radius-md)",
                                            background: ws.bgColor,
                                            color: ws.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}>
                                            <ws.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{ws.name}</div>
                                            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                                                {ws.desc}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <Link href="/about" className="header__link">
                        About
                    </Link>
                </nav>

                <button
                    className="header__mobile-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {mobileMenuOpen ? (
                            <path d="M6 6l12 12M6 18L18 6" />
                        ) : (
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "var(--header-height)",
                        left: 0,
                        right: 0,
                        background: "white",
                        borderBottom: "1px solid var(--color-border)",
                        padding: "var(--space-4)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-2)",
                    }}
                >
                    <div style={{ fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>
                        Workspaces
                    </div>
                    {workspaces.map((ws) => (
                        <Link
                            key={ws.href}
                            href={ws.href}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-3)",
                                padding: "var(--space-2) var(--space-3)",
                                fontSize: "var(--text-sm)",
                                color: "var(--color-text)",
                                borderRadius: "var(--radius-sm)",
                                textDecoration: "none",
                            }}
                        >
                            <ws.icon style={{ width: 20, height: 20, flexShrink: 0, color: ws.color }} />
                            {ws.name}
                        </Link>
                    ))}
                    <div style={{ borderTop: "1px solid var(--color-border)", marginTop: "var(--space-2)", paddingTop: "var(--space-2)" }}>
                        <Link
                            href="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                display: "block",
                                padding: "var(--space-2) var(--space-3)",
                                fontSize: "var(--text-sm)",
                                color: "var(--color-text)",
                            }}
                        >
                            About
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
