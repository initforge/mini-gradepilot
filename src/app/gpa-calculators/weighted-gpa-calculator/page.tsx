"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import RelatedTools from "@/components/RelatedTools";

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });

const GRADE_POINTS: Record<string, number> = {
    "A+": 4.0, A: 4.0, "A-": 3.7,
    "B+": 3.3, B: 3.0, "B-": 2.7,
    "C+": 2.3, C: 2.0, "C-": 1.7,
    "D+": 1.3, D: 1.0, "D-": 0.7,
    F: 0.0,
};

const COURSE_TYPES = [
    { value: "regular", label: "Regular", bonus: 0 },
    { value: "honors", label: "Honors", bonus: 0.5 },
    { value: "ap", label: "AP/IB", bonus: 1.0 },
];

const GRADES = Object.keys(GRADE_POINTS);
const CREDITS = [1, 2, 3, 4, 5, 6];

interface Course {
    id: string;
    name: string;
    credits: number;
    grade: string;
    type: string;
}

const STORAGE_KEY = "gradepilot_weighted_gpa_courses";

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function getDefaultCourses(): Course[] {
    return [
        { id: generateId(), name: "", credits: 3, grade: "A", type: "regular" },
        { id: generateId(), name: "", credits: 3, grade: "B+", type: "honors" },
        { id: generateId(), name: "", credits: 3, grade: "B", type: "ap" },
    ];
}

export default function WeightedGPACalculator() {
    const [mounted, setMounted] = useState(false);
    const [courses, setCourses] = useState<Course[]>(getDefaultCourses);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) setCourses(parsed);
            } catch { /* use defaults */ }
        }
    }, []);

    useEffect(() => {
        if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    }, [courses, mounted]);

    const calculations = useMemo(() => {
        const validCourses = courses.filter((c) => c.credits > 0);
        if (validCourses.length === 0) {
            return { unweightedGPA: 0, weightedGPA: 0, totalCredits: 0, courseData: [] };
        }

        let totalCredits = 0;
        let unweightedPoints = 0;
        let weightedPoints = 0;

        const courseData = validCourses.map((course) => {
            const gradePoints = GRADE_POINTS[course.grade] ?? 0;
            const bonus = COURSE_TYPES.find((t) => t.value === course.type)?.bonus ?? 0;
            const weightedGradePoints = gradePoints + bonus;

            totalCredits += course.credits;
            unweightedPoints += gradePoints * course.credits;
            weightedPoints += weightedGradePoints * course.credits;

            return {
                ...course,
                gradePoints,
                bonus,
                weightedGradePoints,
                impact: (weightedGradePoints * course.credits),
            };
        });

        courseData.forEach((c) => {
            c.impact = (c.weightedGradePoints * c.credits) / totalCredits;
        });

        return {
            unweightedGPA: totalCredits > 0 ? unweightedPoints / totalCredits : 0,
            weightedGPA: totalCredits > 0 ? weightedPoints / totalCredits : 0,
            totalCredits,
            courseData,
        };
    }, [courses]);

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 4.0) return { label: "Excellent", class: "excellent" };
        if (gpa >= 3.5) return { label: "Great", class: "good" };
        if (gpa >= 3.0) return { label: "Good", class: "good" };
        return { label: "Needs Work", class: "warning" };
    };

    const status = getGPAStatus(calculations.weightedGPA);

    const chartData = calculations.courseData
        .map((c, idx) => ({
            name: c.name || `Course ${idx + 1}`,
            impact: parseFloat(c.impact.toFixed(3)),
            fill: c.type === "ap" ? "#7c3aed" : c.type === "honors" ? "#2563eb" : "#64748b",
        }))
        .sort((a, b) => b.impact - a.impact);

    const updateCourse = (id: string, field: keyof Course, value: string | number) => {
        setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    };

    const addCourse = () => {
        setCourses((prev) => [...prev, { id: generateId(), name: "", credits: 3, grade: "A", type: "regular" }]);
    };

    const removeCourse = (id: string) => {
        setCourses((prev) => prev.filter((c) => c.id !== id));
    };

    const clearAll = () => {
        setCourses(getDefaultCourses());
    };

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/gpa-calculators">GPA Calculators</a> / Weighted GPA
                    </nav>
                    <h1 className="dashboard__title">Weighted GPA Calculator</h1>
                    <p className="dashboard__subtitle">
                        Calculate GPA with Honors (+0.5) and AP/IB (+1.0) bonuses
                    </p>
                </div>

                <div className="dashboard__workspace">
                    {/* Dual Snapshot */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                        <div className="card card--elevated" style={{ textAlign: "center", padding: "var(--space-5)" }}>
                            <div style={{ fontSize: "var(--text-4xl)", fontWeight: 800, color: "var(--color-text)" }}>
                                {mounted ? calculations.unweightedGPA.toFixed(2) : "0.00"}
                            </div>
                            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Unweighted GPA
                            </div>
                        </div>
                        <div className={`gpa-snapshot gpa-snapshot--${status.class}`} style={{ padding: "var(--space-5)" }}>
                            <div className="gpa-snapshot__number" style={{ fontSize: "var(--text-5xl)" }}>
                                {mounted ? calculations.weightedGPA.toFixed(2) : "0.00"}
                            </div>
                            <div className="gpa-snapshot__label">Weighted GPA</div>
                            <div className="gpa-snapshot__badge">{status.label}</div>
                        </div>
                    </div>

                    {/* Bonus Legend */}
                    <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                        <span>📘 Regular: +0.0</span>
                        <span>📗 Honors: +0.5</span>
                        <span>📕 AP/IB: +1.0</span>
                    </div>

                    {/* Impact Chart */}
                    {mounted && chartData.length > 0 && (
                        <div className="impact-section">
                            <h2 className="impact-section__title">Course Contribution</h2>
                            <div className="impact-section__chart">
                                <ResponsiveContainer width="100%" height={Math.max(150, chartData.length * 40)}>
                                    <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20 }}>
                                        <XAxis type="number" tick={{ fontSize: 12 }} />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={75} />
                                        <Tooltip formatter={(v) => [Number(v).toFixed(3), "Contribution"]} />
                                        <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                                            {chartData.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Course List */}
                    <div className="course-list">
                        <div className="course-list__header">
                            <h2 className="course-list__title">Courses</h2>
                            <div className="course-list__actions">
                                <button onClick={addCourse} className="btn btn--primary btn--sm">+ Add</button>
                                <button onClick={clearAll} className="btn btn--destructive btn--sm">Clear</button>
                            </div>
                        </div>

                        <div className="course-list__grid">
                            {courses.map((course, idx) => (
                                <div key={course.id} className="course-card">
                                    <div className="course-card__indicator" style={{
                                        background: course.type === "ap" ? "#7c3aed" : course.type === "honors" ? "#2563eb" : "#cbd5e1"
                                    }}></div>
                                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "var(--space-2)", alignItems: "center" }}>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder={`Course ${idx + 1}`}
                                            value={course.name}
                                            onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                                        />
                                        <select
                                            className="input select"
                                            value={course.type}
                                            onChange={(e) => updateCourse(course.id, "type", e.target.value)}
                                        >
                                            {COURSE_TYPES.map((t) => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>
                                        <select
                                            className="input select"
                                            value={course.credits}
                                            onChange={(e) => updateCourse(course.id, "credits", parseInt(e.target.value))}
                                        >
                                            {CREDITS.map((c) => (
                                                <option key={c} value={c}>{c} cr</option>
                                            ))}
                                        </select>
                                        <select
                                            className="input select"
                                            value={course.grade}
                                            onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                                        >
                                            {GRADES.map((g) => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={() => removeCourse(course.id)} className="course-card__delete">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <details className="explanation-section">
                    <summary>How Weighted GPA Works</summary>
                    <div className="explanation-section__content">
                        <p>Weighted GPA adds bonus points for advanced courses:</p>
                        <ul style={{ marginLeft: "var(--space-4)", marginTop: "var(--space-2)" }}>
                            <li><strong>Honors:</strong> +0.5 points</li>
                            <li><strong>AP/IB:</strong> +1.0 points</li>
                        </ul>
                        <p style={{ marginTop: "var(--space-3)" }}>
                            This means a B (3.0) in an AP class counts as 4.0 in weighted GPA calculations.
                        </p>
                    </div>
                </details>

                {/* Deep SEO Content */}
                <section className="seo-content">
                    <h2>What is Weighted GPA?</h2>
                    <p>
                        Weighted GPA is a modified version of the standard 4.0 GPA scale that gives extra credit for more challenging courses.
                        While a regular (unweighted) GPA maxes out at 4.0, weighted GPA can go higher — typically up to 5.0 —
                        because advanced courses like AP, IB, and Honors receive bonus points.
                    </p>
                    <p>
                        This system recognizes that earning a B in AP Calculus requires more effort than earning a B in regular math,
                        and rewards students who challenge themselves academically.
                    </p>

                    <h3>How Weighted GPA Bonuses Work</h3>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Course Type</th>
                                    <th>Bonus Points</th>
                                    <th>A Grade Value</th>
                                    <th>B Grade Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Regular</td>
                                    <td>+0.0</td>
                                    <td>4.0</td>
                                    <td>3.0</td>
                                </tr>
                                <tr>
                                    <td>Honors / Pre-AP</td>
                                    <td>+0.5</td>
                                    <td>4.5</td>
                                    <td>3.5</td>
                                </tr>
                                <tr>
                                    <td>AP / IB / Dual Enrollment</td>
                                    <td>+1.0</td>
                                    <td>5.0</td>
                                    <td>4.0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Worked Example: Calculating Weighted GPA</h3>
                    <p>Let&apos;s calculate both unweighted and weighted GPA for this schedule:</p>
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
                                <tr>
                                    <td>AP English</td>
                                    <td>AP</td>
                                    <td>4</td>
                                    <td>B (3.0)</td>
                                    <td>12.0</td>
                                    <td>16.0</td>
                                </tr>
                                <tr>
                                    <td>Honors Chemistry</td>
                                    <td>Honors</td>
                                    <td>4</td>
                                    <td>A (4.0)</td>
                                    <td>16.0</td>
                                    <td>18.0</td>
                                </tr>
                                <tr>
                                    <td>Regular Math</td>
                                    <td>Regular</td>
                                    <td>3</td>
                                    <td>A (4.0)</td>
                                    <td>12.0</td>
                                    <td>12.0</td>
                                </tr>
                                <tr>
                                    <td>AP History</td>
                                    <td>AP</td>
                                    <td>3</td>
                                    <td>A- (3.7)</td>
                                    <td>11.1</td>
                                    <td>14.1</td>
                                </tr>
                                <tr className="seo-content__table-total">
                                    <td colSpan={2}><strong>Total</strong></td>
                                    <td><strong>14</strong></td>
                                    <td>—</td>
                                    <td><strong>51.1</strong></td>
                                    <td><strong>60.1</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        <strong>Unweighted GPA:</strong> 51.1 ÷ 14 = <strong>3.65</strong><br />
                        <strong>Weighted GPA:</strong> 60.1 ÷ 14 = <strong>4.29</strong>
                    </p>
                    <p>
                        The same student has a 3.65 unweighted but a 4.29 weighted GPA!
                        This demonstrates how taking challenging courses significantly boosts your weighted GPA.
                    </p>

                    <h3>Weighted GPA Benchmarks for College Admissions</h3>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>School Type</th>
                                    <th>Competitive Weighted GPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>State universities</td>
                                    <td>3.5 – 4.0</td>
                                </tr>
                                <tr>
                                    <td>Competitive state schools</td>
                                    <td>4.0 – 4.3</td>
                                </tr>
                                <tr>
                                    <td>Top 50 universities</td>
                                    <td>4.2 – 4.5</td>
                                </tr>
                                <tr>
                                    <td>Ivy League / Top 20</td>
                                    <td>4.5+</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Should You Take AP/Honors Classes?</h3>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>✅ Take the harder class if:</h4>
                            <p>
                                You&apos;re aiming for competitive colleges, you&apos;re strong in the subject,
                                or you need the challenge. Even a B in AP looks better than an A in regular to admissions officers.
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>⚠️ Consider regular classes if:</h4>
                            <p>
                                You&apos;re already overloaded, struggling in the subject, or the stress would hurt your mental health.
                                Colleges want to see you challenge yourself, but not fail.
                            </p>
                        </div>
                    </div>

                    <h3>Weighted vs Unweighted: Which Do Colleges Care About?</h3>
                    <p>
                        Most colleges recalculate your GPA using their own scale anyway. However, they do look at:
                    </p>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li><strong>Course rigor:</strong> Did you take the hardest classes available?</li>
                        <li><strong>Upward trend:</strong> Did your grades improve over time?</li>
                        <li><strong>Context:</strong> What courses does your school offer?</li>
                    </ul>
                    <p>
                        The bottom line: weighted GPA matters, but course selection matters even more.
                    </p>

                    <h3>Next Steps</h3>
                    <p>
                        After calculating your weighted GPA, use our <a href="/gpa">GPA Workspace</a> with Aim Mode
                        to see exactly what grades you need in future courses to reach your target.
                        You can toggle between weighted and unweighted views there.
                    </p>
                </section>

                {/* Related Tools */}
                <RelatedTools currentPath="/gpa-calculators/weighted-gpa-calculator" />
            </div>
        </div>
    );
}
