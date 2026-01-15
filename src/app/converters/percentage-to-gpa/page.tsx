"use client";

import { useState, useEffect, useMemo } from "react";

const STORAGE_KEY = "gradepilot_percentage_gpa";

const CONVERSION_TABLE = [
    { min: 93, max: 100, letter: "A", gpa: 4.0 },
    { min: 90, max: 92, letter: "A-", gpa: 3.7 },
    { min: 87, max: 89, letter: "B+", gpa: 3.3 },
    { min: 83, max: 86, letter: "B", gpa: 3.0 },
    { min: 80, max: 82, letter: "B-", gpa: 2.7 },
    { min: 77, max: 79, letter: "C+", gpa: 2.3 },
    { min: 73, max: 76, letter: "C", gpa: 2.0 },
    { min: 70, max: 72, letter: "C-", gpa: 1.7 },
    { min: 67, max: 69, letter: "D+", gpa: 1.3 },
    { min: 63, max: 66, letter: "D", gpa: 1.0 },
    { min: 60, max: 62, letter: "D-", gpa: 0.7 },
    { min: 0, max: 59, letter: "F", gpa: 0.0 },
];

function getConversion(percentage: number) {
    const row = CONVERSION_TABLE.find((r) => percentage >= r.min && percentage <= r.max);
    return row || CONVERSION_TABLE[CONVERSION_TABLE.length - 1];
}

export default function PercentageToGPAConverter() {
    const [mounted, setMounted] = useState(false);
    const [percentage, setPercentage] = useState(85);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const val = parseFloat(saved);
            if (!isNaN(val)) setPercentage(val);
        }
    }, []);

    useEffect(() => {
        if (mounted) localStorage.setItem(STORAGE_KEY, String(percentage));
    }, [percentage, mounted]);

    const conversion = useMemo(() => getConversion(percentage), [percentage]);

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.7) return "excellent";
        if (gpa >= 3.0) return "good";
        if (gpa >= 2.0) return "warning";
        return "danger";
    };

    const status = getGPAStatus(conversion.gpa);

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/converters">Converters</a> / Percentage to GPA
                    </nav>
                    <h1 className="dashboard__title">Percentage to GPA Converter</h1>
                    <p className="dashboard__subtitle">
                        Convert percentage scores to the US 4.0 GPA scale
                    </p>
                </div>

                <div className="dashboard__workspace">
                    {/* Input/Output Side by Side */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                        <div className="card card--elevated" style={{ padding: "var(--space-5)", textAlign: "center" }}>
                            <label style={{ display: "block", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>
                                Enter Percentage
                            </label>
                            <input
                                type="number"
                                className="input"
                                style={{ fontSize: "var(--text-3xl)", textAlign: "center", fontWeight: 700 }}
                                min={0}
                                max={100}
                                value={percentage}
                                onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
                            />
                            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
                                %
                            </div>
                        </div>

                        <div className={`gpa-snapshot gpa-snapshot--${status}`} style={{ padding: "var(--space-5)" }}>
                            <div className="gpa-snapshot__number" style={{ fontSize: "var(--text-5xl)" }}>
                                {mounted ? conversion.gpa.toFixed(1) : "0.0"}
                            </div>
                            <div className="gpa-snapshot__label">GPA</div>
                            <div className="gpa-snapshot__badge">{conversion.letter}</div>
                        </div>
                    </div>

                    {/* Conversion Table */}
                    <div className="impact-section">
                        <h2 className="impact-section__title">Conversion Reference</h2>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-sm)" }}>
                                <thead>
                                    <tr style={{ background: "var(--color-bg-secondary)" }}>
                                        <th style={{ padding: "var(--space-3)", textAlign: "left", borderBottom: "1px solid var(--color-border)" }}>Percentage</th>
                                        <th style={{ padding: "var(--space-3)", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>Letter</th>
                                        <th style={{ padding: "var(--space-3)", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>GPA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CONVERSION_TABLE.map((row) => {
                                        const isActive = percentage >= row.min && percentage <= row.max;
                                        return (
                                            <tr
                                                key={row.letter}
                                                style={{
                                                    background: isActive ? "var(--color-primary-light)" : undefined,
                                                    fontWeight: isActive ? 600 : undefined,
                                                }}
                                            >
                                                <td style={{ padding: "var(--space-2) var(--space-3)", borderBottom: "1px solid var(--color-border)" }}>
                                                    {row.min}% – {row.max}%
                                                </td>
                                                <td style={{ padding: "var(--space-2) var(--space-3)", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>
                                                    {row.letter}
                                                </td>
                                                <td style={{ padding: "var(--space-2) var(--space-3)", textAlign: "center", borderBottom: "1px solid var(--color-border)" }}>
                                                    {row.gpa.toFixed(1)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <details className="explanation-section">
                    <summary>About GPA Conversion</summary>
                    <div className="explanation-section__content">
                        <p>The US uses a 4.0 GPA scale. This converter uses the standard conversion:</p>
                        <ul style={{ marginLeft: "var(--space-4)", marginTop: "var(--space-2)" }}>
                            <li>A (93-100%): 4.0</li>
                            <li>B (83-86%): 3.0</li>
                            <li>C (73-76%): 2.0</li>
                            <li>D (63-66%): 1.0</li>
                            <li>F (below 60%): 0.0</li>
                        </ul>
                        <p style={{ marginTop: "var(--space-3)", color: "var(--color-text-muted)" }}>
                            Note: Some schools use different scales. Check with your institution for their specific conversion.
                        </p>
                    </div>
                </details>
            </div>
        </div>
    );
}
