"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import RelatedTools from "@/components/RelatedTools";

const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });

interface Category {
    id: string;
    name: string;
    weight: number;
    score: number;
}

const STORAGE_KEY = "gradepilot_final_grade";

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#f59e0b", "#ef4444", "#ec4899"];

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function getDefaultCategories(): Category[] {
    return [
        { id: generateId(), name: "Homework", weight: 20, score: 0 },
        { id: generateId(), name: "Quizzes", weight: 20, score: 0 },
        { id: generateId(), name: "Midterm", weight: 25, score: 0 },
        { id: generateId(), name: "Final Exam", weight: 35, score: 0 },
    ];
}

function getLetterGrade(percentage: number): string {
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 63) return "D";
    if (percentage >= 60) return "D-";
    return "F";
}

export default function FinalGradeCalculator() {
    const [mounted, setMounted] = useState(false);
    const [categories, setCategories] = useState<Category[]>(getDefaultCategories);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) setCategories(parsed);
            } catch { /* use defaults */ }
        }
    }, []);

    useEffect(() => {
        if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    }, [categories, mounted]);

    const calculations = useMemo(() => {
        const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
        let weightedScore = 0;

        categories.forEach((cat) => {
            weightedScore += (cat.score * cat.weight) / 100;
        });

        const percentage = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
        const letterGrade = getLetterGrade(percentage);

        // Find highest leverage category (highest weight, lowest score relative to potential)
        const highestLeverage = categories
            .filter((c) => c.score < 100)
            .sort((a, b) => b.weight - a.weight)[0];

        return { percentage, letterGrade, totalWeight, highestLeverage };
    }, [categories]);

    const chartData = categories.map((cat, idx) => ({
        name: cat.name,
        value: cat.weight,
        color: COLORS[idx % COLORS.length],
    }));

    const getGradeStatus = (letter: string) => {
        if (["A", "A-"].includes(letter)) return "excellent";
        if (["B+", "B", "B-"].includes(letter)) return "good";
        if (["C+", "C", "C-"].includes(letter)) return "warning";
        return "danger";
    };

    const status = getGradeStatus(calculations.letterGrade);

    const updateCategory = (id: string, field: keyof Category, value: string | number) => {
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
        );
    };

    const addCategory = () => {
        setCategories((prev) => [...prev, { id: generateId(), name: "", weight: 10, score: 0 }]);
    };

    const removeCategory = (id: string) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/grade-calculators">Grade Calculators</a> / Final Grade
                    </nav>
                    <h1 className="dashboard__title">Final Grade Calculator</h1>
                    <p className="dashboard__subtitle">
                        Calculate your weighted course average based on category weights
                    </p>
                </div>

                <div className="dashboard__workspace">
                    {/* Dual Snapshot */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                        <div className={`gpa-snapshot gpa-snapshot--${status}`} style={{ padding: "var(--space-5)" }}>
                            <div className="gpa-snapshot__number" style={{ fontSize: "var(--text-5xl)" }}>
                                {mounted ? calculations.percentage.toFixed(1) : "0.0"}%
                            </div>
                            <div className="gpa-snapshot__label">Current Grade</div>
                            {calculations.highestLeverage && (
                                <div className="gpa-snapshot__insight">
                                    {calculations.highestLeverage.name} ({calculations.highestLeverage.weight}%) has the most impact
                                </div>
                            )}
                        </div>
                        <div className="card card--elevated" style={{ textAlign: "center", padding: "var(--space-5)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div style={{ fontSize: "var(--text-6xl)", fontWeight: 800, color: "var(--color-primary)" }}>
                                {calculations.letterGrade}
                            </div>
                            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Letter Grade
                            </div>
                            {calculations.totalWeight !== 100 && (
                                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-warning)", marginTop: "var(--space-2)" }}>
                                    ⚠️ Weights total {calculations.totalWeight}% (should be 100%)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weight Distribution Chart */}
                    {mounted && (
                        <div className="impact-section">
                            <h2 className="impact-section__title">Weight Distribution</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "var(--space-4)", alignItems: "center" }}>
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                        >
                                            {chartData.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v) => [`${v}%`, "Weight"]} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                                    {categories.map((cat, idx) => (
                                        <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)" }}>
                                            <span style={{ width: 12, height: 12, borderRadius: 2, background: COLORS[idx % COLORS.length] }}></span>
                                            <span style={{ flex: 1 }}>{cat.name || `Category ${idx + 1}`}</span>
                                            <span style={{ color: "var(--color-text-muted)" }}>{cat.weight}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Categories Input */}
                    <div className="course-list">
                        <div className="course-list__header">
                            <h2 className="course-list__title">Grade Categories</h2>
                            <div className="course-list__actions">
                                <button onClick={addCategory} className="btn btn--primary btn--sm">+ Add</button>
                            </div>
                        </div>

                        <div className="course-list__grid">
                            {categories.map((cat, idx) => (
                                <div key={cat.id} className="course-card">
                                    <div className="course-card__indicator" style={{ background: COLORS[idx % COLORS.length] }}></div>
                                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "var(--space-2)", alignItems: "center" }}>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder={`Category ${idx + 1}`}
                                            value={cat.name}
                                            onChange={(e) => updateCategory(cat.id, "name", e.target.value)}
                                        />
                                        <div className="input-group">
                                            <label className="input-group__label">Weight %</label>
                                            <input
                                                type="number"
                                                className="input"
                                                min={0}
                                                max={100}
                                                value={cat.weight}
                                                onChange={(e) => updateCategory(cat.id, "weight", parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-group__label">Score %</label>
                                            <input
                                                type="number"
                                                className="input"
                                                min={0}
                                                max={100}
                                                value={cat.score}
                                                onChange={(e) => updateCategory(cat.id, "score", parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                    <button onClick={() => removeCategory(cat.id)} className="course-card__delete">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <details className="explanation-section">
                    <summary>How Final Grades are Calculated</summary>
                    <div className="explanation-section__content">
                        <p>Your final grade is calculated using weighted averages:</p>
                        <p style={{ marginTop: "var(--space-2)" }}>
                            <strong>Final Grade = Σ(Category Score × Category Weight) ÷ Total Weight</strong>
                        </p>
                        <p style={{ marginTop: "var(--space-3)" }}>
                            For example: If Homework (20%) = 85% and Exams (80%) = 75%, your final grade is:
                            (85×0.2) + (75×0.8) = 17 + 60 = 77%
                        </p>
                    </div>
                </details>

                {/* Deep SEO Content */}
                <section className="seo-content">
                    <h2>How to Calculate Your Final Course Grade</h2>
                    <p>
                        Most courses use a weighted grading system where different assignments count for different percentages of your final grade.
                        Understanding how this works is crucial for strategic studying — you should focus your effort where it matters most.
                    </p>
                    <p>
                        Our Final Grade Calculator takes all your assignment categories (homework, quizzes, exams, projects, etc.)
                        and calculates your current weighted average. It also shows you which categories have the most impact on your grade.
                    </p>

                    <h3>Worked Example: Calculating a Weighted Average</h3>
                    <p>Let&apos;s calculate the final grade for a typical college course:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Weight</th>
                                    <th>Your Score</th>
                                    <th>Contribution</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Homework</td>
                                    <td>15%</td>
                                    <td>92%</td>
                                    <td>13.8</td>
                                </tr>
                                <tr>
                                    <td>Quizzes</td>
                                    <td>15%</td>
                                    <td>85%</td>
                                    <td>12.75</td>
                                </tr>
                                <tr>
                                    <td>Midterm</td>
                                    <td>25%</td>
                                    <td>78%</td>
                                    <td>19.5</td>
                                </tr>
                                <tr>
                                    <td>Final Exam</td>
                                    <td>30%</td>
                                    <td>82%</td>
                                    <td>24.6</td>
                                </tr>
                                <tr>
                                    <td>Participation</td>
                                    <td>15%</td>
                                    <td>95%</td>
                                    <td>14.25</td>
                                </tr>
                                <tr className="seo-content__table-total">
                                    <td><strong>Total</strong></td>
                                    <td><strong>100%</strong></td>
                                    <td>—</td>
                                    <td><strong>84.9%</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        Your final grade is <strong>84.9%</strong>, which is a <strong>B</strong>.
                        Notice that the Final Exam (30%) contributes almost twice as much as Homework (15%) to your grade.
                    </p>

                    <h3>Common Grading Weight Distributions</h3>
                    <p>Here are typical weight distributions for different types of courses:</p>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>📚 Lecture-Based Course</h4>
                            <p>
                                Midterm: 25-30%<br />
                                Final: 30-40%<br />
                                Homework: 15-20%<br />
                                Quizzes: 10-15%
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🔬 Lab-Based Course</h4>
                            <p>
                                Lab Reports: 30-40%<br />
                                Midterm: 20-25%<br />
                                Final: 25-30%<br />
                                Participation: 10%
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>📝 Writing-Intensive Course</h4>
                            <p>
                                Essays/Papers: 40-50%<br />
                                Participation: 15-20%<br />
                                Final Project: 20-30%<br />
                                Short Assignments: 10%
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>💻 Project-Based Course</h4>
                            <p>
                                Final Project: 30-40%<br />
                                Weekly Assignments: 30%<br />
                                Midterm: 15-20%<br />
                                Participation: 10%
                            </p>
                        </div>
                    </div>

                    <h3>Strategic Studying: Where to Focus</h3>
                    <p>
                        Not all assignments are created equal. Use these principles to maximize your grade efficiency:
                    </p>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li><strong>High-weight, low-score:</strong> These are your biggest opportunities. A 10-point improvement on a 30% exam adds 3 points to your final grade.</li>
                        <li><strong>Easy points:</strong> Participation, homework completion, and attendance are often easy 100s. Don&apos;t throw these away.</li>
                        <li><strong>Diminishing returns:</strong> Going from 95% to 100% on homework (5% weight) only adds 0.25 points. Focus elsewhere.</li>
                    </ul>

                    <h3>What If My Weights Don&apos;t Add to 100%?</h3>
                    <p>
                        If your syllabus weights don&apos;t add to 100%, check if some categories are &quot;optional&quot; or &quot;replace lowest grade.&quot;
                        Our calculator will still work — it calculates your weighted average based on whatever weights you enter.
                    </p>

                    <h3>Next Steps</h3>
                    <p>
                        Now that you know your current grade, use our <a href="/grade-calculators/required-final-grade-calculator">Required Final Grade Calculator</a>
                        to find out exactly what score you need on upcoming exams to reach your target.
                        Or visit the <a href="/gpa">GPA Workspace</a> to see how this course affects your overall GPA.
                    </p>
                </section>

                {/* Related Tools */}
                <RelatedTools currentPath="/grade-calculators/final-grade-calculator" />
            </div>
        </div>
    );
}
