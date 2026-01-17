"use client";

import { useState } from "react";
import { IconChartPie, IconNote } from "@/components/Icons";
import styles from "./FancyButtons.module.css";

// FAQ Item with Schema-ready structure
interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    items: FAQItem[];
    title?: string;
}

// Individual FAQ Item Component with animation
function FAQItemComponent({ item }: { item: FAQItem }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            style={{
                background: "white",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
            }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${styles.faqToggle} ${isOpen ? styles.faqToggleOpen : ""}`}
                style={{ borderRadius: isOpen ? "var(--radius-md) var(--radius-md) 0 0" : "var(--radius-md)" }}
            >
                <span className={styles.faqToggleText}>{item.question}</span>
                <svg
                    className={styles.faqToggleIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 5v14M5 12h14" />
                </svg>
            </button>
            {isOpen && (
                <div
                    style={{
                        padding: "var(--space-4)",
                        color: "var(--color-text-muted)",
                        lineHeight: 1.7,
                        borderTop: "1px solid var(--color-border)",
                        background: "#f8fafc",
                    }}
                >
                    {item.answer}
                </div>
            )}
        </div>
    );
}

export function FAQSection({ items, title = "Frequently Asked Questions" }: FAQSectionProps) {
    return (
        <div style={{ marginTop: "var(--space-8)" }}>
            <h2 style={{ marginBottom: "var(--space-4)" }}>{title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {items.map((item, idx) => (
                    <FAQItemComponent key={idx} item={item} />
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
                {links.map((link, idx) => (
                    <a
                        key={idx}
                        href={link.href}
                        className={styles.relatedLinkBtn}
                        style={{
                            borderLeftColor: link.accent || "#14b8a6",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = link.accent || "#14b8a6";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.borderLeftColor = link.accent || "#14b8a6";
                        }}
                    >
                        <span className={styles.relatedLinkBtnInner}>
                            <span
                                className={styles.relatedLinkBtnTitle}
                                style={{ "--hover-color": link.accent || "#14b8a6" } as React.CSSProperties}
                            >
                                {link.title} →
                            </span>
                            <span className={styles.relatedLinkBtnDesc}>
                                {link.description}
                            </span>
                        </span>
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
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            style={{
                background: "white",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                marginBottom: "var(--space-4)",
                overflow: "hidden",
            }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${styles.faqToggle} ${isOpen ? styles.faqToggleOpen : ""}`}
                style={{
                    padding: "var(--space-4) 3em var(--space-4) var(--space-4)",
                    fontSize: "var(--text-lg)",
                    fontWeight: 700,
                    background: "#f8fafc",
                    borderBottom: isOpen ? "1px solid var(--color-border)" : "none",
                    borderRadius: isOpen ? "var(--radius-lg) var(--radius-lg) 0 0" : "var(--radius-lg)",
                }}
            >
                <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    {icon || <IconNote style={{ width: "24px", height: "24px", color: "var(--color-primary)" }} />}
                    <span className={styles.faqToggleText}>{title}</span>
                </span>
                <svg
                    className={styles.faqToggleIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
            {isOpen && (
                <div style={{ padding: "var(--space-6)", lineHeight: 1.8 }}>
                    {children}
                </div>
            )}
        </div>
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
