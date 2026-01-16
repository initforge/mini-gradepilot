"use client";

import { useState, useMemo } from "react";

interface YearData {
    year: string;
    gpa: string;
    credits: string;
}

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior"];

// 4 fixed year slots
const INITIAL_YEARS: YearData[] = YEARS.map((year) => ({
    year,
    gpa: "",
    credits: "",
}));

export default function HighSchoolGPACalculator() {
    const [years, setYears] = useState<YearData[]>(INITIAL_YEARS);

    const result = useMemo(() => {
        const filledYears = years.filter(
            (y) => y.gpa !== "" && y.credits !== "" && parseFloat(y.credits) > 0
        );
        if (filledYears.length === 0) return null;

        let totalCredits = 0;
        let totalPoints = 0;

        filledYears.forEach((y) => {
            const gpa = parseFloat(y.gpa);
            const credits = parseFloat(y.credits);
            if (!isNaN(gpa) && !isNaN(credits)) {
                totalCredits += credits;
                totalPoints += gpa * credits;
            }
        });

        const cumulativeGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

        return { cumulativeGPA, totalCredits, yearCount: filledYears.length };
    }, [years]);

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.7) return { label: "Excellent", class: "excellent" };
        if (gpa >= 3.0) return { label: "Good", class: "good" };
        if (gpa >= 2.0) return { label: "Satisfactory", class: "warning" };
        return { label: "Needs Improvement", class: "danger" };
    };

    const updateYear = (index: number, field: keyof YearData, value: string) => {
        setYears((prev) =>
            prev.map((y, i) => (i === index ? { ...y, [field]: value } : y))
        );
    };

    const resetAll = () => setYears(INITIAL_YEARS);

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/gpa-calculators">GPA Calculators</a> / High School GPA
                    </nav>
                    <h1 className="dashboard__title">High School GPA Calculator</h1>
                    <p className="dashboard__subtitle">
                        Calculate your 4-year cumulative high school GPA
                    </p>
                </div>

                <div className="dashboard__workspace">
                    {/* Input Form */}
                    <div className="card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-6)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ margin: 0 }}>Your Years</h2>
                            <button
                                onClick={resetAll}
                                style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: "var(--text-sm)" }}
                            >
                                Reset
                            </button>
                        </div>

                        <div style={{ display: "grid", gap: "var(--space-3)" }}>
                            {years.map((year, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "100px 1fr 1fr",
                                        gap: "var(--space-3)",
                                        alignItems: "center"
                                    }}
                                >
                                    <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", fontWeight: 500 }}>
                                        {year.year}
                                    </span>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="GPA (e.g. 3.5)"
                                        value={year.gpa}
                                        onChange={(e) => updateYear(index, "gpa", e.target.value)}
                                        step="0.01"
                                        min="0"
                                        max="4"
                                        style={{ padding: "var(--space-2)" }}
                                    />
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Credits (e.g. 6)"
                                        value={year.credits}
                                        onChange={(e) => updateYear(index, "credits", e.target.value)}
                                        min="1"
                                        max="10"
                                        style={{ padding: "var(--space-2)" }}
                                    />
                                </div>
                            ))}
                        </div>

                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-4)" }}>
                            Enter your GPA and credits for each year. Empty rows are ignored.
                        </p>
                    </div>

                    {/* Result */}
                    {result ? (
                        <div className={`gpa-snapshot gpa-snapshot--${getGPAStatus(result.cumulativeGPA).class}`}>
                            <div className="gpa-snapshot__number">
                                {result.cumulativeGPA.toFixed(2)}
                            </div>
                            <div className="gpa-snapshot__label">Cumulative GPA</div>
                            <div className="gpa-snapshot__badge">
                                {getGPAStatus(result.cumulativeGPA).label}
                            </div>
                            <div className="gpa-snapshot__meta">
                                <div className="gpa-snapshot__meta-item">
                                    <span className="gpa-snapshot__meta-value">{result.totalCredits}</span>
                                    <span>Total Credits</span>
                                </div>
                                <div className="gpa-snapshot__meta-item">
                                    <span className="gpa-snapshot__meta-value">{result.yearCount}</span>
                                    <span>Years</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                padding: "var(--space-8)",
                                textAlign: "center",
                                background: "var(--color-bg-secondary)",
                                borderRadius: "var(--radius-lg)"
                            }}
                        >
                            <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
                                Enter your yearly GPAs above to see your cumulative GPA
                            </p>
                        </div>
                    )}

                    {/* CTA */}
                    {result && (
                        <div style={{
                            marginTop: "var(--space-6)",
                            padding: "var(--space-5)",
                            background: "linear-gradient(135deg, #1e3a5f 0%, #0d9488 100%)",
                            borderRadius: "var(--radius-lg)",
                            textAlign: "center"
                        }}>
                            <p style={{ color: "white", marginBottom: "var(--space-3)", fontSize: "var(--text-lg)" }}>
                                <strong>This shows your current standing.</strong>
                            </p>
                            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "var(--space-4)" }}>
                                To see what grades you need to reach your target GPA for college:
                            </p>
                            <a
                                href="/gpa"
                                style={{
                                    display: "inline-block",
                                    background: "white",
                                    color: "#0d9488",
                                    padding: "var(--space-3) var(--space-6)",
                                    borderRadius: "var(--radius-md)",
                                    fontWeight: 600,
                                    textDecoration: "none"
                                }}
                            >
                                Plan Your Target GPA →
                            </a>
                        </div>
                    )}
                </div>

                {/* SEO Content */}
                <section className="seo-content">
                    <h2>How to Calculate Your High School GPA</h2>
                    <p>
                        Your high school GPA is the weighted average of your grades across all four years,
                        where each year is weighted by credit hours.
                    </p>

                    <h3>Worked Example: 4-Year GPA</h3>
                    <p>Student&apos;s grades across high school:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>GPA</th>
                                    <th>Credits</th>
                                    <th>Quality Points</th>
                                    <th>Cumulative</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Freshman</td><td>3.2</td><td>6</td><td>19.2</td><td>3.20</td></tr>
                                <tr><td>Sophomore</td><td>3.4</td><td>7</td><td>23.8</td><td>3.31</td></tr>
                                <tr><td>Junior</td><td>3.6</td><td>7</td><td>25.2</td><td>3.41</td></tr>
                                <tr><td>Senior</td><td>3.8</td><td>6</td><td>22.8</td><td>3.50</td></tr>
                                <tr className="seo-content__table-total">
                                    <td><strong>Total</strong></td>
                                    <td>—</td>
                                    <td><strong>26</strong></td>
                                    <td><strong>91.0</strong></td>
                                    <td><strong>3.50</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        Notice the upward trend: 3.2 → 3.4 → 3.6 → 3.8. Colleges love to see improvement.
                    </p>

                    <h3>What GPA Do You Need for College?</h3>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr><th>School Type</th><th>Typical GPA Range</th><th>Examples</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Ivy League</td><td>3.9 – 4.0</td><td>Harvard, Yale, Princeton</td></tr>
                                <tr><td>Top 20</td><td>3.7 – 3.9</td><td>Duke, Northwestern, UCLA</td></tr>
                                <tr><td>Competitive State</td><td>3.5 – 3.7</td><td>UT Austin, UMich, UVA</td></tr>
                                <tr><td>State Universities</td><td>3.0 – 3.5</td><td>Most state flagships</td></tr>
                                <tr><td>Open Admission</td><td>2.0+</td><td>Community colleges</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Can You Recover from a Bad Freshman Year?</h3>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>📈 Upward Trend</h4>
                            <p>Going 2.8 → 3.2 → 3.6 → 3.8 is more impressive than a flat 3.3 every year.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>📚 Junior Year Matters Most</h4>
                            <p>This is the most recent full year when you apply. Make it count.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🎯 Course Rigor</h4>
                            <p>A 3.5 in AP classes often outweighs 3.9 in regular classes.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>✍️ Explain in Essays</h4>
                            <p>Had a rough year? Many schools let you explain circumstances.</p>
                        </div>
                    </div>
                </section>

                {/* Related Tools */}
                <section style={{ marginTop: "var(--space-8)" }}>
                    <h3 style={{ marginBottom: "var(--space-4)" }}>Related Calculators</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}>
                        <a href="/gpa-calculators/weighted-gpa-calculator" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>Weighted GPA Calculator</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Include AP/Honors bonus points
                            </p>
                        </a>
                        <a href="/gpa" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>GPA Workspace</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Plan what grades you need
                            </p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
