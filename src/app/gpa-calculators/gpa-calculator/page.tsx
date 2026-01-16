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

const GRADES = Object.keys(GRADE_POINTS);
const CREDITS = [1, 2, 3, 4, 5, 6];

interface Course {
    credits: number;
    grade: string;
}

// 4 fixed slots - no add/remove
const INITIAL_COURSES: Course[] = [
    { credits: 3, grade: "" },
    { credits: 3, grade: "" },
    { credits: 3, grade: "" },
    { credits: 3, grade: "" },
];

export default function GPACalculator() {
    const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

    // Calculate GPA from filled courses only
    const result = useMemo(() => {
        const filledCourses = courses.filter((c) => c.grade !== "");
        if (filledCourses.length === 0) return null;

        let totalCredits = 0;
        let qualityPoints = 0;

        filledCourses.forEach((course) => {
            const gradePoints = GRADE_POINTS[course.grade] ?? 0;
            totalCredits += course.credits;
            qualityPoints += gradePoints * course.credits;
        });

        const gpa = totalCredits > 0 ? qualityPoints / totalCredits : 0;

        return { gpa, totalCredits, qualityPoints, courseCount: filledCourses.length };
    }, [courses]);

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.7) return { label: "Excellent", class: "excellent" };
        if (gpa >= 3.0) return { label: "Good", class: "good" };
        if (gpa >= 2.0) return { label: "Satisfactory", class: "warning" };
        return { label: "Needs Improvement", class: "danger" };
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
                {/* Header */}
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/gpa-calculators">GPA Calculators</a> / GPA Calculator
                    </nav>
                    <h1 className="dashboard__title">GPA Calculator</h1>
                    <p className="dashboard__subtitle">
                        Enter your courses to calculate your semester GPA
                    </p>
                </div>

                <div className="dashboard__workspace">
                    {/* Input Form - 4 fixed slots */}
                    <div className="card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-6)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ margin: 0 }}>Your Courses</h2>
                            <button
                                onClick={resetAll}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--color-text-muted)",
                                    cursor: "pointer",
                                    fontSize: "var(--text-sm)"
                                }}
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
                                        gridTemplateColumns: "1fr 100px 100px",
                                        gap: "var(--space-3)",
                                        alignItems: "center"
                                    }}
                                >
                                    <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
                                        Course {index + 1}
                                    </div>
                                    <select
                                        className="input"
                                        value={course.credits}
                                        onChange={(e) => updateCourse(index, "credits", parseInt(e.target.value))}
                                        style={{ padding: "var(--space-2)" }}
                                    >
                                        {CREDITS.map((c) => (
                                            <option key={c} value={c}>{c} credits</option>
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
                            Fill in the courses you want to calculate. Empty slots are ignored.
                        </p>
                    </div>

                    {/* Result - only show if has data */}
                    {result ? (
                        <div className={`gpa-snapshot gpa-snapshot--${getGPAStatus(result.gpa).class}`}>
                            <div className="gpa-snapshot__number">
                                {result.gpa.toFixed(2)}
                            </div>
                            <div className="gpa-snapshot__label">Your GPA</div>
                            <div className="gpa-snapshot__badge">
                                {getGPAStatus(result.gpa).label}
                            </div>
                            <div className="gpa-snapshot__meta">
                                <div className="gpa-snapshot__meta-item">
                                    <span className="gpa-snapshot__meta-value">{result.qualityPoints.toFixed(1)}</span>
                                    <span>Quality Points</span>
                                </div>
                                <div className="gpa-snapshot__meta-item">
                                    <span className="gpa-snapshot__meta-value">{result.totalCredits}</span>
                                    <span>Credits</span>
                                </div>
                                <div className="gpa-snapshot__meta-item">
                                    <span className="gpa-snapshot__meta-value">{result.courseCount}</span>
                                    <span>Courses</span>
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
                                Select grades above to see your GPA
                            </p>
                        </div>
                    )}

                    {/* CTA - based on LIMITATION */}
                    {result && (
                        <div style={{
                            marginTop: "var(--space-6)",
                            padding: "var(--space-5)",
                            background: "linear-gradient(135deg, #1e3a5f 0%, #0d9488 100%)",
                            borderRadius: "var(--radius-lg)",
                            textAlign: "center"
                        }}>
                            <p style={{ color: "white", marginBottom: "var(--space-3)", fontSize: "var(--text-lg)" }}>
                                <strong>This is a snapshot.</strong>
                            </p>
                            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "var(--space-4)" }}>
                                To plan how to raise your GPA, track across semesters, and save your data:
                            </p>
                            <CornerCTA href="/gpa">
                                Open GPA Workspace
                            </CornerCTA>
                        </div>
                    )}
                </div>

                {/* SEO Content - KEEP */}
                <section className="seo-content">
                    <h2>How to Calculate Your GPA</h2>
                    <p>
                        GPA (Grade Point Average) is calculated by dividing your total quality points by your total credit hours.
                        Each letter grade has a point value on a 4.0 scale.
                    </p>

                    <h3>The GPA Formula</h3>
                    <p>
                        <strong>GPA = Total Quality Points ÷ Total Credits</strong>
                    </p>
                    <p>
                        Quality Points = Grade Points × Credit Hours. For example, an A (4.0) in a 3-credit course
                        gives you 12 quality points.
                    </p>

                    <h3>Worked Example</h3>
                    <p>Student takes 4 courses:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Credits</th>
                                    <th>Grade</th>
                                    <th>Points</th>
                                    <th>Quality Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Calculus</td><td>4</td><td>A (4.0)</td><td>4.0</td><td>16.0</td></tr>
                                <tr><td>English</td><td>3</td><td>B+ (3.3)</td><td>3.3</td><td>9.9</td></tr>
                                <tr><td>History</td><td>3</td><td>A- (3.7)</td><td>3.7</td><td>11.1</td></tr>
                                <tr><td>Chemistry</td><td>4</td><td>B (3.0)</td><td>3.0</td><td>12.0</td></tr>
                                <tr className="seo-content__table-total">
                                    <td><strong>Total</strong></td>
                                    <td><strong>14</strong></td>
                                    <td>—</td>
                                    <td>—</td>
                                    <td><strong>49.0</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        GPA = 49.0 ÷ 14 = <strong>3.50</strong>
                    </p>

                    <h3>GPA Scale Reference</h3>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr><th>Letter</th><th>Points</th><th>Percentage</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>A / A+</td><td>4.0</td><td>93-100%</td></tr>
                                <tr><td>A-</td><td>3.7</td><td>90-92%</td></tr>
                                <tr><td>B+</td><td>3.3</td><td>87-89%</td></tr>
                                <tr><td>B</td><td>3.0</td><td>83-86%</td></tr>
                                <tr><td>B-</td><td>2.7</td><td>80-82%</td></tr>
                                <tr><td>C+</td><td>2.3</td><td>77-79%</td></tr>
                                <tr><td>C</td><td>2.0</td><td>73-76%</td></tr>
                                <tr><td>C-</td><td>1.7</td><td>70-72%</td></tr>
                                <tr><td>D+</td><td>1.3</td><td>67-69%</td></tr>
                                <tr><td>D</td><td>1.0</td><td>63-66%</td></tr>
                                <tr><td>F</td><td>0.0</td><td>Below 60%</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>What is a Good GPA?</h3>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>🎓 Dean&apos;s List</h4>
                            <p>Most schools require 3.5+ GPA for Dean&apos;s List recognition.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>📚 Grad School</h4>
                            <p>Competitive programs expect 3.5+. Minimum is usually 3.0.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>💼 Job Applications</h4>
                            <p>Many employers screen for 3.0+ GPA, especially for entry-level positions.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>⚠️ Academic Probation</h4>
                            <p>Most schools place students below 2.0 on academic probation.</p>
                        </div>
                    </div>

                    <h3>Why Credit Hours Matter</h3>
                    <p>
                        A 4-credit course impacts your GPA twice as much as a 2-credit course.
                        Focus your effort on high-credit courses for maximum GPA improvement.
                    </p>
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
                        <a href="/gpa-calculators/college-gpa-calculator" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>College GPA Calculator</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Calculate cumulative GPA across semesters
                            </p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
