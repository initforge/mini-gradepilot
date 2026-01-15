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
                    </div>
                </details>

                {/* Deep SEO Content */}
                <section className="seo-content">
                    <h2>How to Convert Percentage Grades to GPA</h2>
                    <p>
                        If you&apos;re coming from a grading system that uses percentages (common in many countries
                        and some US schools), you may need to convert to the 4.0 GPA scale for college applications,
                        transcripts, or scholarship requirements.
                    </p>

                    <h3>Worked Example: Converting 85% to GPA</h3>
                    <p>Let&apos;s convert an 85% score:</p>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li>85% falls in the range 83-86%</li>
                        <li>This corresponds to letter grade <strong>B</strong></li>
                        <li>B equals <strong>3.0 GPA</strong></li>
                    </ul>
                    <p>
                        So if you scored 85% in a course, that course contributes 3.0 grade points
                        per credit hour toward your GPA.
                    </p>

                    <h3>Complete Conversion Table</h3>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Percentage</th>
                                    <th>Letter</th>
                                    <th>GPA</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>93-100%</td><td>A</td><td>4.0</td><td>Excellent</td></tr>
                                <tr><td>90-92%</td><td>A-</td><td>3.7</td><td>Excellent</td></tr>
                                <tr><td>87-89%</td><td>B+</td><td>3.3</td><td>Very Good</td></tr>
                                <tr><td>83-86%</td><td>B</td><td>3.0</td><td>Good</td></tr>
                                <tr><td>80-82%</td><td>B-</td><td>2.7</td><td>Good</td></tr>
                                <tr><td>77-79%</td><td>C+</td><td>2.3</td><td>Satisfactory</td></tr>
                                <tr><td>73-76%</td><td>C</td><td>2.0</td><td>Satisfactory</td></tr>
                                <tr><td>70-72%</td><td>C-</td><td>1.7</td><td>Below Average</td></tr>
                                <tr><td>67-69%</td><td>D+</td><td>1.3</td><td>Poor</td></tr>
                                <tr><td>63-66%</td><td>D</td><td>1.0</td><td>Poor</td></tr>
                                <tr><td>60-62%</td><td>D-</td><td>0.7</td><td>Barely Passing</td></tr>
                                <tr><td>0-59%</td><td>F</td><td>0.0</td><td>Failing</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Different Grading Scales</h3>
                    <p>Not all schools use the same conversion. Here are common variations:</p>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>🇺🇸 Standard US (This Tool)</h4>
                            <p>
                                A: 93-100%, B: 83-92%, C: 73-82%, D: 63-72%, F: below 63%
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🎓 Some High Schools</h4>
                            <p>
                                A: 90-100%, B: 80-89%, C: 70-79%, D: 60-69%, F: below 60%
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>📚 Rigorous Programs</h4>
                            <p>
                                Some AP/IB courses curve differently. Always check your syllabus.
                            </p>
                        </div>
                    </div>

                    <h3>When Do You Need to Convert?</h3>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li><strong>College applications:</strong> Most require GPA on 4.0 scale</li>
                        <li><strong>Scholarship forms:</strong> Often ask for cumulative GPA</li>
                        <li><strong>International transcripts:</strong> Need conversion for US schools</li>
                        <li><strong>Job applications:</strong> Some employers screen by GPA</li>
                    </ul>

                    <h3>Next Steps</h3>
                    <p>
                        After converting your percentage, use the <a href="/gpa-calculators/gpa-calculator">GPA Calculator</a>
                        to see how this grade affects your overall GPA.
                    </p>
                    <p>
                        For planning future grades, try the <a href="/gpa">GPA Workspace</a> with Aim Mode
                        to see what grades you need to reach your target.
                    </p>
                </section>

                {/* Related Tools */}
                <section style={{ marginTop: "var(--space-8)" }}>
                    <h3 style={{ marginBottom: "var(--space-4)" }}>Related Tools</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}>
                        <a href="/gpa-calculators/gpa-calculator" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>GPA Calculator</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Calculate your overall GPA
                            </p>
                        </a>
                        <a href="/gpa" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>GPA Workspace</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Plan target GPA with Aim Mode
                            </p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
