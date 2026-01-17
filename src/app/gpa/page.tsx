"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    useAcademicStore,
    gradeOptions,
    calculateGPA,
    getSemesterGPA,
    gradeToGPA
} from "@/lib/useAcademicStore";
import { IconChartBar, IconScale, IconConverter, IconIdea, IconCheckCircle, IconNumberCircle, IconTarget, IconTrendUp, IconFolder, IconFolderOpen } from "@/components/Icons";
import { DeleteButton, AddButton } from "@/components/AnimatedButtons";
import WorkspaceNav from "@/components/WorkspaceNav";
import ProfileSwitcher from "@/components/ProfileSwitcher";
import { SlideToggleButton, OutlineButton } from "@/components/FancyButtons";
import { FAQSection, generateFAQSchema, RelatedTools, ExplanationBlock, ExampleBlock } from "@/components/SEOContent";

// GPA Workspace FAQ Data
const gpaFAQs = [
    {
        question: "What is considered a good GPA in the US?",
        answer: "A GPA of 3.0 or above is generally considered good. For competitive colleges, aim for 3.5+. Dean's List typically requires 3.5-3.7. A 4.0 is a perfect GPA, meaning all A grades."
    },
    {
        question: "How is weighted GPA different from unweighted?",
        answer: "Unweighted GPA uses the standard 4.0 scale where A=4.0. Weighted GPA gives extra credit for harder classes—typically +0.5 for Honors and +1.0 for AP/IB courses. So an A in AP class = 5.0 instead of 4.0."
    },
    {
        question: "Can I still raise my GPA to 3.5?",
        answer: "It depends on how many credits you've completed. The more credits you have, the harder it is to change your GPA. Use our calculator to add your target courses and see what grades you'd need."
    },
    {
        question: "Does this calculator work for AP and IB classes?",
        answer: "Yes! Toggle 'Weighted' mode on to apply the correct bonuses. AP/IB courses get +1.0 added to their grade points, and Honors courses get +0.5."
    },
    {
        question: "Will my high school GPA reset in college?",
        answer: "Yes, college GPA starts fresh. Your high school GPA is used for admissions, but once you're in college, you build a new GPA from scratch."
    },
    {
        question: "How do I calculate semester GPA vs cumulative GPA?",
        answer: "Semester GPA is based only on courses from that term. Cumulative GPA includes all courses across all semesters, weighted by credits. This calculator shows both."
    }
];

const relatedLinks = [
    {
        title: "Course Grade Analyzer",
        description: "See how individual assignments affect your course grade",
        href: "/course",
        accent: "#f97316"
    },
    {
        title: "Transcript Workspace",
        description: "Track your cumulative GPA over multiple semesters",
        href: "/transcript",
        accent: "#8b5cf6"
    }
];

export default function GPAWorkspace() {
    const [mounted, setMounted] = useState(false);
    const [weighted, setWeighted] = useState(false);
    const [showConverter, setShowConverter] = useState(false);
    const [percentage, setPercentage] = useState("");
    const [expandedSemester, setExpandedSemester] = useState<string | null>(null);
    const [addingSemester, setAddingSemester] = useState(false);
    const [newSemesterName, setNewSemesterName] = useState("");
    const [newSemesterYear, setNewSemesterYear] = useState(new Date().getFullYear());
    const [newSemesterTerm, setNewSemesterTerm] = useState<"Fall" | "Spring" | "Summer">("Fall");
    // Aim Mode state
    const [aimMode, setAimMode] = useState(false);
    const [targetGPA, setTargetGPA] = useState("3.5");

    const {
        profiles,
        activeProfileId,
        createProfile,
        addSemester,
        deleteSemester,
        addCourse,
        updateCourse,
        deleteCourse,
        clearAllData,
        _hasHydrated,
    } = useAcademicStore();

    useEffect(() => {
        setMounted(true);
        // Auto-create profile if none exists AND store has hydrated from localStorage
        if (_hasHydrated && profiles.length === 0) {
            createProfile("My Profile");
        }
    }, [_hasHydrated, profiles.length, createProfile]);

    if (!mounted) {
        return <div style={{ minHeight: "100vh", background: "#f8fafc" }} />;
    }

    // Compute profile directly from subscription state for reactivity
    const profile = profiles.find((p) => p.id === activeProfileId) || null;
    const semesters = profile?.semesters || [];
    const allCourses = semesters.flatMap((s) => s.courses);
    const overallGPA = calculateGPA(allCourses, weighted);

    // Percentage to GPA conversion
    const convertedGPA = percentage
        ? Math.max(0, Math.min(4, ((parseFloat(percentage) - 60) / 10))).toFixed(2)
        : "";

    const handleAddSemester = () => {
        if (newSemesterName.trim()) {
            addSemester(newSemesterName.trim(), newSemesterYear, newSemesterTerm);
            setNewSemesterName("");
            setAddingSemester(false);
        }
    };

    const handleAddCourse = (semesterId: string) => {
        addCourse(semesterId, {
            name: "New Course",
            grade: "B",
            credits: 3,
            type: "Regular",
        });
    };

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.7) return { text: "Excellent", color: "#22c55e" };
        if (gpa >= 3.0) return { text: "Good", color: "#14b8a6" };
        if (gpa >= 2.0) return { text: "Satisfactory", color: "#f59e0b" };
        return { text: "Needs Improvement", color: "#ef4444" };
    };

    // Grade improvement priority (lower GPA improvements are easier)
    const gradeImprovements: { from: string; to: string; priority: number }[] = [
        { from: "F", to: "D", priority: 10 },
        { from: "D", to: "C", priority: 9 },
        { from: "D-", to: "C", priority: 9 },
        { from: "D+", to: "C", priority: 8 },
        { from: "C-", to: "C", priority: 7 },
        { from: "C", to: "B", priority: 6 },
        { from: "C+", to: "B", priority: 5 },
        { from: "D", to: "B", priority: 5 },
        { from: "B-", to: "B", priority: 4 },
        { from: "B", to: "B+", priority: 2 }, // Hard - deprioritize
        { from: "B+", to: "A-", priority: 1 }, // Very hard
        { from: "B", to: "A", priority: 1 },   // Very hard - avoid
        { from: "A-", to: "A", priority: 0 },  // Nearly impossible
        { from: "A", to: "A+", priority: 0 },  // Avoid completely
    ];

    // Helper to get GPA value from grade (with weighted bonus)
    const getGradeGPA = (grade: string, isWeighted: boolean, courseType: string): number => {
        const baseGPA = gradeToGPA[grade] ?? 0;
        if (!isWeighted) return baseGPA;
        if (courseType === "Honors") return Math.min(4.0, baseGPA + 0.5);
        if (courseType === "AP/IB") return Math.min(5.0, baseGPA + 1.0);
        return baseGPA;
    };

    // Calculate recommendations for Aim Mode
    const getAimRecommendations = () => {
        const target = parseFloat(targetGPA);
        if (target <= overallGPA || allCourses.length === 0) return [];

        const gpaGap = target - overallGPA;
        const totalCredits = allCourses.reduce((sum, c) => sum + c.credits, 0);

        // Score each course by improvement potential
        const courseScores = allCourses.map(course => {
            const currentGPA = getGradeGPA(course.grade, weighted, course.type);

            // Find best improvement for this course
            let bestImprovement = null;
            for (const imp of gradeImprovements) {
                if (imp.from === course.grade && imp.priority > 0) {
                    const newGPA = getGradeGPA(imp.to, weighted, course.type);
                    const gpaGain = (newGPA - currentGPA) * course.credits / totalCredits;
                    bestImprovement = {
                        course,
                        from: imp.from,
                        to: imp.to,
                        priority: imp.priority,
                        gpaGain,
                        score: imp.priority * course.credits * gpaGain,
                    };
                    break; // Take first (highest priority) improvement
                }
            }
            return bestImprovement;
        }).filter(Boolean);

        // Sort by score (priority × credits × impact)
        courseScores.sort((a, b) => (b?.score || 0) - (a?.score || 0));

        // Accumulate until target reached (or return top 3)
        const recommendations: typeof courseScores = [];
        let accumulatedGain = 0;

        for (const rec of courseScores) {
            if (!rec) continue;
            recommendations.push(rec);
            accumulatedGain += rec.gpaGain;
            if (accumulatedGain >= gpaGap || recommendations.length >= 3) break;
        }

        return recommendations;
    };

    const status = getGPAStatus(overallGPA);

    return (
        <>
            <WorkspaceNav current="gpa" />

            {/* Header */}
            <section style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                color: "white",
                padding: "var(--space-6) 0",
            }}>
                <div className="container">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                            <IconChartBar className="w-8 h-8" style={{ color: "#14b8a6" }} />
                            <div>
                                <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 700, margin: 0, color: "white" }}>GPA Workspace</h1>
                                <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.85)", margin: 0, fontWeight: 500 }}>
                                    Manage semesters and courses • {allCourses.length} courses loaded
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                            {/* Weighted Toggle */}
                            <SlideToggleButton
                                active={weighted}
                                onClick={() => setWeighted(!weighted)}
                                icon={<IconScale style={{ width: 18, height: 18, color: weighted ? "#e9d5ff" : "#a78bfa" }} />}
                                activeLabel="Weighted ON"
                                inactiveLabel="Weighted OFF"
                                activeColor="#7c3aed"
                            />

                            {/* Convert Button */}
                            <OutlineButton
                                active={showConverter}
                                onClick={() => setShowConverter(!showConverter)}
                                icon={<IconConverter style={{ width: 18, height: 18, color: showConverter ? "#fff" : "#fdba74" }} />}
                                label="% → GPA"
                                activeColor="#f97316"
                            />

                            <ProfileSwitcher />
                        </div>
                    </div>

                    {/* Converter Panel */}
                    {showConverter && (
                        <div style={{
                            marginTop: "var(--space-4)",
                            padding: "var(--space-4)",
                            background: "rgba(249, 115, 22, 0.1)",
                            border: "1px solid rgba(249, 115, 22, 0.3)",
                            borderRadius: "var(--radius-lg)",
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-4)",
                        }}>
                            <input
                                type="number"
                                value={percentage}
                                onChange={(e) => setPercentage(e.target.value)}
                                placeholder="Enter percentage (0-100)"
                                style={{
                                    padding: "var(--space-2) var(--space-3)",
                                    borderRadius: "var(--radius-md)",
                                    border: "none",
                                    width: 200,
                                    fontSize: "var(--text-base)",
                                }}
                            />
                            <span style={{ fontSize: "var(--text-lg)" }}>→</span>
                            <div style={{
                                padding: "var(--space-2) var(--space-4)",
                                background: "#f97316",
                                borderRadius: "var(--radius-md)",
                                fontWeight: 700,
                                fontSize: "var(--text-lg)",
                            }}>
                                {convertedGPA || "0.00"} GPA
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <section className="section" style={{ background: "#f8fafc" }}>
                <div className="container">
                    <div className="workspace-layout">

                        {/* Left: GPA Snapshot */}
                        <div>
                            <div style={{
                                background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                                borderRadius: "var(--radius-xl)",
                                padding: "var(--space-8)",
                                color: "white",
                                textAlign: "center",
                            }}>
                                <div style={{
                                    fontSize: "5rem",
                                    fontWeight: 800,
                                    lineHeight: 1,
                                    textShadow: "0 4px 20px rgba(0,0,0,0.2)"
                                }}>
                                    {overallGPA.toFixed(2)}
                                </div>
                                <div style={{
                                    fontSize: "var(--text-sm)",
                                    opacity: 0.8,
                                    marginTop: "var(--space-2)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em"
                                }}>
                                    {weighted ? "Weighted GPA" : "Unweighted GPA"}
                                </div>
                                <div style={{
                                    marginTop: "var(--space-4)",
                                    padding: "var(--space-2) var(--space-4)",
                                    background: "rgba(255,255,255,0.2)",
                                    borderRadius: "var(--radius-full)",
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 600,
                                }}>
                                    {status.text}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="card" style={{ marginTop: "var(--space-4)", padding: "var(--space-4)" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-primary)" }}>
                                            {semesters.length}
                                        </div>
                                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Semesters</div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-primary)" }}>
                                            {allCourses.reduce((sum, c) => sum + c.credits, 0)}
                                        </div>
                                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Credits</div>
                                    </div>
                                </div>
                            </div>

                            {/* Aim Mode Card */}
                            <div className="card" style={{
                                marginTop: "var(--space-4)",
                                padding: "var(--space-4)",
                                border: aimMode ? "2px solid #f97316" : "1px solid var(--color-border)",
                                background: aimMode ? "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)" : "white",
                                transition: "all 0.3s ease",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: aimMode ? "var(--space-3)" : 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                                        <IconTarget style={{ width: "20px", height: "20px", color: aimMode ? "#ea580c" : "#64748b" }} />
                                        <span style={{ fontWeight: 700, color: aimMode ? "#ea580c" : "var(--color-text)" }}>Aim Mode</span>
                                    </div>
                                    {/* Toggle Switch */}
                                    <label style={{
                                        position: "relative",
                                        display: "flex",
                                        width: "52px",
                                        height: "28px",
                                        cursor: "pointer",
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={aimMode}
                                            onChange={() => setAimMode(!aimMode)}
                                            style={{
                                                opacity: 0,
                                                width: 0,
                                                height: 0,
                                            }}
                                        />
                                        <span style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: aimMode ? "#f97316" : "#cbd5e1",
                                            borderRadius: "14px",
                                            transition: "0.3s",
                                        }}>
                                            <span style={{
                                                position: "absolute",
                                                height: "22px",
                                                width: "22px",
                                                left: aimMode ? "27px" : "3px",
                                                bottom: "3px",
                                                background: "white",
                                                borderRadius: "50%",
                                                transition: "0.3s",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                            }} />
                                        </span>
                                    </label>
                                </div>

                                {/* Aim Mode Content */}
                                {aimMode && (
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                                            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "#9a3412" }}>Target:</span>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="4"
                                                value={targetGPA}
                                                onChange={(e) => setTargetGPA(e.target.value)}
                                                style={{
                                                    padding: "var(--space-1) var(--space-2)",
                                                    borderRadius: "var(--radius-md)",
                                                    border: "2px solid #f97316",
                                                    width: 60,
                                                    fontSize: "var(--text-base)",
                                                    fontWeight: 700,
                                                    textAlign: "center",
                                                    background: "white",
                                                }}
                                            />
                                            <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "#9a3412" }}>GPA</span>
                                        </div>

                                        <div style={{
                                            padding: "var(--space-2) var(--space-3)",
                                            background: parseFloat(targetGPA) > overallGPA ? "#f97316" : "#14b8a6",
                                            borderRadius: "var(--radius-md)",
                                            fontWeight: 600,
                                            color: "white",
                                            fontSize: "var(--text-sm)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "var(--space-2)",
                                            marginBottom: "var(--space-3)",
                                        }}>
                                            {parseFloat(targetGPA) > overallGPA ? (
                                                <>
                                                    <IconTrendUp style={{ width: "16px", height: "16px", color: "white" }} />
                                                    Need +{(parseFloat(targetGPA) - overallGPA).toFixed(2)}
                                                </>
                                            ) : (
                                                <>
                                                    <IconCheckCircle style={{ width: "16px", height: "16px", color: "white" }} />
                                                    Achieved!
                                                </>
                                            )}
                                        </div>

                                        {/* Hint about inline suggestions */}
                                        {parseFloat(targetGPA) > overallGPA && allCourses.length > 0 && (
                                            <p style={{
                                                fontSize: "var(--text-xs)",
                                                color: "#92400e",
                                                margin: 0,
                                                textAlign: "center",
                                            }}>
                                                <IconIdea style={{ width: "14px", height: "14px", color: "#92400e", flexShrink: 0 }} />
                                                Target grades shown next to courses
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Semesters & Courses */}
                        <div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "var(--space-4)"
                            }}>
                                <h2 style={{ margin: 0 }}>Your Semesters</h2>
                                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                    {semesters.length > 0 && (
                                        <DeleteButton
                                            onClick={() => {
                                                if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
                                                    clearAllData();
                                                }
                                            }}
                                            label="Clear"
                                        />
                                    )}
                                    <AddButton
                                        onClick={() => setAddingSemester(true)}
                                        label="Add Semester"
                                        color="teal"
                                    />
                                </div>
                            </div>

                            {/* Add Semester Form */}
                            {addingSemester && (
                                <div className="card" style={{
                                    marginBottom: "var(--space-4)",
                                    padding: "var(--space-4)",
                                    background: "var(--color-primary-light)",
                                    border: "2px solid var(--color-primary)",
                                }}>
                                    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-end" }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Name</label>
                                            <input
                                                type="text"
                                                value={newSemesterName}
                                                onChange={(e) => setNewSemesterName(e.target.value)}
                                                placeholder="e.g., Fall 2024"
                                                style={{
                                                    width: "100%",
                                                    padding: "var(--space-2)",
                                                    border: "1px solid var(--color-border)",
                                                    borderRadius: "var(--radius-md)",
                                                    marginTop: "var(--space-1)",
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Year</label>
                                            <input
                                                type="number"
                                                value={newSemesterYear}
                                                onChange={(e) => setNewSemesterYear(parseInt(e.target.value))}
                                                style={{
                                                    width: 80,
                                                    padding: "var(--space-2)",
                                                    border: "1px solid var(--color-border)",
                                                    borderRadius: "var(--radius-md)",
                                                    marginTop: "var(--space-1)",
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Term</label>
                                            <select
                                                value={newSemesterTerm}
                                                onChange={(e) => setNewSemesterTerm(e.target.value as "Fall" | "Spring" | "Summer")}
                                                style={{
                                                    padding: "var(--space-2)",
                                                    border: "1px solid var(--color-border)",
                                                    borderRadius: "var(--radius-md)",
                                                    marginTop: "var(--space-1)",
                                                }}
                                            >
                                                <option value="Fall">Fall</option>
                                                <option value="Spring">Spring</option>
                                                <option value="Summer">Summer</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={handleAddSemester}
                                            style={{
                                                background: "var(--color-primary)",
                                                color: "white",
                                                border: "none",
                                                padding: "var(--space-2) var(--space-4)",
                                                borderRadius: "var(--radius-md)",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Add
                                        </button>
                                        <button
                                            onClick={() => setAddingSemester(false)}
                                            style={{
                                                background: "transparent",
                                                color: "var(--color-text-muted)",
                                                border: "1px solid var(--color-border)",
                                                padding: "var(--space-2) var(--space-4)",
                                                borderRadius: "var(--radius-md)",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {semesters.length === 0 && !addingSemester && (
                                <div className="card" style={{
                                    padding: "var(--space-12)",
                                    textAlign: "center",
                                    color: "var(--color-text-muted)"
                                }}>
                                    {/* Clean Empty State Illustration */}
                                    <div style={{ marginBottom: "var(--space-6)" }}>
                                        <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                                            {/* Stack of cards representing semesters */}
                                            <rect x="20" y="50" width="80" height="45" rx="8" fill="#e2e8f0" />
                                            <rect x="15" y="35" width="90" height="45" rx="8" fill="#cbd5e1" />
                                            <rect x="10" y="20" width="100" height="45" rx="8" fill="#14b8a6" />
                                            {/* Plus symbol on top card */}
                                            <path d="M60 32v20M50 42h20" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                            {/* Lines on top card */}
                                            <rect x="25" y="52" width="40" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
                                            <rect x="25" y="60" width="25" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
                                        </svg>
                                    </div>
                                    <h3>No semesters yet</h3>
                                    <p>Add your first semester to start tracking your GPA</p>
                                    <div style={{ marginTop: "var(--space-4)", display: "flex", justifyContent: "center" }}>
                                        <AddButton
                                            onClick={() => setAddingSemester(true)}
                                            label="Add Semester"
                                            color="teal"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Semester Accordion */}
                            {semesters.map((semester) => {
                                const semesterGPA = getSemesterGPA(semester, weighted);
                                const isExpanded = expandedSemester === semester.id;

                                return (
                                    <div key={semester.id} className="card" style={{ marginBottom: "var(--space-3)" }}>
                                        {/* Semester Header */}
                                        <div
                                            onClick={() => setExpandedSemester(isExpanded ? null : semester.id)}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "var(--space-4)",
                                                cursor: "pointer",
                                                background: isExpanded ? "var(--color-primary-light)" : "transparent",
                                                borderRadius: "var(--radius-lg)",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                                                {isExpanded ? (
                                                    <IconFolderOpen style={{ width: "24px", height: "24px", color: "var(--color-primary)" }} />
                                                ) : (
                                                    <IconFolder style={{ width: "24px", height: "24px", color: "var(--color-primary)" }} />
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{semester.name}</div>
                                                    <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                                                        {semester.courses.length} courses • {semester.courses.reduce((s, c) => s + c.credits, 0)} credits
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                                                <div style={{
                                                    textAlign: "right",
                                                    padding: "var(--space-1) var(--space-3)",
                                                    background: "var(--color-primary)",
                                                    color: "white",
                                                    borderRadius: "var(--radius-md)",
                                                    fontWeight: 700,
                                                }}>
                                                    {semesterGPA.toFixed(2)}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteSemester(semester.id);
                                                    }}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "#94a3b8",
                                                        cursor: "pointer",
                                                        fontSize: "var(--text-lg)",
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>

                                        {/* Courses List (Expanded) */}
                                        {isExpanded && (
                                            <div style={{
                                                padding: "var(--space-4)",
                                                borderTop: "1px solid var(--color-border)"
                                            }}>
                                                {semester.courses.length === 0 ? (
                                                    <p style={{
                                                        textAlign: "center",
                                                        color: "var(--color-text-muted)",
                                                        padding: "var(--space-4)"
                                                    }}>
                                                        No courses yet. Add one below.
                                                    </p>
                                                ) : (
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                                                        {semester.courses.map((course) => {
                                                            // Get aim recommendation for this course
                                                            const aimRec = aimMode ? getAimRecommendations().find(r => r?.course.id === course.id) : null;

                                                            return (
                                                                <div
                                                                    key={course.id}
                                                                    style={{
                                                                        display: "grid",
                                                                        gridTemplateColumns: aimMode ? "1fr 80px 60px 100px 90px 32px" : "1fr 80px 60px 100px 32px",
                                                                        gap: "var(--space-2)",
                                                                        alignItems: "center",
                                                                        padding: "var(--space-2)",
                                                                        background: aimRec ? "#fff7ed" : "#f8fafc",
                                                                        borderRadius: "var(--radius-md)",
                                                                        border: aimRec ? "1px solid #fed7aa" : "none",
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        value={course.name}
                                                                        onChange={(e) => updateCourse(semester.id, course.id, { name: e.target.value })}
                                                                        style={{
                                                                            padding: "var(--space-1) var(--space-2)",
                                                                            border: "1px solid var(--color-border)",
                                                                            borderRadius: "var(--radius-sm)",
                                                                            fontWeight: 500,
                                                                        }}
                                                                    />
                                                                    <select
                                                                        value={course.grade}
                                                                        onChange={(e) => updateCourse(semester.id, course.id, { grade: e.target.value })}
                                                                        style={{
                                                                            padding: "var(--space-1)",
                                                                            border: "1px solid var(--color-border)",
                                                                            borderRadius: "var(--radius-sm)",
                                                                        }}
                                                                    >
                                                                        {gradeOptions.map((g) => (
                                                                            <option key={g} value={g}>{g}</option>
                                                                        ))}
                                                                    </select>
                                                                    <input
                                                                        type="number"
                                                                        value={course.credits}
                                                                        onChange={(e) => updateCourse(semester.id, course.id, { credits: parseInt(e.target.value) || 0 })}
                                                                        style={{
                                                                            padding: "var(--space-1)",
                                                                            border: "1px solid var(--color-border)",
                                                                            borderRadius: "var(--radius-sm)",
                                                                            width: "100%",
                                                                        }}
                                                                    />
                                                                    <select
                                                                        value={course.type}
                                                                        onChange={(e) => updateCourse(semester.id, course.id, { type: e.target.value as "Regular" | "Honors" | "AP/IB" })}
                                                                        style={{
                                                                            padding: "var(--space-1)",
                                                                            border: "1px solid var(--color-border)",
                                                                            borderRadius: "var(--radius-sm)",
                                                                            fontSize: "var(--text-sm)",
                                                                        }}
                                                                    >
                                                                        <option value="Regular">Regular</option>
                                                                        <option value="Honors">Honors</option>
                                                                        <option value="AP/IB">AP/IB</option>
                                                                    </select>
                                                                    {/* Aim Mode Suggestion Column */}
                                                                    {aimMode && (
                                                                        <div style={{
                                                                            fontSize: "var(--text-xs)",
                                                                            textAlign: "center",
                                                                        }}>
                                                                            {aimRec ? (
                                                                                <span style={{
                                                                                    display: "inline-flex",
                                                                                    alignItems: "center",
                                                                                    gap: 3,
                                                                                    background: "#f97316",
                                                                                    color: "white",
                                                                                    padding: "2px 6px",
                                                                                    borderRadius: 4,
                                                                                    fontWeight: 600,
                                                                                }}>
                                                                                    → {aimRec.to}
                                                                                </span>
                                                                            ) : (
                                                                                <span style={{ color: "#94a3b8" }}>—</span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    <button
                                                                        onClick={() => deleteCourse(semester.id, course.id)}
                                                                        style={{
                                                                            background: "transparent",
                                                                            border: "none",
                                                                            color: "#94a3b8",
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => handleAddCourse(semester.id)}
                                                    style={{
                                                        marginTop: "var(--space-3)",
                                                        background: "transparent",
                                                        border: "2px dashed var(--color-border)",
                                                        color: "var(--color-text-muted)",
                                                        padding: "var(--space-2) var(--space-4)",
                                                        borderRadius: "var(--radius-md)",
                                                        fontWeight: 500,
                                                        cursor: "pointer",
                                                        width: "100%",
                                                    }}
                                                >
                                                    + Add Course
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="section" style={{ background: "#f8fafc" }}>
                <div className="container container--narrow">
                    {/* What is GPA - Problem Framing */}
                    <ExplanationBlock title="What is GPA and Why Does It Matter?">
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            <strong>GPA (Grade Point Average)</strong> is the standard measure of academic achievement in
                            American high schools and colleges. It converts your letter grades into a numerical scale,
                            typically from 0.0 to 4.0, making it easy to compare academic performance across different
                            courses, semesters, and institutions.
                        </p>
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            Your GPA matters because it's used for <strong>college admissions</strong>, scholarship
                            applications, graduate school requirements, Dean's List eligibility, and even some job
                            applications. A strong GPA opens doors to opportunities—many competitive programs require
                            a minimum 3.0 or 3.5 GPA to even apply.
                        </p>
                        <p>
                            In the US, there are two types: <strong>Unweighted GPA</strong> (standard 4.0 scale) and
                            <strong> Weighted GPA</strong> (can exceed 4.0 by giving extra credit for AP, IB, and Honors
                            courses). Most colleges look at both when evaluating your application.
                        </p>
                    </ExplanationBlock>

                    <ExplanationBlock title="How This GPA Calculator Works">
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            Your GPA is calculated by converting each letter grade to a number,
                            multiplying by that course's credits, adding everything up, and dividing by total credits.
                        </p>
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            <strong>The formula:</strong> GPA = Σ(Grade Points × Credits) ÷ Total Credits
                        </p>
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            For example, an A (4.0) in a 3-credit course contributes 12 grade points. A B (3.0) in a
                            4-credit course contributes 12 points. Your GPA would be 24 ÷ 7 = <strong>3.43</strong>.
                        </p>
                        <div style={{
                            background: "#f0f9ff",
                            border: "1px solid #0ea5e9",
                            borderRadius: "8px",
                            padding: "var(--space-4)",
                            marginTop: "var(--space-4)",
                            display: "flex",
                            gap: "var(--space-3)",
                            alignItems: "flex-start"
                        }}>
                            <IconIdea style={{ width: "24px", height: "24px", marginTop: "2px", flexShrink: 0 }} />
                            <div>
                                <strong style={{ color: "#0369a1" }}>Pro Tip:</strong> Toggle "Weighted" mode to see
                                how AP/Honors classes boost your GPA. AP courses add +1.0 and Honors add +0.5 to grade points.
                            </div>
                        </div>
                    </ExplanationBlock>

                    <ExampleBlock title="Example 1: Standard GPA Calculation">
                        <p style={{ marginBottom: "var(--space-3)" }}>
                            Let's say you have these courses this semester:
                        </p>
                        <ul style={{ marginLeft: "var(--space-4)", marginBottom: "var(--space-3)" }}>
                            <li><strong>Calculus:</strong> A (4.0) × 4 credits = 16 points</li>
                            <li><strong>English:</strong> B+ (3.3) × 3 credits = 9.9 points</li>
                            <li><strong>Biology:</strong> B (3.0) × 4 credits = 12 points</li>
                            <li><strong>History:</strong> A- (3.7) × 3 credits = 11.1 points</li>
                        </ul>
                        <p>
                            Total: 49 points ÷ 14 credits = <strong>3.50 GPA</strong>
                        </p>
                    </ExampleBlock>

                    <ExampleBlock title="Example 2: Weighted GPA with AP Classes">
                        <p style={{ marginBottom: "var(--space-3)" }}>
                            Here's how weighted GPA works with honors and AP courses:
                        </p>
                        <ul style={{ marginLeft: "var(--space-4)", marginBottom: "var(--space-3)" }}>
                            <li><strong>AP Calculus:</strong> A (4.0 + 1.0 = 5.0) × 4 credits = 20 points</li>
                            <li><strong>Honors English:</strong> B+ (3.3 + 0.5 = 3.8) × 3 credits = 11.4 points</li>
                            <li><strong>Biology:</strong> B (3.0) × 4 credits = 12 points</li>
                            <li><strong>AP History:</strong> A- (3.7 + 1.0 = 4.7) × 3 credits = 14.1 points</li>
                        </ul>
                        <p>
                            <strong>Unweighted:</strong> 3.50 → <strong>Weighted:</strong> 57.5 ÷ 14 = <strong>4.11 GPA</strong>
                        </p>
                    </ExampleBlock>

                    <ExampleBlock title="Example 3: Raising Your GPA (Before/After)">
                        <p style={{ marginBottom: "var(--space-3)" }}>
                            <strong>Scenario:</strong> You have a 2.8 GPA after 60 credits. Can you reach 3.0?
                        </p>
                        <div style={{ background: "#fef3c7", padding: "var(--space-3)", borderRadius: "6px", marginBottom: "var(--space-3)" }}>
                            <strong>Current:</strong> 2.8 GPA × 60 credits = 168 total grade points
                        </div>
                        <p style={{ marginBottom: "var(--space-2)" }}>
                            To reach 3.0 after 15 more credits (one semester), you need:
                        </p>
                        <ul style={{ marginLeft: "var(--space-4)", marginBottom: "var(--space-3)" }}>
                            <li>Target: 3.0 × 75 credits = 225 total points needed</li>
                            <li>You have: 168 points</li>
                            <li>Need: 225 - 168 = <strong>57 points in 15 credits</strong></li>
                            <li>Required semester GPA: 57 ÷ 15 = <strong>3.8 GPA</strong></li>
                        </ul>
                        <p style={{ color: "#166534", fontWeight: 600, display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                            <IconCheckCircle style={{ width: "20px", height: "20px", flexShrink: 0 }} />
                            This means you need mostly A- and B+ grades next semester to hit 3.0 cumulative.
                        </p>
                    </ExampleBlock>

                    <ExplanationBlock title="5 Proven Ways to Raise Your GPA">
                        <div style={{ display: "grid", gap: "var(--space-4)" }}>
                            <div style={{ display: "flex", gap: "var(--space-3)" }}>
                                <IconNumberCircle num={1} />
                                <div>
                                    <strong>Prioritize High-Credit Courses</strong>
                                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px" }}>
                                        A 4-credit class impacts your GPA more than a 2-credit elective. Focus extra
                                        study time on courses with the most credits.
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "var(--space-3)" }}>
                                <IconNumberCircle num={2} color="#f97316" />
                                <div>
                                    <strong>Use the Grade Replacement Policy</strong>
                                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px" }}>
                                        Many schools let you retake courses and replace bad grades. Check your
                                        institution's academic forgiveness policy.
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "var(--space-3)" }}>
                                <IconNumberCircle num={3} color="#8b5cf6" />
                                <div>
                                    <strong>Take Strategic Electives</strong>
                                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px" }}>
                                        Choose electives in subjects you're good at. An easy A in a 3-credit elective
                                        can significantly boost your cumulative GPA.
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "var(--space-3)" }}>
                                <IconNumberCircle num={4} color="#0ea5e9" />
                                <div>
                                    <strong>Don't Skip Class</strong>
                                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px" }}>
                                        Attendance often correlates directly with grades. Many professors include
                                        participation points, and you absorb more material in person.
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "var(--space-3)" }}>
                                <IconNumberCircle num={5} color="#ec4899" />
                                <div>
                                    <strong>Use Office Hours</strong>
                                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px" }}>
                                        Professors remember students who show up. You'll get exam hints, extra help,
                                        and possibly the benefit of the doubt on borderline grades.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ExplanationBlock>

                    <ExplanationBlock title="Understanding GPA Thresholds" defaultOpen={false}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                            <div>
                                <h4 style={{ marginBottom: "var(--space-2)" }}>High School</h4>
                                <ul style={{ marginLeft: "var(--space-4)" }}>
                                    <li><strong>3.5+</strong> — Excellent (competitive colleges)</li>
                                    <li><strong>3.0-3.5</strong> — Good (most colleges)</li>
                                    <li><strong>2.5-3.0</strong> — Average</li>
                                    <li><strong>Below 2.0</strong> — Academic warning</li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ marginBottom: "var(--space-2)" }}>College</h4>
                                <ul style={{ marginLeft: "var(--space-4)" }}>
                                    <li><strong>3.7+</strong> — Dean's List / Honors</li>
                                    <li><strong>3.0-3.7</strong> — Good standing</li>
                                    <li><strong>2.0-3.0</strong> — Satisfactory</li>
                                    <li><strong>Below 2.0</strong> — Academic probation</li>
                                </ul>
                            </div>
                        </div>
                    </ExplanationBlock>

                    <FAQSection items={gpaFAQs} />

                    <RelatedTools links={relatedLinks} title="Continue Your Analysis" />
                </div>
            </section >

            {/* FAQ Schema */}
            < script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(gpaFAQs)) }
                }
            />
        </>
    );
}
