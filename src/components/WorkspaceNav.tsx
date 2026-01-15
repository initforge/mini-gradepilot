"use client";

import Link from "next/link";
import { IconChartBar, IconCourse, IconTranscript } from "./Icons";

interface WorkspaceNavProps {
    current: "gpa" | "course" | "transcript";
}

const workspaces = [
    { id: "gpa", name: "GPA", href: "/gpa", icon: IconChartBar },
    { id: "course", name: "Course", href: "/course", icon: IconCourse },
    { id: "transcript", name: "Transcript", href: "/transcript", icon: IconTranscript },
];

export default function WorkspaceNav({ current }: WorkspaceNavProps) {
    const currentIndex = workspaces.findIndex((w) => w.id === current);
    const prev = workspaces[currentIndex - 1];
    const next = workspaces[currentIndex + 1];

    const navButtonStyle = {
        position: "fixed" as const,
        top: "50%",
        transform: "translateY(-50%)",
        width: 60,
        height: 90,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-2)",
        background: "white",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        textDecoration: "none",
        color: "var(--color-text)",
        fontSize: "11px",
        fontWeight: 600,
        zIndex: 100,
        transition: "all 0.15s ease",
        padding: "var(--space-2) 0",
    };

    return (
        <>
            {prev && (
                <Link
                    href={prev.href}
                    style={{ ...navButtonStyle, left: 16 }}
                    title={`Go to ${prev.name}`}
                    className="hide-mobile"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ opacity: 0.6 }}>
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <prev.icon style={{ width: "28px", height: "28px", color: "#0d9488" }} />
                    <span style={{ marginTop: "2px" }}>{prev.name}</span>
                </Link>
            )}

            {next && (
                <Link
                    href={next.href}
                    style={{ ...navButtonStyle, right: 16 }}
                    title={`Go to ${next.name}`}
                    className="hide-mobile"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ opacity: 0.6 }}>
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                    <next.icon style={{ width: "28px", height: "28px", color: "#0d9488" }} />
                    <span style={{ marginTop: "2px" }}>{next.name}</span>
                </Link>
            )}
        </>
    );
}

