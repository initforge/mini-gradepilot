"use client";

import { useState, useEffect, useMemo } from "react";

const STORAGE_KEY = "gradepilot_required_grade";

interface SavedData {
    currentGrade: number;
    targetGrade: number;
    finalWeight: number;
}

export default function RequiredFinalGradeCalculator() {
    const [mounted, setMounted] = useState(false);
    const [currentGrade, setCurrentGrade] = useState(75);
    const [targetGrade, setTargetGrade] = useState(80);
    const [finalWeight, setFinalWeight] = useState(30);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed: SavedData = JSON.parse(saved);
                setCurrentGrade(parsed.currentGrade ?? 75);
                setTargetGrade(parsed.targetGrade ?? 80);
                setFinalWeight(parsed.finalWeight ?? 30);
            } catch { /* use defaults */ }
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentGrade, targetGrade, finalWeight }));
        }
    }, [currentGrade, targetGrade, finalWeight, mounted]);

    const calculations = useMemo(() => {
        // Formula: Required = (Target - Current * (1 - Weight/100)) / (Weight/100)
        const currentWeight = 100 - finalWeight;
        const requiredScore = (targetGrade - (currentGrade * currentWeight / 100)) / (finalWeight / 100);

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
            difficulty = "Unrealistic";
            status = "danger";
        }

        // What-if scenarios
        const scenarios = [100, 95, 90, 85, 80, 75, 70].map((score) => {
            const finalGrade = (currentGrade * currentWeight / 100) + (score * finalWeight / 100);
            return { score, finalGrade: finalGrade.toFixed(1) };
        });

        return { requiredScore, difficulty, status, scenarios };
    }, [currentGrade, targetGrade, finalWeight]);

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
                    {/* Inputs First (Exception) */}
                    <div className="card card--elevated" style={{ padding: "var(--space-5)" }}>
                        <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>Your Situation</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)" }}>
                            <div className="input-group">
                                <label className="input-group__label">Current Grade (%)</label>
                                <input
                                    type="number"
                                    className="input"
                                    min={0}
                                    max={100}
                                    value={currentGrade}
                                    onChange={(e) => setCurrentGrade(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-group__label">Target Grade (%)</label>
                                <input
                                    type="number"
                                    className="input"
                                    min={0}
                                    max={100}
                                    value={targetGrade}
                                    onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-group__label">Final Exam Weight (%)</label>
                                <input
                                    type="number"
                                    className="input"
                                    min={1}
                                    max={100}
                                    value={finalWeight}
                                    onChange={(e) => setFinalWeight(parseFloat(e.target.value) || 1)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Required Score Snapshot */}
                    <div className={`gpa-snapshot gpa-snapshot--${calculations.status}`}>
                        <div className="gpa-snapshot__number">
                            {mounted ? (calculations.requiredScore > 0 ? calculations.requiredScore.toFixed(1) : "0") : "0"}%
                        </div>
                        <div className="gpa-snapshot__label">Required Score on Final</div>
                        <div className="gpa-snapshot__badge">{calculations.difficulty}</div>
                        {calculations.requiredScore > 100 && (
                            <div className="gpa-snapshot__insight">
                                ⚠️ You need more than 100% — consider adjusting your target grade
                            </div>
                        )}
                        {calculations.requiredScore < 0 && (
                            <div className="gpa-snapshot__insight">
                                🎉 You've already achieved your target! Any score will maintain it.
                            </div>
                        )}
                    </div>

                    {/* What-If Scenarios */}
                    <div className="impact-section">
                        <h2 className="impact-section__title">What-If Scenarios</h2>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }}>
                            See your final grade for different exam scores
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "var(--space-3)" }}>
                            {calculations.scenarios.map((scenario) => {
                                const isTarget = parseFloat(scenario.finalGrade) >= targetGrade;
                                return (
                                    <div
                                        key={scenario.score}
                                        className="card card--elevated"
                                        style={{
                                            textAlign: "center",
                                            padding: "var(--space-4)",
                                            borderColor: isTarget ? "var(--color-success)" : undefined,
                                            background: isTarget ? "var(--color-success-bg)" : undefined,
                                        }}
                                    >
                                        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                                            If you score
                                        </div>
                                        <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>
                                            {scenario.score}%
                                        </div>
                                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                            Final: {scenario.finalGrade}%
                                        </div>
                                        {isTarget && (
                                            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-success)", marginTop: "var(--space-1)" }}>
                                                ✓ Meets target
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Visual Breakdown */}
                    <div className="card" style={{ padding: "var(--space-4)" }}>
                        <h3 style={{ fontSize: "var(--text-base)", marginBottom: "var(--space-3)" }}>Grade Composition</h3>
                        <div style={{ display: "flex", height: 24, borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                            <div
                                style={{
                                    width: `${100 - finalWeight}%`,
                                    background: "var(--color-primary)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontSize: "var(--text-xs)",
                                    fontWeight: 600,
                                }}
                            >
                                Current: {currentGrade}%
                            </div>
                            <div
                                style={{
                                    width: `${finalWeight}%`,
                                    background: "var(--color-secondary)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontSize: "var(--text-xs)",
                                    fontWeight: 600,
                                }}
                            >
                                Final: {finalWeight}%
                            </div>
                        </div>
                    </div>
                </div>

                <details className="explanation-section">
                    <summary>How It&apos;s Calculated</summary>
                    <div className="explanation-section__content">
                        <p>The required score formula is:</p>
                        <p style={{ fontFamily: "monospace", background: "var(--color-bg-secondary)", padding: "var(--space-2)", borderRadius: "var(--radius-sm)", marginTop: "var(--space-2)" }}>
                            Required = (Target - Current × (1 - Final Weight)) ÷ Final Weight
                        </p>
                        <p style={{ marginTop: "var(--space-3)" }}>
                            Example: If your current grade is 75%, target is 80%, and final is 30%:
                            Required = (80 - 75 × 0.7) ÷ 0.3 = (80 - 52.5) ÷ 0.3 = 91.7%
                        </p>
                    </div>
                </details>

                {/* Deep SEO Content */}
                <section className="seo-content">
                    <h2>What Grade Do I Need on My Final?</h2>
                    <p>
                        This is one of the most common questions students ask, especially as finals week approaches.
                        The answer depends on three factors: your current grade in the class, your target grade, and how much the final exam is worth.
                    </p>
                    <p>
                        Our calculator uses the weighted average formula to determine exactly what score you need on your final exam
                        to achieve your desired grade. It also shows you what-if scenarios so you can see how different exam scores
                        would affect your final grade.
                    </p>

                    <h3>Worked Example: What Score Do I Need to Get a B?</h3>
                    <p>Let&apos;s say you have these grades going into finals:</p>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li><strong>Current Grade:</strong> 78% (C+)</li>
                        <li><strong>Target Grade:</strong> 80% (B-)</li>
                        <li><strong>Final Exam Weight:</strong> 25%</li>
                    </ul>
                    <p>Using the formula:</p>
                    <div style={{ fontFamily: "monospace", background: "var(--color-bg)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)" }}>
                        Required = (80 - 78 × 0.75) ÷ 0.25<br />
                        Required = (80 - 58.5) ÷ 0.25<br />
                        Required = 21.5 ÷ 0.25<br />
                        Required = <strong>86%</strong>
                    </div>
                    <p>
                        You need an <strong>86%</strong> on your final to raise your grade from a C+ to a B-.
                        That&apos;s challenging but achievable with focused studying.
                    </p>

                    <h3>Letter Grade Thresholds</h3>
                    <p>Here&apos;s the standard US grading scale for reference:</p>
                    <div className="seo-content__table-wrapper">
                        <table className="seo-content__table">
                            <thead>
                                <tr>
                                    <th>Letter Grade</th>
                                    <th>Percentage</th>
                                    <th>GPA Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>A</td><td>93-100%</td><td>4.0</td></tr>
                                <tr><td>A-</td><td>90-92%</td><td>3.7</td></tr>
                                <tr><td>B+</td><td>87-89%</td><td>3.3</td></tr>
                                <tr><td>B</td><td>83-86%</td><td>3.0</td></tr>
                                <tr><td>B-</td><td>80-82%</td><td>2.7</td></tr>
                                <tr><td>C+</td><td>77-79%</td><td>2.3</td></tr>
                                <tr><td>C</td><td>73-76%</td><td>2.0</td></tr>
                                <tr><td>C-</td><td>70-72%</td><td>1.7</td></tr>
                                <tr><td>D</td><td>60-69%</td><td>1.0</td></tr>
                                <tr><td>F</td><td>Below 60%</td><td>0.0</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Realistic Expectations Based on Required Score</h3>
                    <div className="seo-content__scenarios">
                        <div className="seo-content__scenario">
                            <h4>🟢 Under 70% required</h4>
                            <p>
                                Very achievable. You can likely pass with minimal additional studying.
                                Focus on avoiding careless mistakes.
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🟡 70-85% required</h4>
                            <p>
                                Achievable with good preparation. Make a study plan,
                                review past exams, and get enough sleep before the test.
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🟠 85-95% required</h4>
                            <p>
                                Challenging. You&apos;ll need to know the material well.
                                Consider forming a study group or getting tutoring.
                            </p>
                        </div>
                        <div className="seo-content__scenario">
                            <h4>🔴 Over 95% required</h4>
                            <p>
                                Very difficult. Consider whether this target is realistic.
                                A slightly lower grade might be more achievable with less stress.
                            </p>
                        </div>
                    </div>

                    <h3>Tips for Hitting Your Target Score</h3>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li><strong>Know the format:</strong> Multiple choice? Essays? Problems? Prepare accordingly.</li>
                        <li><strong>Review past exams:</strong> Professors often reuse question styles.</li>
                        <li><strong>Focus on weak areas:</strong> Don&apos;t just study what you already know.</li>
                        <li><strong>Get sleep:</strong> All-nighters usually hurt more than they help.</li>
                        <li><strong>Start early:</strong> Cramming is less effective than spaced repetition.</li>
                    </ul>

                    <h3>What If I Need Over 100%?</h3>
                    <p>
                        If the calculator shows you need more than 100%, you mathematically cannot reach your target grade on this exam alone.
                        Your options:
                    </p>
                    <ul style={{ marginLeft: "var(--space-6)", marginBottom: "var(--space-4)" }}>
                        <li>Check if there&apos;s extra credit available</li>
                        <li>Ask about retaking or dropping the lowest grade</li>
                        <li>Accept a slightly lower final grade (it&apos;s not the end of the world)</li>
                        <li>Talk to your professor about your situation</li>
                    </ul>

                    <h3>Next Steps</h3>
                    <p>
                        After determining your required score, use our <a href="/course">Course Grade Analyzer</a> to break down
                        all your assignment categories and see exactly where your grade stands.
                        Or check your overall <a href="/gpa">GPA Workspace</a> to see how this course affects your cumulative GPA.
                    </p>
                </section>

                {/* Related Tools */}
                <section style={{ marginTop: "var(--space-8)" }}>
                    <h3 style={{ marginBottom: "var(--space-4)" }}>Related Tools</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-4)" }}>
                        <a href="/grade-calculators/final-grade-calculator" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>Final Grade Calculator</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Calculate your current weighted average
                            </p>
                        </a>
                        <a href="/course" className="card card--hover" style={{ padding: "var(--space-4)", textDecoration: "none" }}>
                            <strong style={{ color: "var(--color-text)" }}>Course Grade Analyzer</strong>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                                Full breakdown of your course grade
                            </p>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
