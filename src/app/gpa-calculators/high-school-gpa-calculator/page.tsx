"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

const LineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });

interface YearData {
    id: string;
    name: string;
    gpa: number;
    credits: number;
}

const STORAGE_KEY = "gradepilot_highschool_gpa";
const YEARS = ["Freshman", "Sophomore", "Junior", "Senior"];

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function getDefaultYears(): YearData[] {
    return YEARS.slice(0, 2).map((name) => ({
        id: generateId(),
        name,
        gpa: 3.5,
        credits: 6,
    }));
}

export default function HighSchoolGPACalculator() {
    const [mounted, setMounted] = useState(false);
    const [years, setYears] = useState<YearData[]>(getDefaultYears);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) setYears(parsed);
            } catch { /* use defaults */ }
        }
    }, []);

    useEffect(() => {
        if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(years));
    }, [years, mounted]);

    const calculations = useMemo(() => {
        let totalCredits = 0;
        let totalQualityPoints = 0;

        const trendData = years.map((year) => {
            totalCredits += year.credits;
            totalQualityPoints += year.gpa * year.credits;
            const cumulativeGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

            return {
                name: year.name,
                yearGPA: year.gpa,
                cumulativeGPA: parseFloat(cumulativeGPA.toFixed(2)),
            };
        });

        const cumulativeGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

        return { cumulativeGPA, totalCredits, trendData };
    }, [years]);

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.7) return { label: "Excellent", class: "excellent" };
        if (gpa >= 3.0) return { label: "Good", class: "good" };
        if (gpa >= 2.0) return { label: "Satisfactory", class: "warning" };
        return { label: "At Risk", class: "danger" };
    };

    const status = getGPAStatus(calculations.cumulativeGPA);

    const updateYear = (id: string, field: keyof YearData, value: string | number) => {
        setYears((prev) => prev.map((y) => (y.id === id ? { ...y, [field]: value } : y)));
    };

    const addYear = () => {
        const usedNames = years.map((y) => y.name);
        const nextYear = YEARS.find((y) => !usedNames.includes(y)) || `Year ${years.length + 1}`;
        setYears((prev) => [...prev, { id: generateId(), name: nextYear, gpa: 3.0, credits: 6 }]);
        setActiveTab(years.length);
    };

    const removeYear = (id: string) => {
        setYears((prev) => {
            const filtered = prev.filter((y) => y.id !== id);
            if (activeTab >= filtered.length) setActiveTab(Math.max(0, filtered.length - 1));
            return filtered;
        });
    };

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard__header">
                    <nav className="dashboard__breadcrumb">
                        <a href="/">Home</a> / <a href="/gpa-calculators">GPA Calculators</a> / High School GPA
                    </nav>
                    <h1 className="dashboard__title">High School GPA Calculator</h1>
                    <p className="dashboard__subtitle">
                        Calculate your 4-year cumulative high school GPA
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
                                <span className="gpa-snapshot__meta-value">{years.length}</span>
                                <span>Years</span>
                            </div>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    {mounted && calculations.trendData.length > 1 && (
                        <div className="impact-section">
                            <h2 className="impact-section__title">GPA Progress</h2>
                            <div className="impact-section__chart">
                                <ResponsiveContainer width="100%" height={180}>
                                    <LineChart data={calculations.trendData} margin={{ left: 0, right: 20 }}>
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="cumulativeGPA"
                                            stroke="#2563eb"
                                            strokeWidth={2}
                                            dot={{ fill: "#2563eb" }}
                                            name="Cumulative"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="yearGPA"
                                            stroke="#7c3aed"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={{ fill: "#7c3aed" }}
                                            name="Year"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Year Tabs */}
                    <div className="course-list">
                        <div style={{ display: "flex", gap: "var(--space-2)", borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-4)" }}>
                            {years.map((year, idx) => (
                                <button
                                    key={year.id}
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
                                    }}
                                >
                                    {year.name}
                                </button>
                            ))}
                            {years.length < 4 && (
                                <button
                                    onClick={addYear}
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
                                    + Add Year
                                </button>
                            )}
                        </div>

                        {/* Active Year Form */}
                        {years[activeTab] && (
                            <div className="card" style={{ padding: "var(--space-4)" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "var(--space-4)", alignItems: "end" }}>
                                    <div className="input-group">
                                        <label className="input-group__label">Year</label>
                                        <select
                                            className="input select"
                                            value={years[activeTab].name}
                                            onChange={(e) => updateYear(years[activeTab].id, "name", e.target.value)}
                                        >
                                            {YEARS.map((y) => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-group__label">Year GPA</label>
                                        <input
                                            type="number"
                                            className="input"
                                            step={0.01}
                                            min={0}
                                            max={4}
                                            value={years[activeTab].gpa}
                                            onChange={(e) => updateYear(years[activeTab].id, "gpa", parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-group__label">Credits</label>
                                        <input
                                            type="number"
                                            className="input"
                                            min={1}
                                            max={20}
                                            value={years[activeTab].credits}
                                            onChange={(e) => updateYear(years[activeTab].id, "credits", parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                    {years.length > 1 && (
                                        <button
                                            onClick={() => removeYear(years[activeTab].id)}
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
                    <summary>Why High School GPA Matters</summary>
                    <div className="explanation-section__content">
                        <p>Your cumulative high school GPA is a key factor in college admissions:</p>
                        <ul style={{ marginLeft: "var(--space-4)", marginTop: "var(--space-2)" }}>
                            <li><strong>3.7+:</strong> Competitive for selective universities</li>
                            <li><strong>3.5+:</strong> Competitive for most state universities</li>
                            <li><strong>3.0+:</strong> Meets minimum requirements for many colleges</li>
                        </ul>
                    </div>
                </details>
            </div>
        </div>
    );
}
