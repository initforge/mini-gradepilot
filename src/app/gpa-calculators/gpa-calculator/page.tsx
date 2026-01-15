"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import RelatedTools from "@/components/RelatedTools";

// Lazy load Recharts for performance
const BarChart = dynamic(
    () => import("recharts").then((mod) => mod.BarChart),
    { ssr: false }
);
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
    ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), {
    ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), {
    ssr: false,
});
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
    ssr: false,
});
const ResponsiveContainer = dynamic(
    () => import("recharts").then((mod) => mod.ResponsiveContainer),
    { ssr: false }
);
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), {
    ssr: false,
});

const GRADE_POINTS: Record<string, number> = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0.0,
};

const GRADES = Object.keys(GRADE_POINTS);
const CREDITS = [1, 2, 3, 4, 5, 6];

interface Course {
    id: string;
    name: string;
    credits: number;
    grade: string;
}

const STORAGE_KEY = "gradepilot_gpa_courses";

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function getDefaultCourses(): Course[] {
    return [
        { id: generateId(), name: "", credits: 3, grade: "A" },
        { id: generateId(), name: "", credits: 3, grade: "A" },
        { id: generateId(), name: "", credits: 3, grade: "A" },
    ];
}

export default function GPACalculator() {
    const [mounted, setMounted] = useState(false);
    const [courses, setCourses] = useState<Course[]>(getDefaultCourses);

    // Load from localStorage on mount
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCourses(parsed);
                }
            } catch {
                // Invalid data, use defaults
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (mounted) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
        }
    }, [courses, mounted]);

    // Calculations
    const calculations = useMemo(() => {
        const validCourses = courses.filter((c) => c.credits > 0);
        if (validCourses.length === 0) {
            return { gpa: 0, totalCredits: 0, qualityPoints: 0, courseData: [] };
        }

        let totalCredits = 0;
        let qualityPoints = 0;

        const courseData = validCourses.map((course) => {
            const gradePoints = GRADE_POINTS[course.grade] ?? 0;
            const points = gradePoints * course.credits;
            totalCredits += course.credits;
            qualityPoints += points;

            // Impact: contribution to current GPA
            const impact = points / totalCredits;
            // Potential: if improved to A
            const maxPoints = 4.0 * course.credits;
            const potentialGain = (maxPoints - points) / totalCredits;

            return {
                ...course,
                gradePoints,
                points,
                impact,
                potentialGain,
            };
        });

        const gpa = totalCredits > 0 ? qualityPoints / totalCredits : 0;

        // Recalculate impact with final totalCredits
        courseData.forEach((c) => {
            c.impact = c.points / totalCredits;
            c.potentialGain = ((4.0 * c.credits) - c.points) / totalCredits;
        });

        return { gpa, totalCredits, qualityPoints, courseData };
    }, [courses]);

    // Determine GPA status
    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.7) return { label: "Excellent", class: "excellent" };
        if (gpa >= 3.0) return { label: "Good", class: "good" };
        if (gpa >= 2.0) return { label: "Satisfactory", class: "warning" };
        return { label: "Needs Improvement", class: "danger" };
    };

    const status = getGPAStatus(calculations.gpa);

    // Impact tier for course cards
    const getImpactTier = (course: { credits: number; gradePoints: number }) => {
        if (course.credits >= 3 && course.gradePoints < 3.7) return "high";
        if (course.credits >= 2 && course.gradePoints < 3.0) return "medium";
        return "low";
    };

    // Chart data
    const chartData = calculations.courseData
        .map((c) => ({
            name: c.name || `Course ${courses.indexOf(c) + 1}`,
            impact: parseFloat(c.impact.toFixed(3)),
            fill:
                getImpactTier(c) === "high"
                    ? "#16a34a"
                    : getImpactTier(c) === "medium"
                        ? "#f59e0b"
                        : "#dc2626",
        }))
        .sort((a, b) => b.impact - a.impact);

    // Find best improvement opportunity
    const bestOpportunity = calculations.courseData
        .filter((c) => c.gradePoints < 4.0)
        .sort((a, b) => b.potentialGain - a.potentialGain)[0];

    // Handlers
    const updateCourse = (id: string, field: keyof Course, value: string | number) => {
        setCourses((prev) =>
            prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
        );
    };

    const addCourse = () => {
        setCourses((prev) => [
            ...prev,
            { id: generateId(), name: "", credits: 3, grade: "A" },
        ]);
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
                {/* Header */}
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/gpa-calculators">GPA Calculators</a> / GPA Calculator
                    </nav>
                    <h1 className="dashboard__title">GPA Calculator</h1>
                    <p className="dashboard__subtitle">
                        Calculate your GPA and see which courses have the most impact
                    </p>
                </div>

                {/* Workspace */}
                <div className="dashboard__workspace">
                    {/* 1. GPA Snapshot */}
                    <div className={`gpa-snapshot gpa-snapshot--${status.class}`}>
                        <div className="gpa-snapshot__number">
                            {mounted ? calculations.gpa.toFixed(2) : "0.00"}
                        </div>
                        <div className="gpa-snapshot__label">Current GPA</div>
                        <div className="gpa-snapshot__badge">
                            {status.label}
                        </div>
                        <div className="gpa-snapshot__meta">
                            <div className="gpa-snapshot__meta-item">
                                <span className="gpa-snapshot__meta-value">
                                    {calculations.qualityPoints.toFixed(1)}
                                </span>
                                <span>Quality Points</span>
                            </div>
                            <div className="gpa-snapshot__meta-item">
                                <span className="gpa-snapshot__meta-value">
                                    {calculations.totalCredits}
                                </span>
                                <span>Total Credits</span>
                            </div>
                        </div>
                        {bestOpportunity && (
                            <div className="gpa-snapshot__insight">
                                Improving {bestOpportunity.name || "a course"} to an A could raise your GPA by +
                                {bestOpportunity.potentialGain.toFixed(2)}
                            </div>
                        )}
                    </div>

                    {/* 2. Impact Analysis */}
                    {mounted && chartData.length > 0 && (
                        <div className="impact-section">
                            <div className="impact-section__header">
                                <h2 className="impact-section__title">Course Impact Analysis</h2>
                            </div>

                            {bestOpportunity && (
                                <div className="impact-section__summary">
                                    <strong>💡 Insight:</strong> {bestOpportunity.name || "Your lowest-graded high-credit course"} has
                                    the most leverage. Focus here for maximum GPA improvement.
                                </div>
                            )}

                            <div className="impact-section__chart">
                                <ResponsiveContainer width="100%" height={Math.max(150, chartData.length * 40)}>
                                    <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20 }}>
                                        <XAxis type="number" domain={[0, "auto"]} tick={{ fontSize: 12 }} />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            tick={{ fontSize: 12 }}
                                            width={75}
                                        />
                                        <Tooltip
                                            formatter={(value) => [Number(value).toFixed(3), "Impact"]}
                                            contentStyle={{
                                                background: "white",
                                                border: "1px solid var(--color-border)",
                                                borderRadius: "var(--radius-md)",
                                            }}
                                        />
                                        <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="impact-section__legend">
                                <div className="impact-section__legend-item">
                                    <span className="impact-section__legend-dot impact-section__legend-dot--high"></span>
                                    <span>High leverage — focus here</span>
                                </div>
                                <div className="impact-section__legend-item">
                                    <span className="impact-section__legend-dot impact-section__legend-dot--medium"></span>
                                    <span>Moderate impact</span>
                                </div>
                                <div className="impact-section__legend-item">
                                    <span className="impact-section__legend-dot impact-section__legend-dot--low"></span>
                                    <span>Low priority</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Course List */}
                    <div className="course-list">
                        <div className="course-list__header">
                            <h2 className="course-list__title">Courses</h2>
                            <div className="course-list__actions">
                                <button onClick={addCourse} className="btn btn--primary btn--sm">
                                    + Add Course
                                </button>
                                <button onClick={clearAll} className="btn btn--destructive btn--sm">
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="course-list__grid">
                            {courses.map((course, idx) => {
                                const gradePoints = GRADE_POINTS[course.grade] ?? 0;
                                const tier = getImpactTier({ credits: course.credits, gradePoints });

                                return (
                                    <div key={course.id} className={`course-card course-card--${tier}`}>
                                        <div className="course-card__indicator"></div>
                                        <div className="course-card__content">
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder={`Course ${idx + 1}`}
                                                value={course.name}
                                                onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                                            />
                                            <select
                                                className="input select"
                                                value={course.credits}
                                                onChange={(e) =>
                                                    updateCourse(course.id, "credits", parseInt(e.target.value))
                                                }
                                            >
                                                {CREDITS.map((c) => (
                                                    <option key={c} value={c}>
                                                        {c} credit{c > 1 ? "s" : ""}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                className="input select"
                                                value={course.grade}
                                                onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                                            >
                                                {GRADES.map((g) => (
                                                    <option key={g} value={g}>
                                                        {g}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => removeCourse(course.id)}
                                            className="course-card__delete"
                                            aria-label="Remove course"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                </div>

                {/* Explanation */}
                <details className="explanation-section">
                    <summary>How GPA is Calculated</summary>
                    <div className="explanation-section__content">
                        <p>
                            Your GPA (Grade Point Average) is calculated using the formula:
                            <strong> GPA = Total Quality Points ÷ Total Credits</strong>
                        </p>
                        <h3>Quality Points</h3>
                        <p>
                            Each course contributes quality points = Grade Points × Credit Hours.
                            For example, an A (4.0) in a 3-credit course = 12 quality points.
                        </p>
                        <h3>Grade Scale</h3>
                        <p>
                            A/A+ = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3,
                            C = 2.0, C- = 1.7, D+ = 1.3, D = 1.0, D- = 0.7, F = 0.0
                        </p>
                        <h3>Impact Analysis</h3>
                        <p>
                            High-credit courses with below-A grades have the most "leverage" —
                            improving them yields the biggest GPA boost. Green bars indicate
                            where to focus your effort.
                        </p>
                    </div>
                </details>

                {/* FAQ */}
                <section className="faq-section">
                    <h2 className="faq-section__title">Frequently Asked Questions</h2>
                    <div className="faq-list">
                        <details className="faq-item">
                            <summary className="faq-item__question">
                                What is a good GPA?
                                <span className="faq-item__icon">+</span>
                            </summary>
                            <div className="faq-item__answer">
                                For college admissions: 3.5+ is competitive for most universities,
                                3.7+ for selective schools, and 3.9+ for Ivy League. For graduate
                                school, aim for 3.0+ minimum, with 3.5+ preferred.
                            </div>
                        </details>
                        <details className="faq-item">
                            <summary className="faq-item__question">
                                How can I improve my GPA quickly?
                                <span className="faq-item__icon">+</span>
                            </summary>
                            <div className="faq-item__answer">
                                Focus on high-credit courses where you have room for improvement.
                                A B→A jump in a 4-credit course has more impact than an A in a
                                1-credit elective. Use the impact chart above to identify your
                                highest-leverage opportunities.
                            </div>
                        </details>
                        <details className="faq-item">
                            <summary className="faq-item__question">
                                Is my data saved?
                                <span className="faq-item__icon">+</span>
                            </summary>
                            <div className="faq-item__answer">
                                Yes! Your courses are automatically saved in your browser's local
                                storage. When you return, your data will be restored. No account
                                or signup required — your data never leaves your device.
                            </div>
                        </details>
                    </div>
                </section>

                {/* Deep SEO Content */}
                <section className="seo-content">
                    <h2>What is GPA and How is it Calculated?</h2>
                    <p>
                        GPA (Grade Point Average) is a standardized measure of academic achievement used by virtually all US high schools and colleges.
                        It converts your letter grades into a numerical scale, weighted by the number of credit hours each course is worth.
                        Most institutions use a 4.0 scale, where an A equals 4.0 points, a B equals 3.0, a C equals 2.0, a D equals 1.0, and an F equals 0.0.
                    </p>
                    <p>
                        The formula is straightforward: <strong>GPA = Total Quality Points ÷ Total Credit Hours</strong>.
                        Quality points are calculated by multiplying the grade points by the credit hours for each course.
                    </p>

                    <h3>Worked Example: Calculating Your Semester GPA</h3>
                    <p>Let's say you completed these courses this semester:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Credits</th>
                                    <th>Grade</th>
                                    <th>Grade Points</th>
                                    <th>Quality Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>English 101</td>
                                    <td>3</td>
                                    <td>A (4.0)</td>
                                    <td>4.0</td>
                                    <td>12.0</td>
                                </tr>
                                <tr>
                                    <td>Calculus I</td>
                                    <td>4</td>
                                    <td>B+ (3.3)</td>
                                    <td>3.3</td>
                                    <td>13.2</td>
                                </tr>
                                <tr>
                                    <td>Biology</td>
                                    <td>4</td>
                                    <td>B (3.0)</td>
                                    <td>3.0</td>
                                    <td>12.0</td>
                                </tr>
                                <tr>
                                    <td>History</td>
                                    <td>3</td>
                                    <td>A- (3.7)</td>
                                    <td>3.7</td>
                                    <td>11.1</td>
                                </tr>
                                <tr className="seo-content__table-total">
                                    <td><strong>Total</strong></td>
                                    <td><strong>14</strong></td>
                                    <td>—</td>
                                    <td>—</td>
                                    <td><strong>48.3</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        <strong>Your GPA = 48.3 ÷ 14 = 3.45</strong>
                    </p>
                    <p>
                        Notice how the 4-credit courses (Calculus and Biology) have more impact than the 3-credit courses.
                        If you improved your Calculus grade from B+ to A, your GPA would jump to 3.65 — a significant increase.
                    </p>

                    <h3>What is a Good GPA? Benchmarks by Goal</h3>
                    <p>Your "target GPA" depends on what you're trying to achieve:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Goal</th>
                                    <th>Minimum GPA</th>
                                    <th>Competitive GPA</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Graduate high school</td>
                                    <td>2.0</td>
                                    <td>N/A</td>
                                </tr>
                                <tr>
                                    <td>State university admission</td>
                                    <td>2.5–3.0</td>
                                    <td>3.3+</td>
                                </tr>
                                <tr>
                                    <td>Competitive universities</td>
                                    <td>3.5</td>
                                    <td>3.8+</td>
                                </tr>
                                <tr>
                                    <td>Ivy League / Top 20</td>
                                    <td>3.7</td>
                                    <td>3.9+</td>
                                </tr>
                                <tr>
                                    <td>Merit scholarships</td>
                                    <td>3.0–3.5</td>
                                    <td>3.7+</td>
                                </tr>
                                <tr>
                                    <td>Dean's List</td>
                                    <td>3.5–3.7</td>
                                    <td>—</td>
                                </tr>
                                <tr>
                                    <td>Academic probation (avoid)</td>
                                    <td>Stay above 2.0</td>
                                    <td>—</td>
                                </tr>
                                <tr>
                                    <td>Graduate school</td>
                                    <td>3.0</td>
                                    <td>3.5+</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>If You Want X, Do Y: GPA Planning Strategies</h3>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>🎯 "I want to raise my GPA from 3.0 to 3.5"</h4>
                            <p>
                                The more credits you've already completed, the harder this becomes.
                                If you have 60 credits at 3.0, you'd need to earn straight A's (4.0) for the next 60 credits.
                                More realistic: aim for 3.7+ in future semesters and focus on high-credit courses.
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🎯 "I'm on academic probation (below 2.0)"</h4>
                            <p>
                                Focus on fewer courses, use tutoring resources, and consider retaking failed courses if your school allows grade replacement.
                                A single F in a 4-credit course can drop your GPA by 0.3–0.5 points.
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🎯 "I want Dean's List (3.5+)"</h4>
                            <p>
                                You need at least 3.5, with most schools requiring full-time enrollment.
                                Avoid any grade below B+ if possible. One C in a 4-credit course can pull you below the threshold.
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🎯 "I'm applying to grad school"</h4>
                            <p>
                                Most programs want 3.0+, but competitive programs expect 3.5+.
                                Focus on your major GPA — many programs weight this more heavily than cumulative GPA.
                            </p>
                        </div>
                    </div>

                    <h3>Why Credit Hours Matter More Than You Think</h3>
                    <p>
                        Not all grades are created equal. A grade in a 4-credit course affects your GPA twice as much as the same grade in a 2-credit course.
                        This is why our calculator includes "Impact Analysis" — it shows you which courses have the most leverage.
                    </p>
                    <p>
                        <strong>Pro tip:</strong> If you're struggling in a high-credit course, getting a tutor or spending extra study time
                        will have a bigger payoff than the same effort in a low-credit elective.
                    </p>

                    <h3>Next Steps: Planning Your Academic Path</h3>
                    <p>
                        After calculating your current GPA, use our <a href="/gpa">GPA Workspace</a> to set targets with Aim Mode.
                        It will show you exactly what grades you need in upcoming courses to hit your goal.
                    </p>
                </section>

                {/* Related Tools */}
                <RelatedTools currentPath="/gpa-calculators/gpa-calculator" />
            </div>
        </div>
    );
}
