import Link from "next/link";
import {
    IconChartBar, IconCourse, IconTranscript
} from "./Icons";

// Workspace definitions
const allWorkspaces = [
    {
        name: "GPA Workspace",
        href: "/gpa",
        desc: "Analyze your GPA, set targets",
        icon: IconChartBar,
        color: "teal",
    },
    {
        name: "Course Analyzer",
        href: "/course",
        desc: "Grade breakdown, projections",
        icon: IconCourse,
        color: "orange",
    },
    {
        name: "Transcript",
        href: "/transcript",
        desc: "Track cumulative GPA",
        icon: IconTranscript,
        color: "teal",
    },
];

interface RelatedToolsProps {
    currentPath?: string;
}

export default function RelatedTools({ currentPath }: RelatedToolsProps) {
    // Filter out current workspace
    const relatedWorkspaces = allWorkspaces.filter(ws => ws.href !== currentPath);

    return (
        <div className="card" style={{ padding: "var(--space-6)", marginTop: "var(--space-8)" }}>
            <h4 style={{ marginBottom: "var(--space-4)" }}>Other Workspaces</h4>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "var(--space-3)",
                }}
            >
                {relatedWorkspaces.map((ws) => (
                    <Link key={ws.href} href={ws.href} className="card card--hover" style={{
                        padding: "var(--space-3)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                        textDecoration: "none",
                        color: "inherit",
                    }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: "var(--radius-md)",
                                background: ws.color === "teal" ? "var(--color-primary-light)" :
                                    ws.color === "orange" ? "#ffedd5" : "#fee2e2",
                                color: ws.color === "teal" ? "var(--color-primary)" :
                                    ws.color === "orange" ? "#ea580c" : "#dc2626",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <ws.icon className="w-5 h-5" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{ws.name}</div>
                            <div style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-text-muted)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}>
                                {ws.desc}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
