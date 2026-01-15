"use client";

import { useState } from "react";
import { IconChartPie, IconNote } from "@/components/Icons";

// FAQ Item with Schema-ready structure
interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    items: FAQItem[];
    title?: string;
}

export function FAQSection({ items, title = "Frequently Asked Questions" }: FAQSectionProps) {
    return (
        <div style={{ marginTop: "var(--space-8)" }}>
            <h2 style={{ marginBottom: "var(--space-4)" }}>{title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {items.map((item, idx) => (
                    <details
                        key={idx}
                        style={{
                            background: "white",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-md)",
                            overflow: "hidden",
                        }}
                    >
                        <summary
                            style={{
                                padding: "var(--space-4)",
                                cursor: "pointer",
                                fontWeight: 600,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                listStyle: "none",
                            }}
                        >
                            {item.question}
                            <span style={{
                                fontSize: "var(--text-lg)",
                                color: "var(--color-text-muted)",
                                transition: "transform 0.2s",
                            }}>
                                +
                            </span>
                        </summary>
                        <div
                            style={{
                                padding: "var(--space-4)",
                                paddingTop: 0,
                                color: "var(--color-text-muted)",
                                lineHeight: 1.7,
                            }}
                        >
                            {item.answer}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
}

// Generate FAQ Schema JSON-LD
export function generateFAQSchema(items: FAQItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };
}

// Related Tools / Internal Linking Component
interface RelatedLink {
    title: string;
    description: string;
    href: string;
    accent?: string;
}

interface RelatedToolsProps {
    links: RelatedLink[];
    title?: string;
}

export function RelatedTools({ links, title = "Related Workspaces" }: RelatedToolsProps) {
    return (
        <div style={{ marginTop: "var(--space-8)" }}>
            <h3 style={{ marginBottom: "var(--space-3)" }}>{title}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--space-4)" }}>
                {links.map((link, idx) => (
                    <a
                        key={idx}
                        href={link.href}
                        style={{
                            display: "block",
                            padding: "var(--space-4)",
                            background: "white",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-md)",
                            textDecoration: "none",
                            color: "inherit",
                            transition: "border-color 0.15s, box-shadow 0.15s",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = link.accent || "var(--color-primary)";
                            e.currentTarget.style.boxShadow = `0 4px 12px ${link.accent || "var(--color-primary)"}20`;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = "var(--color-border)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div style={{ fontWeight: 600, marginBottom: "var(--space-1)", color: link.accent || "var(--color-primary)" }}>
                            {link.title} →
                        </div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                            {link.description}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

// Collapsible Explanation Block
interface ExplanationBlockProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    icon?: React.ReactNode;
}

export function ExplanationBlock({ title, children, defaultOpen = true, icon }: ExplanationBlockProps) {
    return (
        <details
            open={defaultOpen}
            style={{
                background: "white",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                marginBottom: "var(--space-4)",
                overflow: "hidden",
            }}
        >
            <summary
                style={{
                    padding: "var(--space-4)",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "var(--text-lg)",
                    background: "#f8fafc",
                    borderBottom: "1px solid var(--color-border)",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    {icon || <IconNote style={{ width: "24px", height: "24px", color: "var(--color-primary)" }} />}
                    {title}
                </div>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                    Click to expand/collapse
                </span>
            </summary>
            <div style={{ padding: "var(--space-6)", lineHeight: 1.8 }}>
                {children}
            </div>
        </details>
    );
}

// Example Block with Numbers
interface ExampleBlockProps {
    title?: string;
    children: React.ReactNode;
}

export function ExampleBlock({ title = "Example with Real Numbers", children }: ExampleBlockProps) {
    return (
        <div
            style={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                border: "1px solid #22c55e",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
                marginBottom: "var(--space-4)",
            }}
        >
            <div style={{
                fontWeight: 700,
                color: "#15803d",
                marginBottom: "var(--space-3)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
            }}>
                <IconChartPie style={{ width: "24px", height: "24px", color: "#15803d" }} />
                {title}
            </div>
            <div style={{ lineHeight: 1.8, color: "#166534" }}>
                {children}
            </div>
        </div>
    );
}
