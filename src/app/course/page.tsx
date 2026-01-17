"use client";

import { useState, useEffect } from "react";
import { useAcademicStore, gradeToGPA, gradeOptions } from "@/lib/useAcademicStore";
import { IconScale, IconTarget, IconChartPie, IconIdea, IconLink, IconUnlock, IconAlert } from "@/components/Icons";
import { DeleteButton, AddButton } from "@/components/AnimatedButtons";
import WorkspaceNav from "@/components/WorkspaceNav";
import ProfileSwitcher from "@/components/ProfileSwitcher";
import { OutlineButton, FancyDropdown } from "@/components/FancyButtons";
import { FAQSection, generateFAQSchema, RelatedTools, ExplanationBlock, ExampleBlock } from "@/components/SEOContent";

// Course Analyzer FAQ Data
const courseFAQs = [
    {
        question: "How much does the final exam affect my grade?",
        answer: "It depends on the weight. If your final is worth 40% of your grade, it has a huge impact. A 10-point difference on a 40% exam changes your overall grade by 4 points. Use the breakdown table to see exactly."
    },
    {
        question: "What grade do I need on the final to pass?",
        answer: "Enter your current scores above, then set your target grade. The calculator shows exactly what percentage you need on remaining assignments to hit that target."
    },
    {
        question: "Can I still get an A if I failed the midterm?",
        answer: "Maybe! It depends on what percentage the midterm was worth and how much grading weight remains. If 60%+ of your grade is still ahead, an A could be possible with perfect scores."
    },
    {
        question: "How do I calculate weighted average for grades?",
        answer: "Multiply each score by its percentage weight, sum them up, then divide by total weight. For example: (85 × 0.30) + (90 × 0.70) = 25.5 + 63 = 88.5%."
    },
    {
        question: "What if my professor curves grades?",
        answer: "This calculator shows your raw percentage. Curves are applied by professors after—add a few points to your target if you expect a curve, or aim for the curved cutoff."
    },
    {
        question: "Should I drop a class if I'm failing?",
        answer: "Consider the drop deadline, whether it affects financial aid, and if you can retake it. Use the GPA Workspace to see how an F vs. a W affects your cumulative GPA."
    }
];

const courseRelatedLinks = [
    {
        title: "GPA Workspace",
        description: "Add this course to your GPA calculation",
        href: "/gpa",
        accent: "#14b8a6"
    },
    {
        title: "Transcript Workspace",
        description: "See how this semester affects cumulative GPA",
        href: "/transcript",
        accent: "#8b5cf6"
    }
];

interface Category {
    id: string;
    name: string;
    weight: number;
    score: number | null;
    maxScore: number;
}

export default function CourseAnalyzer() {
    const [mounted, setMounted] = useState(false);
    const [tempMode, setTempMode] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);

    // Temp mode state
    const [tempCourseName, setTempCourseName] = useState("Untitled Course");
    const [targetGrade, setTargetGrade] = useState("B");
    const [categories, setCategories] = useState<Category[]>([
        { id: "1", name: "Homework", weight: 20, score: null, maxScore: 100 },
        { id: "2", name: "Quizzes", weight: 15, score: null, maxScore: 100 },
        { id: "3", name: "Midterm", weight: 25, score: null, maxScore: 100 },
        { id: "4", name: "Final Exam", weight: 40, score: null, maxScore: 100 },
    ]);

    const { getActiveProfile, profiles, createProfile, _hasHydrated } = useAcademicStore();

    useEffect(() => {
        setMounted(true);
        if (_hasHydrated && profiles.length === 0) {
            createProfile("My Profile");
        }
    }, [_hasHydrated, profiles.length, createProfile]);

    if (!mounted) {
        return <div style={{ minHeight: "100vh", background: "#f8fafc" }} />;
    }

    const profile = getActiveProfile();
    const allCourses = profile?.semesters.flatMap((s) =>
        s.courses.map((c) => ({ ...c, semesterName: s.name, semesterId: s.id }))
    ) || [];

    const selectedCourse = allCourses.find((c) => c.id === selectedCourseId);

    // Calculate current grade
    const completedCategories = categories.filter((c) => c.score !== null);
    const completedWeight = completedCategories.reduce((sum, c) => sum + c.weight, 0);
    const earnedPoints = completedCategories.reduce((sum, c) => sum + (c.score! / c.maxScore) * c.weight, 0);
    const currentPercentage = completedWeight > 0 ? (earnedPoints / completedWeight) * 100 : 0;

    // Calculate what's needed for target
    const remainingWeight = 100 - completedWeight;
    const targetPercentage = gradeToGPA[targetGrade] === 4.0 ? 93 :
        gradeToGPA[targetGrade] >= 3.7 ? 90 :
            gradeToGPA[targetGrade] >= 3.3 ? 87 :
                gradeToGPA[targetGrade] >= 3.0 ? 83 :
                    gradeToGPA[targetGrade] >= 2.7 ? 80 :
                        gradeToGPA[targetGrade] >= 2.3 ? 77 :
                            gradeToGPA[targetGrade] >= 2.0 ? 73 :
                                gradeToGPA[targetGrade] >= 1.7 ? 70 : 60;

    const neededFromRemaining = remainingWeight > 0
        ? ((targetPercentage - earnedPoints) / remainingWeight) * 100
        : 0;

    const isAchievable = neededFromRemaining <= 100 && neededFromRemaining >= 0;

    const addCategory = () => {
        const newId = Math.random().toString(36).substring(2, 9);
        setCategories([...categories, { id: newId, name: "New Category", weight: 0, score: null, maxScore: 100 }]);
    };

    const updateCategory = (id: string, updates: Partial<Category>) => {
        setCategories(categories.map((c) => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteCategory = (id: string) => {
        setCategories(categories.filter((c) => c.id !== id));
    };

    const clearAllCategories = () => {
        setCategories([]);
    };

    const getCurrentLetterGrade = (pct: number) => {
        if (pct >= 93) return "A";
        if (pct >= 90) return "A-";
        if (pct >= 87) return "B+";
        if (pct >= 83) return "B";
        if (pct >= 80) return "B-";
        if (pct >= 77) return "C+";
        if (pct >= 73) return "C";
        if (pct >= 70) return "C-";
        if (pct >= 67) return "D+";
        if (pct >= 63) return "D";
        if (pct >= 60) return "D-";
        return "F";
    };

    return (
        <>
            <WorkspaceNav current="course" />

            {/* Header */}
            <section style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "white",
                padding: "var(--space-6) 0",
            }}>
                <div className="container">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                            <IconScale className="w-8 h-8" />
                            <div>
                                <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 700, margin: 0, color: "white" }}>Course Grade Analyzer</h1>
                                <p style={{ fontSize: "var(--text-sm)", opacity: 0.8, margin: 0 }}>
                                    {tempMode ? "Temporary Mode" : "Linked to GPA Workspace"} • Break down, project, succeed
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                            {/* Temp Mode Toggle */}
                            <OutlineButton
                                active={!tempMode}
                                onClick={() => setTempMode(!tempMode)}
                                icon={tempMode
                                    ? <IconUnlock style={{ width: 18, height: 18 }} />
                                    : <IconLink style={{ width: 18, height: 18 }} />
                                }
                                label={tempMode ? "Temp Mode" : "Linked Mode"}
                                activeColor="#f97316"
                            />

                            <ProfileSwitcher />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="section" style={{ background: "#f8fafc" }}>
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "var(--space-8)" }}>

                        {/* Left: Grade Breakdown */}
                        <div>
                            {/* Course Selector or Temp Input */}
                            <div className="card" style={{ marginBottom: "var(--space-4)", padding: "var(--space-4)" }}>
                                {tempMode ? (
                                    <div>
                                        <label style={{ fontWeight: 600, marginBottom: "var(--space-2)", display: "block" }}>
                                            Course Name (Temp)
                                        </label>
                                        <input
                                            type="text"
                                            value={tempCourseName}
                                            onChange={(e) => setTempCourseName(e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "var(--space-3)",
                                                border: "2px solid var(--color-border)",
                                                borderRadius: "var(--radius-md)",
                                                fontSize: "var(--text-lg)",
                                                fontWeight: 600,
                                            }}
                                        />
                                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-2)" }}>
                                            This course won't sync to your GPA Workspace.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <label style={{ fontWeight: 600, marginBottom: "var(--space-2)", display: "block" }}>
                                            Select Course from GPA Workspace
                                        </label>
                                        {allCourses.length === 0 ? (
                                            <div style={{
                                                padding: "var(--space-6)",
                                                textAlign: "center",
                                                background: "#f8fafc",
                                                borderRadius: "var(--radius-md)",
                                            }}>
                                                <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
                                                    No courses in GPA Workspace yet.
                                                </p>
                                                <a
                                                    href="/gpa"
                                                    style={{
                                                        color: "var(--color-primary)",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    → Add courses in GPA Workspace
                                                </a>
                                                <p style={{
                                                    fontSize: "var(--text-sm)",
                                                    color: "var(--color-text-muted)",
                                                    marginTop: "var(--space-3)"
                                                }}>
                                                    Or enable Temp Mode above for quick calculations
                                                </p>
                                            </div>
                                        ) : (
                                            <select
                                                value={selectedCourseId || ""}
                                                onChange={(e) => {
                                                    setSelectedCourseId(e.target.value);
                                                    const course = allCourses.find((c) => c.id === e.target.value);
                                                    if (course) setSelectedSemesterId(course.semesterId);
                                                }}
                                                style={{
                                                    width: "100%",
                                                    padding: "var(--space-3)",
                                                    border: "2px solid var(--color-border)",
                                                    borderRadius: "var(--radius-md)",
                                                    fontSize: "var(--text-lg)",
                                                }}
                                            >
                                                <option value="">-- Select a course --</option>
                                                {allCourses.map((course) => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name} ({course.semesterName})
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Categories Table */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "var(--space-3)"
                            }}>
                                <h2 style={{ margin: 0 }}>Grade Breakdown</h2>
                                <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                                    {categories.length > 0 && (
                                        <DeleteButton
                                            onClick={clearAllCategories}
                                            label="Clear"
                                        />
                                    )}
                                    <AddButton
                                        onClick={addCategory}
                                        label="Add Category"
                                        color="orange"
                                    />
                                </div>
                            </div>

                            <div className="card" style={{ overflow: "hidden" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f1f5f9" }}>
                                            <th style={{ padding: "var(--space-3)", textAlign: "left", fontWeight: 600 }}>Category</th>
                                            <th style={{ padding: "var(--space-3)", textAlign: "center", fontWeight: 600, width: 80 }}>Weight</th>
                                            <th style={{ padding: "var(--space-3)", textAlign: "center", fontWeight: 600, width: 80 }}>Score</th>
                                            <th style={{ padding: "var(--space-3)", textAlign: "center", fontWeight: 600, width: 80 }}>Max</th>
                                            <th style={{ padding: "var(--space-3)", textAlign: "center", fontWeight: 600, width: 80 }}>%</th>
                                            <th style={{ padding: "var(--space-3)", width: 40 }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((cat) => (
                                            <tr key={cat.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                                <td style={{ padding: "var(--space-2)" }}>
                                                    <input
                                                        type="text"
                                                        value={cat.name}
                                                        onChange={(e) => updateCategory(cat.id, { name: e.target.value })}
                                                        style={{
                                                            width: "100%",
                                                            padding: "var(--space-2)",
                                                            border: "1px solid var(--color-border)",
                                                            borderRadius: "var(--radius-sm)",
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ padding: "var(--space-2)", textAlign: "center" }}>
                                                    <input
                                                        type="number"
                                                        value={cat.weight}
                                                        onChange={(e) => updateCategory(cat.id, { weight: parseInt(e.target.value) || 0 })}
                                                        style={{
                                                            width: 60,
                                                            padding: "var(--space-2)",
                                                            border: "1px solid var(--color-border)",
                                                            borderRadius: "var(--radius-sm)",
                                                            textAlign: "center",
                                                        }}
                                                    />
                                                    <span style={{ marginLeft: 4 }}>%</span>
                                                </td>
                                                <td style={{ padding: "var(--space-2)", textAlign: "center" }}>
                                                    <input
                                                        type="number"
                                                        value={cat.score ?? ""}
                                                        onChange={(e) => updateCategory(cat.id, {
                                                            score: e.target.value === "" ? null : parseFloat(e.target.value)
                                                        })}
                                                        placeholder="—"
                                                        style={{
                                                            width: 60,
                                                            padding: "var(--space-2)",
                                                            border: "1px solid var(--color-border)",
                                                            borderRadius: "var(--radius-sm)",
                                                            textAlign: "center",
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ padding: "var(--space-2)", textAlign: "center" }}>
                                                    <input
                                                        type="number"
                                                        value={cat.maxScore}
                                                        onChange={(e) => updateCategory(cat.id, { maxScore: parseInt(e.target.value) || 100 })}
                                                        style={{
                                                            width: 60,
                                                            padding: "var(--space-2)",
                                                            border: "1px solid var(--color-border)",
                                                            borderRadius: "var(--radius-sm)",
                                                            textAlign: "center",
                                                        }}
                                                    />
                                                </td>
                                                <td style={{
                                                    padding: "var(--space-2)",
                                                    textAlign: "center",
                                                    fontWeight: 600,
                                                    color: cat.score !== null
                                                        ? (cat.score / cat.maxScore) >= 0.9 ? "#22c55e"
                                                            : (cat.score / cat.maxScore) >= 0.8 ? "#14b8a6"
                                                                : (cat.score / cat.maxScore) >= 0.7 ? "#f59e0b"
                                                                    : "#ef4444"
                                                        : "var(--color-text-muted)"
                                                }}>
                                                    {cat.score !== null
                                                        ? ((cat.score / cat.maxScore) * 100).toFixed(1) + "%"
                                                        : "—"
                                                    }
                                                </td>
                                                <td style={{ padding: "var(--space-2)" }}>
                                                    <button
                                                        onClick={() => deleteCategory(cat.id)}
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
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {categories.length === 0 && (
                                    <div style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--color-text-muted)" }}>
                                        <p>No categories yet. Add grading categories above.</p>
                                    </div>
                                )}
                            </div>

                            {/* Weight Warning */}
                            {categories.reduce((sum, c) => sum + c.weight, 0) !== 100 && categories.length > 0 && (
                                <div style={{
                                    marginTop: "var(--space-3)",
                                    padding: "var(--space-3)",
                                    background: "#fef3c7",
                                    border: "1px solid #f59e0b",
                                    borderRadius: "var(--radius-md)",
                                    color: "#92400e",
                                    fontSize: "var(--text-sm)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--space-2)",
                                }}>
                                    <IconAlert style={{ width: "16px", height: "16px", flexShrink: 0 }} />
                                    Weights sum to {categories.reduce((sum, c) => sum + c.weight, 0)}%, should be 100%
                                </div>
                            )}
                        </div>

                        {/* Right: Grade Snapshot & Target */}
                        <div>
                            {/* Current Grade */}
                            <div style={{
                                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                                borderRadius: "var(--radius-xl)",
                                padding: "var(--space-6)",
                                color: "white",
                                textAlign: "center",
                                marginBottom: "var(--space-4)",
                            }}>
                                <div style={{ fontSize: "4rem", fontWeight: 800, lineHeight: 1 }}>
                                    {getCurrentLetterGrade(currentPercentage)}
                                </div>
                                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 600, marginTop: "var(--space-2)" }}>
                                    {currentPercentage.toFixed(1)}%
                                </div>
                                <div style={{ fontSize: "var(--text-sm)", opacity: 0.8, marginTop: "var(--space-1)" }}>
                                    Based on {completedWeight}% of grade
                                </div>
                            </div>

                            {/* Target Mode */}
                            <div className="card" style={{ padding: "var(--space-4)" }}>
                                <h3 style={{ marginBottom: "var(--space-3)", display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                                    <IconTarget style={{ width: "24px", height: "24px" }} />
                                    Target Grade
                                </h3>
                                <FancyDropdown
                                    options={gradeOptions}
                                    value={targetGrade}
                                    onChange={setTargetGrade}
                                />

                                {remainingWeight > 0 ? (
                                    <div style={{
                                        padding: "var(--space-4)",
                                        background: isAchievable ? "#ecfdf5" : "#fef2f2",
                                        border: `1px solid ${isAchievable ? "#22c55e" : "#ef4444"}`,
                                        borderRadius: "var(--radius-md)",
                                        textAlign: "center",
                                    }}>
                                        <div style={{
                                            fontSize: "var(--text-sm)",
                                            color: isAchievable ? "#15803d" : "#b91c1c",
                                            marginBottom: "var(--space-2)",
                                        }}>
                                            To get a {targetGrade}, you need:
                                        </div>
                                        <div style={{
                                            fontSize: "var(--text-3xl)",
                                            fontWeight: 800,
                                            color: isAchievable ? "#15803d" : "#b91c1c",
                                        }}>
                                            {isAchievable ? `${neededFromRemaining.toFixed(1)}%` : "N/A"}
                                        </div>
                                        <div style={{
                                            fontSize: "var(--text-sm)",
                                            color: "var(--color-text-muted)",
                                            marginTop: "var(--space-1)",
                                        }}>
                                            on remaining {remainingWeight}% of grade
                                        </div>
                                        {!isAchievable && (
                                            <div style={{
                                                marginTop: "var(--space-2)",
                                                fontSize: "var(--text-xs)",
                                                color: "#b91c1c",
                                            }}>
                                                Not mathematically achievable
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{
                                        padding: "var(--space-4)",
                                        background: "#f0fdf4",
                                        borderRadius: "var(--radius-md)",
                                        textAlign: "center",
                                        color: "#15803d",
                                    }}>
                                        All grades are in! Your final grade is {getCurrentLetterGrade(currentPercentage)}.
                                    </div>
                                )}
                            </div>

                            {/* What-If Scenarios */}
                            {remainingWeight > 0 && (
                                <div className="card" style={{ padding: "var(--space-4)", marginTop: "var(--space-4)" }}>
                                    <h3 style={{ marginBottom: "var(--space-3)", display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                                        <IconChartPie style={{ width: "24px", height: "24px" }} />
                                        What-If Scenarios
                                    </h3>
                                    {[100, 95, 90, 85, 80].map((scenario) => {
                                        const projected = earnedPoints + (scenario / 100) * remainingWeight;
                                        return (
                                            <div
                                                key={scenario}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    padding: "var(--space-2) 0",
                                                    borderBottom: "1px solid var(--color-border)",
                                                }}
                                            >
                                                <span>If you score {scenario}%</span>
                                                <span style={{ fontWeight: 600 }}>
                                                    {getCurrentLetterGrade(projected)} ({projected.toFixed(1)}%)
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="section" style={{ background: "#f8fafc" }}>
                <div className="container container--narrow">
                    {/* Problem Framing */}
                    <ExplanationBlock title="Why Track Your Course Grades?">
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            Ever walked into a final exam wondering <strong>"What do I actually need to pass?"</strong>
                            Most students don't realize that a single exam can make or break their entire semester—especially
                            when it's worth 30-50% of the final grade.
                        </p>
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            This calculator answers the questions that keep students up at night:
                        </p>
                        <ul style={{ marginLeft: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                            <li><strong>"Can I still get an A if I bombed the midterm?"</strong></li>
                            <li><strong>"What if I skip the final—will I still pass?"</strong></li>
                            <li><strong>"Is it worth pulling an all-nighter for 3 extra points?"</strong></li>
                        </ul>
                        <p>
                            By breaking down your syllabus into weighted categories, you'll see exactly where you stand
                            and what's possible. <strong>No more guessing.</strong>
                        </p>
                    </ExplanationBlock>

                    <ExplanationBlock title="How Final Grade Calculation Works">
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            Your final grade is a <strong>weighted average</strong> of all your assignments.
                            Each category (homework, quizzes, exams) has a percentage weight from your syllabus.
                        </p>
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            <strong>Key insight:</strong> A category worth 40% affects your grade 4x more than
                            a category worth 10%. Focus your effort where it counts most.
                        </p>
                        <p>
                            This calculator shows your current standing and exactly what you need to score on
                            remaining work to hit your target grade.
                        </p>
                    </ExplanationBlock>

                    <ExampleBlock title="Example: What Do I Need on the Final?">
                        <p style={{ marginBottom: "var(--space-3)" }}>
                            Your grades so far:
                        </p>
                        <ul style={{ marginLeft: "var(--space-4)", marginBottom: "var(--space-3)" }}>
                            <li><strong>Homework (20%):</strong> 88%</li>
                            <li><strong>Quizzes (15%):</strong> 85%</li>
                            <li><strong>Midterm (25%):</strong> 78%</li>
                            <li><strong>Final Exam (40%):</strong> ???</li>
                        </ul>
                        <p style={{ marginBottom: "var(--space-3)" }}>
                            <strong>Current earned points:</strong> (88×0.20) + (85×0.15) + (78×0.25) = 17.6 + 12.75 + 19.5 = <strong>49.85 points</strong> (out of 60% completed)
                        </p>
                        <p>
                            <strong>To get a B (83%):</strong> You need 83 - 49.85 = 33.15 more points from the final.
                            With 40% remaining: 33.15 ÷ 0.40 = <strong>82.9% on the final</strong>.
                        </p>
                    </ExampleBlock>

                    <ExplanationBlock title="Why Weight Categories Matter" defaultOpen={false}>
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            Not all assignments are equal. Here's a typical breakdown:
                        </p>
                        <div style={{ background: "#f1f5f9", padding: "var(--space-4)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-4)" }}>
                                <div>
                                    <strong>High Impact (30-50%)</strong>
                                    <ul style={{ marginLeft: "var(--space-4)", fontSize: "var(--text-sm)" }}>
                                        <li>Final exams</li>
                                        <li>Midterm exams</li>
                                        <li>Major projects</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong>Medium Impact (15-25%)</strong>
                                    <ul style={{ marginLeft: "var(--space-4)", fontSize: "var(--text-sm)" }}>
                                        <li>Quizzes</li>
                                        <li>Lab work</li>
                                        <li>Presentations</li>
                                    </ul>
                                </div>
                                <div>
                                    <strong>Lower Impact (5-15%)</strong>
                                    <ul style={{ marginLeft: "var(--space-4)", fontSize: "var(--text-sm)" }}>
                                        <li>Homework</li>
                                        <li>Participation</li>
                                        <li>Attendance</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
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
                                <strong style={{ color: "#0369a1" }}>Pro Tip:</strong> Getting 100% on homework (10% weight) helps less than
                                getting 5 extra points on the final (40% weight).
                            </div>
                        </div>
                    </ExplanationBlock>

                    <FAQSection items={courseFAQs} />

                    <RelatedTools links={courseRelatedLinks} title="Continue Your Analysis" />
                </div>
            </section>

            {/* FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(courseFAQs)) }}
            />
        </>
    );
}
