"use client";

import { useState, useMemo } from "react";
import { CornerCTA } from "@/components/FancyButtons";

const GRADE_POINTS: Record<string, number> = {
    "A+": 4.0, A: 4.0, "A-": 3.7,
    "B+": 3.3, B: 3.0, "B-": 2.7,
    "C+": 2.3, C: 2.0, "C-": 1.7,
    "D+": 1.3, D: 1.0, "D-": 0.7,
    F: 0.0,
};

const COURSE_TYPES = [
    { value: "regular", label: "Regular", bonus: 0 },
    { value: "honors", label: "Honors (+0.5)", bonus: 0.5 },
    { value: "ap", label: "AP/IB (+1.0)", bonus: 1.0 },
];

const GRADES = Object.keys(GRADE_POINTS);
const CREDITS = [1, 2, 3, 4, 5, 6];

interface Course {
    credits: number;
    grade: string;
    type: string;
}

// 4 fixed slots - no add/remove
const INITIAL_COURSES: Course[] = [
    { credits: 3, grade: "", type: "regular" },
    { credits: 3, grade: "", type: "regular" },
    { credits: 3, grade: "", type: "regular" },
    { credits: 3, grade: "", type: "regular" },
];

export default function WeightedGPACalculator() {
    const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

    const result = useMemo(() => {
        const filledCourses = courses.filter((c) => c.grade !== "");
        if (filledCourses.length === 0) return null;

        let totalCredits = 0;
        let unweightedPoints = 0;
        let weightedPoints = 0;

        filledCourses.forEach((course) => {
            const gradePoints = GRADE_POINTS[course.grade] ?? 0;
            const bonus = COURSE_TYPES.find((t) => t.value === course.type)?.bonus ?? 0;

            totalCredits += course.credits;
            unweightedPoints += gradePoints * course.credits;
            weightedPoints += (gradePoints + bonus) * course.credits;
        });

        return {
            unweightedGPA: totalCredits > 0 ? unweightedPoints / totalCredits : 0,
            weightedGPA: totalCredits > 0 ? weightedPoints / totalCredits : 0,
            totalCredits,
            courseCount: filledCourses.length,
            bonus: (weightedPoints - unweightedPoints) / totalCredits,
        };
    }, [courses]);

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 4.5) return { label: "Outstanding", class: "excellent" };
        if (gpa >= 4.0) return { label: "Excellent", class: "excellent" };
        if (gpa >= 3.5) return { label: "Great", class: "good" };
        if (gpa >= 3.0) return { label: "Good", class: "good" };
        return { label: "Needs Work", class: "warning" };
    };

    const updateCourse = (index: number, field: keyof Course, value: string | number) => {
        setCourses((prev) =>
            prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
        );
    };

    const resetAll = () => setCourses(INITIAL_COURSES);

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/gpa-calculators">GPA Calculators</a> / Weighted GPA
                    </nav>
                    <h1 className="dashboard__title">Weighted GPA Calculator</h1>
                    <p className="dashboard__subtitle">
                        Calculate GPA with AP, IB, and Honors bonuses
                    </p>
                </div>

                <div className="dashboard__workspace">
                    {/* Input Form - 4 fixed slots */}
                    <div className="card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-6)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ margin: 0 }}>Your Courses</h2>
                            <button
                                onClick={resetAll}
                                style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: "var(--text-sm)" }}
                            >
                                Reset
                            </button>
                        </div>

                        <div style={{ display: "grid", gap: "var(--space-3)" }}>
                            {courses.map((course, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "60px 1fr 90px 90px",
                                        gap: "var(--space-2)",
                                        alignItems: "center"
                                    }}
                                >
                                    <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
                                        Course {index + 1}
                                    </span>
                                    <select
                                        className="input"
                                        value={course.type}
                                        onChange={(e) => updateCourse(index, "type", e.target.value)}
                                        style={{ padding: "var(--space-2)", fontSize: "var(--text-sm)" }}
                                    >
                                        {COURSE_TYPES.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="input"
                                        value={course.credits}
                                        onChange={(e) => updateCourse(index, "credits", parseInt(e.target.value))}
                                        style={{ padding: "var(--space-2)" }}
                                    >
                                        {CREDITS.map((c) => (
                                            <option key={c} value={c}>{c} cr</option>
                                        ))}
                                    </select>
                                    <select
                                        className="input"
                                        value={course.grade}
                                        onChange={(e) => updateCourse(index, "grade", e.target.value)}
                                        style={{ padding: "var(--space-2)" }}
                                    >
                                        <option value="">Grade</option>
                                        {GRADES.map((g) => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-4)" }}>
                            Select course type (Regular, Honors, AP/IB) to apply the correct weighting.
                        </p>
                    </div>

                    {/* Result - Comparison */}
                    {result ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
                            {/* Weighted GPA */}
                            <div className={`gpa-snapshot gpa-snapshot--${getGPAStatus(result.weightedGPA).class}`}>
                                <div className="gpa-snapshot__number">
                                    {result.weightedGPA.toFixed(2)}
                                </div>
                                <div className="gpa-snapshot__label">Weighted GPA</div>
                                <div className="gpa-snapshot__badge">
                                    {getGPAStatus(result.weightedGPA).label}
                                </div>
                            </div>

                            {/* Unweighted GPA */}
                            <div className="gpa-snapshot" style={{ background: "var(--color-bg-secondary)" }}>
                                <div className="gpa-snapshot__number" style={{ color: "var(--color-text)" }}>
                                    {result.unweightedGPA.toFixed(2)}
                                </div>
                                <div className="gpa-snapshot__label" style={{ color: "var(--color-text-muted)" }}>Unweighted GPA</div>
                                <div style={{
                                    marginTop: "var(--space-2)",
                                    padding: "var(--space-1) var(--space-3)",
                                    background: "var(--color-primary-light)",
                                    color: "var(--color-primary)",
                                    borderRadius: "var(--radius-full)",
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 600
                                }}>
                                    +{result.bonus.toFixed(2)} bonus
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
                                Select grades above to see your weighted vs unweighted GPA
                            </p>
                        </div>
                    )}

                    {/* CTA */}
                    {result && (
                        <div style={{
                            marginTop: "var(--space-6)",
                            padding: "var(--space-5)",
                            background: "linear-gradient(135deg, #1e3a5f 0%, #7c3aed 100%)",
                            borderRadius: "var(--radius-lg)",
                            textAlign: "center"
                        }}>
                            <p style={{ color: "white", marginBottom: "var(--space-3)", fontSize: "var(--text-lg)" }}>
                                <strong>This is a one-time calculation.</strong>
                            </p>
                            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "var(--space-4)" }}>
                                To track your weighted GPA over time and plan across semesters:
                            </p>
                            <CornerCTA href="/gpa">
                                Open GPA Workspace
                            </CornerCTA>
                        </div>
                    )}
                </div>

                {/* SEO Content */}
                <section className="seo-content">
                    <h2>What is Weighted GPA?</h2>
                    <p>
                        Weighted GPA gives extra credit for harder courses. On a weighted scale, an A in an
                        AP class is worth 5.0 instead of 4.0, reflecting the added difficulty.
                    </p>

                    <h3>How Weighting Works</h3>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Course Type</th>
                                    <th>Bonus</th>
                                    <th>A Grade Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Regular</td><td>+0.0</td><td>4.0</td></tr>
                                <tr><td>Honors</td><td>+0.5</td><td>4.5</td></tr>
                                <tr><td>AP / IB</td><td>+1.0</td><td>5.0</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Worked Example</h3>
                    <p>Student takes 4 courses:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Type</th>
                                    <th>Credits</th>
                                    <th>Grade</th>
                                    <th>Unweighted</th>
                                    <th>Weighted</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>AP Calculus</td><td>AP</td><td>4</td><td>A</td><td>16.0</td><td>20.0</td></tr>
                                <tr><td>Honors English</td><td>Honors</td><td>3</td><td>A-</td><td>11.1</td><td>12.6</td></tr>
                                <tr><td>History</td><td>Regular</td><td>3</td><td>B+</td><td>9.9</td><td>9.9</td></tr>
                                <tr><td>AP Physics</td><td>AP</td><td>4</td><td>B</td><td>12.0</td><td>16.0</td></tr>
                                <tr className="seo-content__table-total">
                                    <td colSpan={4}><strong>Total (14 credits)</strong></td>
                                    <td><strong>49.0</strong></td>
                                    <td><strong>58.5</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        <strong>Unweighted GPA:</strong> 49.0 ÷ 14 = 3.50<br />
                        <strong>Weighted GPA:</strong> 58.5 ÷ 14 = <strong>4.18</strong>
                    </p>

                    <h3>Why Weighted GPA Matters</h3>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>🎓 College Admissions</h4>
                            <p>Many colleges recalculate GPA using their own weighting system, but taking rigorous courses is always valued.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>📊 Class Rank</h4>
                            <p>Schools often use weighted GPA for class rank, rewarding students who take challenging courses.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>💡 Course Selection</h4>
                            <p>A B in AP might help your weighted GPA more than an A in a regular class.</p>
                        </div>
                    </div>

                    <h3>Weighted vs Unweighted: Which Matters More?</h3>
                    <p>
                        <strong>Both matter.</strong> Colleges look at unweighted GPA to compare students fairly,
                        but they also consider course rigor. Taking 4 AP classes with a 3.7 is often more impressive
                        than all regular classes with a 4.0.
                    </p>
                </section>

                {/* Related Tools */}
                <section style={{ marginTop: "var(--space-8)" }}>
                    <h3 style={{ marginBottom: "var(--space-4)" }}>Related Calculators</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}>
                        <a href="/gpa-calculators/gpa-calculator" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>GPA Calculator</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Standard 4.0 scale calculation
                            </p>
                        </a>
                        <a href="/gpa-calculators/high-school-gpa-calculator" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>High School GPA</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Calculate across all 4 years
                            </p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
