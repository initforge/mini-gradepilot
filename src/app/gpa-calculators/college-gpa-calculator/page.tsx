"use client";

import { useState, useMemo } from "react";
import { CornerCTA } from "@/components/FancyButtons";

interface Semester {
    gpa: string;
    credits: string;
}

// 3 fixed semester slots
const INITIAL_SEMESTERS: Semester[] = [
    { gpa: "", credits: "" },
    { gpa: "", credits: "" },
    { gpa: "", credits: "" },
];

export default function CollegeGPACalculator() {
    const [semesters, setSemesters] = useState<Semester[]>(INITIAL_SEMESTERS);

    const result = useMemo(() => {
        const filledSemesters = semesters.filter(
            (s) => s.gpa !== "" && s.credits !== "" && parseFloat(s.credits) > 0
        );
        if (filledSemesters.length === 0) return null;

        let totalCredits = 0;
        let totalPoints = 0;

        filledSemesters.forEach((s) => {
            const gpa = parseFloat(s.gpa);
            const credits = parseFloat(s.credits);
            if (!isNaN(gpa) && !isNaN(credits)) {
                totalCredits += credits;
                totalPoints += gpa * credits;
            }
        });

        const cumulativeGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

        return { cumulativeGPA, totalCredits, semesterCount: filledSemesters.length };
    }, [semesters]);

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.7) return { label: "Excellent", class: "excellent" };
        if (gpa >= 3.0) return { label: "Good", class: "good" };
        if (gpa >= 2.0) return { label: "Satisfactory", class: "warning" };
        return { label: "Needs Improvement", class: "danger" };
    };

    const updateSemester = (index: number, field: keyof Semester, value: string) => {
        setSemesters((prev) =>
            prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
        );
    };

    const resetAll = () => setSemesters(INITIAL_SEMESTERS);

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/gpa-calculators">GPA Calculators</a> / College GPA
                    </nav>
                    <h1 className="dashboard__title">College GPA Calculator</h1>
                    <p className="dashboard__subtitle">
                        Calculate your cumulative GPA across multiple semesters
                    </p>
                </div>

                <div className="dashboard__workspace">
                    {/* Input Form */}
                    <div className="card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-6)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ margin: 0 }}>Your Semesters</h2>
                            <button
                                onClick={resetAll}
                                style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: "var(--text-sm)" }}
                            >
                                Reset
                            </button>
                        </div>

                        <div style={{ display: "grid", gap: "var(--space-3)" }}>
                            {semesters.map((semester, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "100px 1fr 1fr",
                                        gap: "var(--space-3)",
                                        alignItems: "center"
                                    }}
                                >
                                    <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
                                        Semester {index + 1}
                                    </span>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="GPA (e.g. 3.5)"
                                        value={semester.gpa}
                                        onChange={(e) => updateSemester(index, "gpa", e.target.value)}
                                        step="0.01"
                                        min="0"
                                        max="4"
                                        style={{ padding: "var(--space-2)" }}
                                    />
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="Credits (e.g. 15)"
                                        value={semester.credits}
                                        onChange={(e) => updateSemester(index, "credits", e.target.value)}
                                        min="1"
                                        max="30"
                                        style={{ padding: "var(--space-2)" }}
                                    />
                                </div>
                            ))}
                        </div>

                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-4)" }}>
                            Enter your semester GPA and credit hours. Empty rows are ignored.
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
                                    <span className="gpa-snapshot__meta-value">{result.semesterCount}</span>
                                    <span>Semesters</span>
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
                                Enter semester GPAs above to see your cumulative GPA
                            </p>
                        </div>
                    )}

                    {/* CTA */}
                    {result && (
                        <div style={{
                            marginTop: "var(--space-6)",
                            padding: "var(--space-5)",
                            background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                            borderRadius: "var(--radius-lg)",
                            textAlign: "center"
                        }}>
                            <p style={{ color: "white", marginBottom: "var(--space-3)", fontSize: "var(--text-lg)" }}>
                                <strong>This calculates your past semesters.</strong>
                            </p>
                            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "var(--space-4)" }}>
                                To plan future semesters and track your GPA over time:
                            </p>
                            <CornerCTA href="/transcript">
                                Open Transcript Workspace
                            </CornerCTA>
                        </div>
                    )}
                </div>

                {/* SEO Content */}
                <section className="seo-content">
                    <h2>How to Calculate Cumulative College GPA</h2>
                    <p>
                        Your cumulative GPA is the weighted average of all your semester GPAs,
                        where each semester is weighted by its credit hours.
                    </p>

                    <h3>The Formula</h3>
                    <p>
                        <strong>Cumulative GPA = (Sum of GPA × Credits) ÷ Total Credits</strong>
                    </p>

                    <h3>Worked Example</h3>
                    <p>Student completed 4 semesters:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Semester</th>
                                    <th>GPA</th>
                                    <th>Credits</th>
                                    <th>Quality Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Fall 2023</td><td>3.2</td><td>15</td><td>48.0</td></tr>
                                <tr><td>Spring 2024</td><td>3.5</td><td>16</td><td>56.0</td></tr>
                                <tr><td>Fall 2024</td><td>3.7</td><td>15</td><td>55.5</td></tr>
                                <tr><td>Spring 2025</td><td>3.8</td><td>14</td><td>53.2</td></tr>
                                <tr className="seo-content__table-total">
                                    <td><strong>Total</strong></td>
                                    <td>—</td>
                                    <td><strong>60</strong></td>
                                    <td><strong>212.7</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        Cumulative GPA = 212.7 ÷ 60 = <strong>3.55</strong>
                    </p>

                    <h3>GPA Requirements by Goal</h3>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr><th>Goal</th><th>Typical GPA Requirement</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Medical School</td><td>3.7+ (competitive programs)</td></tr>
                                <tr><td>Law School (T14)</td><td>3.8+</td></tr>
                                <tr><td>MBA Programs</td><td>3.5+</td></tr>
                                <tr><td>PhD Programs</td><td>3.5+ in major</td></tr>
                                <tr><td>Dean&apos;s List</td><td>3.5+ (varies by school)</td></tr>
                                <tr><td>Cum Laude</td><td>3.5+</td></tr>
                                <tr><td>Magna Cum Laude</td><td>3.7+</td></tr>
                                <tr><td>Summa Cum Laude</td><td>3.9+</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>How Later Semesters Affect Your GPA Less</h3>
                    <p>
                        The more credits you have, the harder it is to change your GPA.
                        With 60 credits, a perfect 4.0 semester of 15 credits will only raise your GPA by about 0.15 points.
                    </p>
                </section>

                {/* Related Tools */}
                <section style={{ marginTop: "var(--space-8)" }}>
                    <h3 style={{ marginBottom: "var(--space-4)" }}>Related Calculators</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}>
                        <a href="/gpa-calculators/gpa-calculator" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>GPA Calculator</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Calculate single semester GPA
                            </p>
                        </a>
                        <a href="/transcript" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>Transcript Workspace</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Track your full academic timeline
                            </p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
