"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

const LineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });

interface YearData {
    id: string;
    name: string;
    gpa: number;
    credits: number;
}

const STORAGE_KEY = "gradepilot_highschool_gpa";
const YEARS = ["Freshman", "Sophomore", "Junior", "Senior"];

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function getDefaultYears(): YearData[] {
    return YEARS.slice(0, 2).map((name) => ({
        id: generateId(),
        name,
        gpa: 3.5,
        credits: 6,
    }));
}

export default function HighSchoolGPACalculator() {
    const [mounted, setMounted] = useState(false);
    const [years, setYears] = useState<YearData[]>(getDefaultYears);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) setYears(parsed);
            } catch { /* use defaults */ }
        }
    }, []);

    useEffect(() => {
        if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(years));
    }, [years, mounted]);

    const calculations = useMemo(() => {
        let totalCredits = 0;
        let totalQualityPoints = 0;

        const trendData = years.map((year) => {
            totalCredits += year.credits;
            totalQualityPoints += year.gpa * year.credits;
            const cumulativeGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

            return {
                name: year.name,
                yearGPA: year.gpa,
                cumulativeGPA: parseFloat(cumulativeGPA.toFixed(2)),
            };
        });

        const cumulativeGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

        return { cumulativeGPA, totalCredits, trendData };
    }, [years]);

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.7) return { label: "Excellent", class: "excellent" };
        if (gpa >= 3.0) return { label: "Good", class: "good" };
        if (gpa >= 2.0) return { label: "Satisfactory", class: "warning" };
        return { label: "At Risk", class: "danger" };
    };

    const status = getGPAStatus(calculations.cumulativeGPA);

    const updateYear = (id: string, field: keyof YearData, value: string | number) => {
        setYears((prev) => prev.map((y) => (y.id === id ? { ...y, [field]: value } : y)));
    };

    const addYear = () => {
        const usedNames = years.map((y) => y.name);
        const nextYear = YEARS.find((y) => !usedNames.includes(y)) || `Year ${years.length + 1}`;
        setYears((prev) => [...prev, { id: generateId(), name: nextYear, gpa: 3.0, credits: 6 }]);
        setActiveTab(years.length);
    };

    const removeYear = (id: string) => {
        setYears((prev) => {
            const filtered = prev.filter((y) => y.id !== id);
            if (activeTab >= filtered.length) setActiveTab(Math.max(0, filtered.length - 1));
            return filtered;
        });
    };

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
                    {/* Cumulative Snapshot */}
                    <div className={`gpa-snapshot gpa-snapshot--${status.class}`}>
                        <div className="gpa-snapshot__number">
                            {mounted ? calculations.cumulativeGPA.toFixed(2) : "0.00"}
                        </div>
                        <div className="gpa-snapshot__label">Cumulative GPA</div>
                        <div className="gpa-snapshot__badge">{status.label}</div>
                        <div className="gpa-snapshot__meta">
                            <div className="gpa-snapshot__meta-item">
                                <span className="gpa-snapshot__meta-value">{calculations.totalCredits}</span>
                                <span>Total Credits</span>
                            </div>
                            <div className="gpa-snapshot__meta-item">
                                <span className="gpa-snapshot__meta-value">{years.length}</span>
                                <span>Years</span>
                            </div>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    {mounted && calculations.trendData.length > 1 && (
                        <div className="impact-section">
                            <h2 className="impact-section__title">GPA Progress</h2>
                            <div className="impact-section__chart">
                                <ResponsiveContainer width="100%" height={180}>
                                    <LineChart data={calculations.trendData} margin={{ left: 0, right: 20 }}>
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="cumulativeGPA"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            dot={{ fill: "#2563eb" }}
                                            name="Cumulative"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="yearGPA"
                                            stroke="#7c3aed"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={{ fill: "#7c3aed" }}
                                            name="Year"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Year Tabs */}
                    <div className="course-list">
                        <div style={{ display: "flex", gap: "var(--space-2)", borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-4)" }}>
                            {years.map((year, idx) => (
                                <button
                                    key={year.id}
                                    onClick={() => setActiveTab(idx)}
                                    style={{
                                        padding: "var(--space-2) var(--space-4)",
                                        background: activeTab === idx ? "var(--color-primary)" : "transparent",
                                        color: activeTab === idx ? "white" : "var(--color-text-muted)",
                                        border: "none",
                                        borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                                        fontSize: "var(--text-sm)",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                    }}
                                >
                                    {year.name}
                                </button>
                            ))}
                            {years.length < 4 && (
                                <button
                                    onClick={addYear}
                                    style={{
                                        padding: "var(--space-2) var(--space-4)",
                                        background: "transparent",
                                        color: "var(--color-primary)",
                                        border: "none",
                                        fontSize: "var(--text-sm)",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                    }}
                                >
                                    + Add Year
                                </button>
                            )}
                        </div>

                        {/* Active Year Form */}
                        {years[activeTab] && (
                            <div className="card" style={{ padding: "var(--space-4)" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "var(--space-4)", alignItems: "end" }}>
                                    <div className="input-group">
                                        <label className="input-group__label">Year</label>
                                        <select
                                            className="input select"
                                            value={years[activeTab].name}
                                            onChange={(e) => updateYear(years[activeTab].id, "name", e.target.value)}
                                        >
                                            {YEARS.map((y) => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-group__label">Year GPA</label>
                                        <input
                                            type="number"
                                            className="input"
                                            step={0.01}
                                            min={0}
                                            max={4}
                                            value={years[activeTab].gpa}
                                            onChange={(e) => updateYear(years[activeTab].id, "gpa", parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-group__label">Credits</label>
                                        <input
                                            type="number"
                                            className="input"
                                            min={1}
                                            max={20}
                                            value={years[activeTab].credits}
                                            onChange={(e) => updateYear(years[activeTab].id, "credits", parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                    {years.length > 1 && (
                                        <button
                                            onClick={() => removeYear(years[activeTab].id)}
                                            className="btn btn--destructive btn--sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <details className="explanation-section">
                    <summary>How High School GPA is Calculated</summary>
                    <div className="explanation-section__content">
                        <p>Your cumulative GPA is the weighted average of all years:</p>
                        <p style={{ fontFamily: "monospace", background: "var(--color-bg-secondary)", padding: "var(--space-2)", borderRadius: "var(--radius-sm)", marginTop: "var(--space-2)" }}>
                            Cumulative GPA = Σ(Year GPA × Credits) ÷ Total Credits
                        </p>
                    </div>
                </details>

                {/* Deep SEO Content */}
                <section className="seo-content">
                    <h2>How to Calculate Your High School GPA</h2>
                    <p>
                        Your high school GPA (Grade Point Average) is one of the most important numbers in your academic life.
                        It&apos;s the first thing colleges look at, and it determines scholarship eligibility, honor roll status,
                        and class rank. Understanding how it&apos;s calculated helps you make strategic decisions about your courses.
                    </p>

                    <h3>Worked Example: 4-Year Cumulative GPA</h3>
                    <p>Let&apos;s calculate a real example of a student improving their GPA over four years:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>GPA</th>
                                    <th>Credits</th>
                                    <th>Quality Points</th>
                                    <th>Cumulative GPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Freshman</td>
                                    <td>3.2</td>
                                    <td>6</td>
                                    <td>19.2</td>
                                    <td>3.20</td>
                                </tr>
                                <tr>
                                    <td>Sophomore</td>
                                    <td>3.4</td>
                                    <td>7</td>
                                    <td>23.8</td>
                                    <td>3.31</td>
                                </tr>
                                <tr>
                                    <td>Junior</td>
                                    <td>3.6</td>
                                    <td>7</td>
                                    <td>25.2</td>
                                    <td>3.41</td>
                                </tr>
                                <tr>
                                    <td>Senior</td>
                                    <td>3.8</td>
                                    <td>6</td>
                                    <td>22.8</td>
                                    <td>3.50</td>
                                </tr>
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
                        Notice how this student started with a 3.2 freshman year and ended with a <strong>3.50 cumulative GPA</strong>
                        by improving each year. Colleges love to see upward trends like this.
                    </p>

                    <h3>What GPA Do You Need for College?</h3>
                    <p>Here are typical GPA requirements for different types of colleges:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>School Type</th>
                                    <th>Typical GPA Range</th>
                                    <th>Examples</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Ivy League</td>
                                    <td>3.9 – 4.0</td>
                                    <td>Harvard, Yale, Princeton</td>
                                </tr>
                                <tr>
                                    <td>Top 20 Universities</td>
                                    <td>3.7 – 3.9</td>
                                    <td>Duke, Northwestern, UCLA</td>
                                </tr>
                                <tr>
                                    <td>Competitive State Schools</td>
                                    <td>3.5 – 3.7</td>
                                    <td>UT Austin, UMich, UVA</td>
                                </tr>
                                <tr>
                                    <td>Most State Universities</td>
                                    <td>3.0 – 3.5</td>
                                    <td>State flagships</td>
                                </tr>
                                <tr>
                                    <td>Community Colleges</td>
                                    <td>2.0+</td>
                                    <td>Open admission</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Can I Still Get Into a Good College If Freshman Year Was Bad?</h3>
                    <p>
                        <strong>Yes.</strong> Admissions officers understand that students mature. They look for:
                    </p>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>📈 Upward Trend</h4>
                            <p>
                                A student who goes 2.8 → 3.2 → 3.6 → 3.8 is more impressive than someone
                                with a flat 3.3 every year. Show growth.
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>📚 Junior Year Matters Most</h4>
                            <p>
                                Junior year GPA is weighted heavily because it&apos;s the most recent full year
                                when you apply. Make it count.
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🎯 Course Rigor</h4>
                            <p>
                                A 3.5 in AP/Honors courses is often more valuable than a 3.9 in regular classes.
                                Colleges see your course difficulty.
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>✍️ Explain in Essays</h4>
                            <p>
                                If you had a rough year due to circumstances (health, family), you can explain
                                this in your application.
                            </p>
                        </div>
                    </div>

                    <h3>Weighted vs Unweighted GPA</h3>
                    <p>
                        <strong>Unweighted GPA</strong> uses the standard 4.0 scale. <strong>Weighted GPA</strong>
                        gives bonus points for harder courses:
                    </p>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li><strong>Honors:</strong> +0.5 points (A = 4.5)</li>
                        <li><strong>AP/IB:</strong> +1.0 points (A = 5.0)</li>
                    </ul>
                    <p>
                        Most colleges recalculate your GPA using their own system, so don&apos;t stress too much
                        about your school&apos;s specific weighting.
                    </p>

                    <h3>How to Raise Your GPA Before Senior Year</h3>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li><strong>Retake failed courses:</strong> Some schools allow grade replacement</li>
                        <li><strong>Take summer classes:</strong> Boost credits with strong grades</li>
                        <li><strong>Focus on junior year:</strong> This is the most impactful year</li>
                        <li><strong>Get help early:</strong> Tutoring, office hours, study groups</li>
                    </ul>

                    <h3>Next Steps</h3>
                    <p>
                        Use our <a href="/gpa">GPA Workspace</a> to plan exactly what grades you need
                        in each course to hit your target. The <strong>Aim Mode</strong> feature shows
                        you the specific grades required to reach any GPA goal.
                    </p>
                    <p>
                        For weighted GPA calculations with AP/Honors bonuses, try our
                        <a href="/gpa-calculators/weighted-gpa-calculator"> Weighted GPA Calculator</a>.
                    </p>
                    <p style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--color-primary)" }}>
                        <strong>📌 Save this page</strong> — update your GPA after each semester.
                        Your data stays in your browser, no account needed.
                    </p>
                </section>

                {/* Related Tools */}
                <section style={{ marginTop: "var(--space-8)" }}>
                    <h3 style={{ marginBottom: "var(--space-4)" }}>Related Tools</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}>
                        <a href="/gpa" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>GPA Workspace</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Plan your target GPA with Aim Mode
                            </p>
                        </a>
                        <a href="/gpa-calculators/weighted-gpa-calculator" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>Weighted GPA Calculator</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Include AP/Honors bonus points
                            </p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
