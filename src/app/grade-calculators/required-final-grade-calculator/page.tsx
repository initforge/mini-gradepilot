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
                    <summary>How It's Calculated</summary>
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
            </div>
        </div>
    );
}
