"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

const LineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });

interface Semester {
    id: string;
    name: string;
    gpa: number;
    credits: number;
}

const STORAGE_KEY = "gradepilot_college_gpa";

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function predictNextSemester(current: string): string {
    const seasons = ["Spring", "Summer", "Fall"];
    const parts = current.split(" ");
    if (parts.length !== 2) return "Spring 2024";

    const season = parts[0];
    const year = parseInt(parts[1]) || 2024;

    const idx = seasons.indexOf(season);
    if (idx === -1) return "Spring " + year;

    if (season === "Fall") {
        return "Spring " + (year + 1);
    } else {
        return seasons[idx + 1] + " " + year;
    }
}

function getDefaultSemesters(): Semester[] {
    return [
        { id: generateId(), name: "Fall 2023", gpa: 3.5, credits: 15 },
        { id: generateId(), name: "Spring 2024", gpa: 3.3, credits: 16 },
    ];
}

export default function CollegeGPACalculator() {
    const [mounted, setMounted] = useState(false);
    const [semesters, setSemesters] = useState<Semester[]>(getDefaultSemesters);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) setSemesters(parsed);
            } catch { /* use defaults */ }
        }
    }, []);

    useEffect(() => {
        if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(semesters));
    }, [semesters, mounted]);

    const calculations = useMemo(() => {
        let totalCredits = 0;
        let totalQualityPoints = 0;

        const trendData = semesters.map((sem, idx) => {
            totalCredits += sem.credits;
            totalQualityPoints += sem.gpa * sem.credits;
            const cumulativeGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

            return {
                name: sem.name,
                semesterGPA: sem.gpa,
                cumulativeGPA: parseFloat(cumulativeGPA.toFixed(2)),
            };
        });

        const cumulativeGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

        return { cumulativeGPA, totalCredits, trendData };
    }, [semesters]);

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.7) return { label: "Excellent", class: "excellent" };
        if (gpa >= 3.0) return { label: "Good", class: "good" };
        if (gpa >= 2.0) return { label: "Satisfactory", class: "warning" };
        return { label: "At Risk", class: "danger" };
    };

    const status = getGPAStatus(calculations.cumulativeGPA);

    const updateSemester = (id: string, field: keyof Semester, value: string | number) => {
        setSemesters((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    };

    const addSemester = () => {
        const lastSem = semesters[semesters.length - 1];
        const nextName = lastSem ? predictNextSemester(lastSem.name) : "Fall 2024";
        setSemesters((prev) => [...prev, { id: generateId(), name: nextName, gpa: 3.0, credits: 15 }]);
        setActiveTab(semesters.length);
    };

    const removeSemester = (id: string) => {
        setSemesters((prev) => {
            const filtered = prev.filter((s) => s.id !== id);
            if (activeTab >= filtered.length) setActiveTab(Math.max(0, filtered.length - 1));
            return filtered;
        });
    };

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/gpa-calculators">GPA Calculators</a> / College GPA
                    </nav>
                    <h1 className="dashboard__title">College GPA Calculator</h1>
                    <p className="dashboard__subtitle">
                        Track your cumulative GPA across multiple semesters
                    </p>
                </div>

                <div className="dashboard__workspace">
                    {/* Cumulative Snapshot */}
                    <div className={`gpa-snapshot gpa-snapshot--${status.class}`}>
                        <div className="gpa-snapshot__number">
                            {mounted ? calculations.cumulativeGPA.toFixed(2) : "0.00"}
                        </div>
                        <div className="gpa-snapshot__label">Cumulative GPA</div>
                        <div className="gpa-snapshot__badge">{status.label}</div>
                        <div className="gpa-snapshot__meta">
                            <div className="gpa-snapshot__meta-item">
                                <span className="gpa-snapshot__meta-value">{calculations.totalCredits}</span>
                                <span>Total Credits</span>
                            </div>
                            <div className="gpa-snapshot__meta-item">
                                <span className="gpa-snapshot__meta-value">{semesters.length}</span>
                                <span>Semesters</span>
                            </div>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    {mounted && calculations.trendData.length > 1 && (
                        <div className="impact-section">
                            <h2 className="impact-section__title">GPA Trend</h2>
                            <div className="impact-section__chart">
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={calculations.trendData} margin={{ left: 0, right: 20 }}>
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="cumulativeGPA"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            dot={{ fill: "#2563eb", strokeWidth: 2 }}
                                            name="Cumulative"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="semesterGPA"
                                            stroke="#7c3aed"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={{ fill: "#7c3aed", strokeWidth: 2 }}
                                            name="Semester"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                                <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
                                    <span><span style={{ color: "#2563eb" }}>━</span> Cumulative GPA</span>
                                    <span><span style={{ color: "#7c3aed" }}>┅</span> Semester GPA</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Semester Tabs */}
                    <div className="course-list">
                        <div style={{ display: "flex", gap: "var(--space-2)", borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-4)", overflowX: "auto" }}>
                            {semesters.map((sem, idx) => (
                                <button
                                    key={sem.id}
                                    onClick={() => setActiveTab(idx)}
                                    style={{
                                        padding: "var(--space-2) var(--space-4)",
                                        background: activeTab === idx ? "var(--color-primary)" : "transparent",
                                        color: activeTab === idx ? "white" : "var(--color-text-muted)",
                                        border: "none",
                                        borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                                        fontSize: "var(--text-sm)",
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {sem.name}
                                </button>
                            ))}
                            <button
                                onClick={addSemester}
                                style={{
                                    padding: "var(--space-2) var(--space-4)",
                                    background: "transparent",
                                    color: "var(--color-primary)",
                                    border: "none",
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                }}
                            >
                                + Add
                            </button>
                        </div>

                        {/* Active Semester Form */}
                        {semesters[activeTab] && (
                            <div className="card" style={{ padding: "var(--space-4)" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "var(--space-4)", alignItems: "end" }}>
                                    <div className="input-group">
                                        <label className="input-group__label">Semester Name</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={semesters[activeTab].name}
                                            onChange={(e) => updateSemester(semesters[activeTab].id, "name", e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-group__label">Semester GPA</label>
                                        <input
                                            type="number"
                                            className="input"
                                            step={0.01}
                                            min={0}
                                            max={4}
                                            value={semesters[activeTab].gpa}
                                            onChange={(e) => updateSemester(semesters[activeTab].id, "gpa", parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-group__label">Credits</label>
                                        <input
                                            type="number"
                                            className="input"
                                            min={1}
                                            max={30}
                                            value={semesters[activeTab].credits}
                                            onChange={(e) => updateSemester(semesters[activeTab].id, "credits", parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                    {semesters.length > 1 && (
                                        <button
                                            onClick={() => removeSemester(semesters[activeTab].id)}
                                            className="btn btn--destructive btn--sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <details className="explanation-section">
                    <summary>How Cumulative GPA is Calculated</summary>
                    <div className="explanation-section__content">
                        <p>Cumulative GPA combines all semesters weighted by credits:</p>
                        <p style={{ fontFamily: "monospace", background: "var(--color-bg-secondary)", padding: "var(--space-2)", borderRadius: "var(--radius-sm)", marginTop: "var(--space-2)" }}>
                            Cumulative GPA = Σ(Semester GPA × Credits) ÷ Total Credits
                        </p>
                    </div>
                </details>
            </div>
        </div>
    );
}
