"use client";

import Link from "next/link";
import { IconChartBar, IconCourse, IconTranscript } from "./Icons";
import styles from "./FancyButtons.module.css";

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

    return (
        <>
            {prev && (
                <Link
                    href={prev.href}
                    className={`${styles.brutalistNav} ${styles.brutalistNavLeft} hide-mobile`}
                    style={{
                        position: "fixed",
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: 16,
                        zIndex: 100,
                    }}
                    title={`Go to ${prev.name}`}
                >
                    <svg className={styles.brutalistNavArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <prev.icon className={styles.brutalistNavIcon} />
                    <span className={styles.brutalistNavText}>{prev.name}</span>
                </Link>
            )}

            {next && (
                <Link
                    href={next.href}
                    className={`${styles.brutalistNav} hide-mobile`}
                    style={{
                        position: "fixed",
                        top: "50%",
                        transform: "translateY(-50%)",
                        right: 16,
                        zIndex: 100,
                    }}
                    title={`Go to ${next.name}`}
                >
                    <svg className={styles.brutalistNavArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                    <next.icon className={styles.brutalistNavIcon} />
                    <span className={styles.brutalistNavText}>{next.name}</span>
                </Link>
            )}
        </>
    );
}
