"use client";

import { useState, useMemo } from "react";

interface Category {
    name: string;
    weight: string;
    score: string;
}

// 4 fixed category slots
const INITIAL_CATEGORIES: Category[] = [
    { name: "Homework", weight: "20", score: "" },
    { name: "Quizzes", weight: "20", score: "" },
    { name: "Midterm", weight: "25", score: "" },
    { name: "Final Exam", weight: "35", score: "" },
];

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
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

    const result = useMemo(() => {
        const validCategories = categories.filter(
            (c) => c.weight !== "" && c.score !== "" && parseFloat(c.weight) > 0
        );
        if (validCategories.length === 0) return null;

        let totalWeight = 0;
        let weightedScore = 0;

        validCategories.forEach((cat) => {
            const weight = parseFloat(cat.weight);
            const score = parseFloat(cat.score);
            if (!isNaN(weight) && !isNaN(score)) {
                totalWeight += weight;
                weightedScore += (score * weight) / 100;
            }
        });

        const percentage = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
        const letterGrade = getLetterGrade(percentage);

        return { percentage, letterGrade, totalWeight };
    }, [categories]);

    const getGradeStatus = (letter: string) => {
        if (["A", "A-"].includes(letter)) return "excellent";
        if (["B+", "B", "B-"].includes(letter)) return "good";
        if (["C+", "C", "C-"].includes(letter)) return "warning";
        return "danger";
    };

    const updateCategory = (index: number, field: keyof Category, value: string) => {
        setCategories((prev) =>
            prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
        );
    };

    const resetAll = () => setCategories(INITIAL_CATEGORIES);

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/grade-calculators">Grade Calculators</a> / Final Grade
                    </nav>
                    <h1 className="dashboard__title">Final Grade Calculator</h1>
                    <p className="dashboard__subtitle">
                        Calculate your weighted course grade based on category scores
                    </p>
                </div>

                <div className="dashboard__workspace">
                    {/* Input Form */}
                    <div className="card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-6)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ margin: 0 }}>Grade Categories</h2>
                            <button
                                onClick={resetAll}
                                style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: "var(--text-sm)" }}
                            >
                                Reset
                            </button>
                        </div>

                        <div style={{ display: "grid", gap: "var(--space-3)" }}>
                            {categories.map((cat, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 80px 80px",
                                        gap: "var(--space-3)",
                                        alignItems: "center"
                                    }}
                                >
                                    <input
                                        type="text"
                                        className="input"
                                        value={cat.name}
                                        onChange={(e) => updateCategory(index, "name", e.target.value)}
                                        placeholder="Category name"
                                        style={{ padding: "var(--space-2)" }}
                                    />
                                    <input
                                        type="number"
                                        className="input"
                                        value={cat.weight}
                                        onChange={(e) => updateCategory(index, "weight", e.target.value)}
                                        placeholder="Weight"
                                        min="0"
                                        max="100"
                                        style={{ padding: "var(--space-2)", textAlign: "center" }}
                                    />
                                    <input
                                        type="number"
                                        className="input"
                                        value={cat.score}
                                        onChange={(e) => updateCategory(index, "score", e.target.value)}
                                        placeholder="Score"
                                        min="0"
                                        max="100"
                                        style={{ padding: "var(--space-2)", textAlign: "center" }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
                            <span></span>
                            <span>Weight (%)</span>
                            <span>Score (%)</span>
                        </div>

                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-4)" }}>
                            Enter your category weights and scores. Empty rows are ignored.
                        </p>
                    </div>

                    {/* Result */}
                    {result ? (
                        <div className={`gpa-snapshot gpa-snapshot--${getGradeStatus(result.letterGrade)}`}>
                            <div className="gpa-snapshot__number">
                                {result.percentage.toFixed(1)}%
                            </div>
                            <div className="gpa-snapshot__label">Final Grade</div>
                            <div className="gpa-snapshot__badge">
                                {result.letterGrade}
                            </div>
                            <div className="gpa-snapshot__meta">
                                <div className="gpa-snapshot__meta-item">
                                    <span className="gpa-snapshot__meta-value">{result.totalWeight}%</span>
                                    <span>Weight Used</span>
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
                                Enter scores above to calculate your final grade
                            </p>
                        </div>
                    )}

                    {/* CTA */}
                    {result && (
                        <div style={{
                            marginTop: "var(--space-6)",
                            padding: "var(--space-5)",
                            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                            borderRadius: "var(--radius-lg)",
                            textAlign: "center"
                        }}>
                            <p style={{ color: "white", marginBottom: "var(--space-3)", fontSize: "var(--text-lg)" }}>
                                <strong>This shows where you stand now.</strong>
                            </p>
                            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "var(--space-4)" }}>
                                To see how individual assignments affect your grade and plan improvements:
                            </p>
                            <a
                                href="/course"
                                style={{
                                    display: "inline-block",
                                    background: "white",
                                    color: "#ea580c",
                                    padding: "var(--space-3) var(--space-6)",
                                    borderRadius: "var(--radius-md)",
                                    fontWeight: 600,
                                    textDecoration: "none"
                                }}
                            >
                                Open Course Analyzer →
                            </a>
                        </div>
                    )}
                </div>

                {/* SEO Content */}
                <section className="seo-content">
                    <h2>How to Calculate Your Final Grade</h2>
                    <p>
                        Your final grade is a weighted average of all grade categories in your course.
                        Each category (homework, quizzes, exams) contributes based on its weight.
                    </p>

                    <h3>The Weighted Average Formula</h3>
                    <p>
                        <strong>Final Grade = (Score₁ × Weight₁ + Score₂ × Weight₂ + ...) ÷ Total Weight</strong>
                    </p>

                    <h3>Worked Example</h3>
                    <p>A course with 4 grade categories:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Weight</th>
                                    <th>Score</th>
                                    <th>Contribution</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Homework</td><td>20%</td><td>95%</td><td>19.0</td></tr>
                                <tr><td>Quizzes</td><td>20%</td><td>88%</td><td>17.6</td></tr>
                                <tr><td>Midterm</td><td>25%</td><td>82%</td><td>20.5</td></tr>
                                <tr><td>Final Exam</td><td>35%</td><td>78%</td><td>27.3</td></tr>
                                <tr className="seo-content__table-total">
                                    <td><strong>Total</strong></td>
                                    <td><strong>100%</strong></td>
                                    <td>—</td>
                                    <td><strong>84.4%</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        Final Grade = 84.4% = <strong>B</strong>
                    </p>

                    <h3>Why Some Categories Matter More</h3>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>📊 High-Weight Categories</h4>
                            <p>A 35% final exam matters nearly twice as much as 20% homework. Focus your study time accordingly.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>💡 Easy Points First</h4>
                            <p>Homework and participation are often easy 100s. Don&apos;t throw away these free points.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>⚠️ Exam Recovery</h4>
                            <p>A bad midterm (25%) can be offset by a strong final (35%), but only if you improve significantly.</p>
                        </div>
                    </div>

                    <h3>Letter Grade Scale</h3>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr><th>Percentage</th><th>Letter</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>93-100%</td><td>A</td></tr>
                                <tr><td>90-92%</td><td>A-</td></tr>
                                <tr><td>87-89%</td><td>B+</td></tr>
                                <tr><td>83-86%</td><td>B</td></tr>
                                <tr><td>80-82%</td><td>B-</td></tr>
                                <tr><td>77-79%</td><td>C+</td></tr>
                                <tr><td>73-76%</td><td>C</td></tr>
                                <tr><td>70-72%</td><td>C-</td></tr>
                                <tr><td>60-69%</td><td>D</td></tr>
                                <tr><td>Below 60%</td><td>F</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Related Tools */}
                <section style={{ marginTop: "var(--space-8)" }}>
                    <h3 style={{ marginBottom: "var(--space-4)" }}>Related Calculators</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}>
                        <a href="/grade-calculators/required-final-grade-calculator" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>Required Grade Calculator</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                What do you need on your final?
                            </p>
                        </a>
                        <a href="/course" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>Course Analyzer</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Deep dive into your course grade
                            </p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
