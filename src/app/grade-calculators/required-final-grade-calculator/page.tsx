"use client";

import { useState, useMemo } from "react";

export default function RequiredFinalGradeCalculator() {
    const [currentGrade, setCurrentGrade] = useState("");
    const [targetGrade, setTargetGrade] = useState("");
    const [finalWeight, setFinalWeight] = useState("");

    const result = useMemo(() => {
        const current = parseFloat(currentGrade);
        const target = parseFloat(targetGrade);
        const weight = parseFloat(finalWeight);

        if (isNaN(current) || isNaN(target) || isNaN(weight) || weight <= 0) return null;

        // Formula: Required = (Target - Current * (1 - Weight/100)) / (Weight/100)
        const currentWeight = 100 - weight;
        const requiredScore = (target - (current * currentWeight / 100)) / (weight / 100);

        // Difficulty assessment
        let difficulty: string;
        let status: string;

        if (requiredScore <= 60) {
            difficulty = "Very Achievable";
            status = "excellent";
        } else if (requiredScore <= 80) {
            difficulty = "Achievable";
            status = "good";
        } else if (requiredScore <= 100) {
            difficulty = "Challenging";
            status = "warning";
        } else {
            difficulty = "Impossible";
            status = "danger";
        }

        return { requiredScore, difficulty, status };
    }, [currentGrade, targetGrade, finalWeight]);

    const resetAll = () => {
        setCurrentGrade("");
        setTargetGrade("");
        setFinalWeight("");
    };

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/grade-calculators">Grade Calculators</a> / Required Grade
                    </nav>
                    <h1 className="dashboard__title">Required Final Grade Calculator</h1>
                    <p className="dashboard__subtitle">
                        Find out what you need on your final exam to reach your target grade
                    </p>
                </div>

                <div className="dashboard__workspace">
                    {/* Input Form */}
                    <div className="card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-6)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                            <h2 style={{ margin: 0 }}>Your Situation</h2>
                            <button
                                onClick={resetAll}
                                style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: "var(--text-sm)" }}
                            >
                                Reset
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>
                                    Current Grade (%)
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="e.g. 78"
                                    value={currentGrade}
                                    onChange={(e) => setCurrentGrade(e.target.value)}
                                    min="0"
                                    max="100"
                                    style={{ padding: "var(--space-3)", fontSize: "var(--text-lg)", textAlign: "center" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>
                                    Target Grade (%)
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="e.g. 83"
                                    value={targetGrade}
                                    onChange={(e) => setTargetGrade(e.target.value)}
                                    min="0"
                                    max="100"
                                    style={{ padding: "var(--space-3)", fontSize: "var(--text-lg)", textAlign: "center" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>
                                    Final Exam Weight (%)
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="e.g. 30"
                                    value={finalWeight}
                                    onChange={(e) => setFinalWeight(e.target.value)}
                                    min="1"
                                    max="100"
                                    style={{ padding: "var(--space-3)", fontSize: "var(--text-lg)", textAlign: "center" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    {result ? (
                        <div className={`gpa-snapshot gpa-snapshot--${result.status}`}>
                            <div className="gpa-snapshot__number">
                                {result.requiredScore > 100 ? ">100" : result.requiredScore < 0 ? "0" : result.requiredScore.toFixed(1)}%
                            </div>
                            <div className="gpa-snapshot__label">Required on Final</div>
                            <div className="gpa-snapshot__badge">
                                {result.difficulty}
                            </div>
                            {result.requiredScore > 100 && (
                                <p style={{ marginTop: "var(--space-3)", fontSize: "var(--text-sm)", opacity: 0.9 }}>
                                    Even a perfect 100% won&apos;t be enough to reach your target.
                                </p>
                            )}
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
                                Enter your grades above to see what you need on the final
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
                                <strong>This considers only your final exam.</strong>
                            </p>
                            <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "var(--space-4)" }}>
                                To see your full grade breakdown and plan every assignment:
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
                                Analyze Full Course →
                            </a>
                        </div>
                    )}
                </div>

                {/* SEO Content */}
                <section className="seo-content">
                    <h2>How to Calculate Required Final Exam Score</h2>
                    <p>
                        This calculator uses a simple formula to determine what score you need on your final exam
                        to achieve your desired course grade.
                    </p>

                    <h3>The Formula</h3>
                    <p>
                        <strong>Required Score = (Target Grade - Current Grade × (1 - Final Weight)) ÷ Final Weight</strong>
                    </p>

                    <h3>Worked Example</h3>
                    <p>You have:</p>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li>Current grade: <strong>78%</strong></li>
                        <li>Target grade: <strong>83% (B)</strong></li>
                        <li>Final exam weight: <strong>30%</strong></li>
                    </ul>
                    <p>
                        Required = (83 - 78 × 0.70) ÷ 0.30<br />
                        Required = (83 - 54.6) ÷ 0.30<br />
                        Required = 28.4 ÷ 0.30<br />
                        Required = <strong>94.7%</strong>
                    </p>
                    <p>
                        You need a 95% on your final to get a B in the class.
                    </p>

                    <h3>What If It&apos;s Over 100%?</h3>
                    <p>
                        If the calculator shows you need more than 100%, your target grade isn&apos;t mathematically achievable
                        with your final exam alone. Consider:
                    </p>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li>Checking if extra credit is available</li>
                        <li>Asking about grade replacement policies</li>
                        <li>Setting a more realistic target grade</li>
                    </ul>

                    <h3>Difficulty Ratings Explained</h3>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>✅ Very Achievable (≤60%)</h4>
                            <p>You&apos;re in great shape. Even a below-average performance will get you there.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🟢 Achievable (61-80%)</h4>
                            <p>Solid studying should get you there. A B-level performance on the final.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🟡 Challenging (81-100%)</h4>
                            <p>You need an excellent performance. Time for serious studying.</p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🔴 Impossible (&gt;100%)</h4>
                            <p>Mathematically not possible. Consider adjusting your target.</p>
                        </div>
                    </div>
                </section>

                {/* Related Tools */}
                <section style={{ marginTop: "var(--space-8)" }}>
                    <h3 style={{ marginBottom: "var(--space-4)" }}>Related Calculators</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}>
                        <a href="/grade-calculators/final-grade-calculator" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>Final Grade Calculator</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Calculate your overall course grade
                            </p>
                        </a>
                        <a href="/course" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>Course Analyzer</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Deep dive into your full course
                            </p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
