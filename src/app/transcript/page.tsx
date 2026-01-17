"use client";

import { useState, useEffect } from "react";
import {
    useAcademicStore,
    getSemesterGPA,
    getCumulativeGPA,
    calculateGPA
} from "@/lib/useAcademicStore";
import { IconBookOpen, IconTrendUp, IconTrendDown, IconTrendFlat, IconIdea, IconBalance, IconNote, IconEmpty } from "@/components/Icons";
import WorkspaceNav from "@/components/WorkspaceNav";
import ProfileSwitcher from "@/components/ProfileSwitcher";
import { SlideToggleButton, TabToggle, BubbleCTA } from "@/components/FancyButtons";
import { FAQSection, generateFAQSchema, RelatedTools, ExplanationBlock, ExampleBlock } from "@/components/SEOContent";

// Transcript FAQ Data
const transcriptFAQs = [
    {
        question: "How is cumulative GPA different from semester GPA?",
        answer: "Semester GPA only includes courses from that specific term. Cumulative GPA is your overall average across ALL semesters, weighted by credits. The more credits, the more that semester affects your cumulative."
    },
    {
        question: "Can one bad semester ruin my GPA?",
        answer: "It depends on how many credits you have. Early on, one bad semester hurts more. After 60+ credits, your GPA is harder to move in either direction. Use the GPA Workspace to model the impact."
    },
    {
        question: "What GPA do I need for Dean's List?",
        answer: "Most colleges require 3.5-3.7 for Dean's List, though some set it at 3.3. Check your school's specific policy. Usually you also need to be full-time (12+ credits)."
    },
    {
        question: "Does my GPA include transfer credits?",
        answer: "Typically no—transfer credits count toward graduation requirements but don't factor into your institutional GPA. However, graduate schools may recalculate including them."
    },
    {
        question: "How do I read an official transcript?",
        answer: "Look for Term GPA (that semester only), Cumulative GPA (all semesters), credit hours attempted vs. earned, and any notations like Dean's List, academic warning, or W (withdrawals)."
    },
    {
        question: "Will retaking a course replace my old grade?",
        answer: "Policies vary by school. Some do 'grade replacement' (only the new grade counts), others average both attempts, and some count both. Check your registrar's policy."
    }
];

const transcriptRelatedLinks = [
    {
        title: "GPA Workspace",
        description: "Manage semesters and edit course grades",
        href: "/gpa",
        accent: "#14b8a6"
    },
    {
        title: "Course Grade Analyzer",
        description: "Deep dive into individual course weights",
        href: "/course",
        accent: "#f97316"
    }
];

export default function TranscriptWorkspace() {
    const [mounted, setMounted] = useState(false);
    const [weighted, setWeighted] = useState(false);
    const [viewMode, setViewMode] = useState<"college" | "highschool">("college");

    const { profiles, activeProfileId, createProfile, _hasHydrated } = useAcademicStore();

    useEffect(() => {
        setMounted(true);
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
    const cumulativeGPA = calculateGPA(allCourses, weighted);
    const totalCredits = allCourses.reduce((sum, c) => sum + c.credits, 0);

    // Calculate averages for comparison
    const semesterGPAs = semesters.map((s, i) => ({
        semester: s,
        gpa: getSemesterGPA(s, weighted),
        cumulative: getCumulativeGPA(semesters, i, weighted),
    }));

    const avgGPA = semesterGPAs.length > 0
        ? semesterGPAs.reduce((sum, s) => sum + s.gpa, 0) / semesterGPAs.length
        : 0;

    // GPA Trend
    const getTrend = () => {
        if (semesterGPAs.length < 2) return "stable";
        const recent = semesterGPAs.slice(-2);
        const diff = recent[1].gpa - recent[0].gpa;
        if (diff > 0.1) return "up";
        if (diff < -0.1) return "down";
        return "stable";
    };
    const trend = getTrend();

    return (
        <>
            <WorkspaceNav current="transcript" />

            {/* Header */}
            <section style={{
                background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                color: "white",
                padding: "var(--space-6) 0",
            }}>
                <div className="container">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                            <IconBookOpen className="w-8 h-8" style={{ color: "white" }} />
                            <div>
                                <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 700, margin: 0, color: "white" }}>
                                    Transcript
                                </h1>
                                <p style={{ fontSize: "var(--text-sm)", opacity: 0.8, margin: 0, color: "white" }}>
                                    {semesters.length} semesters • Auto-synced from GPA Workspace
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", position: "relative" }}>
                            {/* Weighted Toggle */}
                            <SlideToggleButton
                                active={weighted}
                                onClick={() => setWeighted(!weighted)}
                                icon={<IconBalance style={{ width: 16, height: 16 }} />}
                                activeLabel="Weighted ON"
                                inactiveLabel="Weighted OFF"
                                activeColor="#8b5cf6"
                            />

                            {/* View Mode Toggle */}
                            <TabToggle
                                options={[
                                    { value: "college", label: "College" },
                                    { value: "highschool", label: "High School" }
                                ]}
                                selected={viewMode}
                                onChange={(v) => setViewMode(v as "college" | "highschool")}
                            />

                            <ProfileSwitcher />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="section" style={{ background: "#f8fafc" }}>
                <div className="container">
                    {semesters.length === 0 ? (
                        <div className="card" style={{
                            padding: "var(--space-12)",
                            textAlign: "center",
                            maxWidth: 500,
                            margin: "0 auto"
                        }}>
                            <IconEmpty style={{ width: "64px", height: "64px", margin: "0 auto var(--space-4) auto", opacity: 0.5 }} />
                            <h2>No Transcript Data</h2>
                            <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }}>
                                Your transcript is automatically generated from the GPA Workspace.
                                Add semesters and courses there to see your transcript.
                            </p>
                            <BubbleCTA href="/gpa">
                                → Go to GPA Workspace
                            </BubbleCTA>
                        </div>
                    ) : (
                        <>
                            {/* Top Stats Row */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: "var(--space-4)",
                                marginBottom: "var(--space-6)"
                            }}>
                                {/* Cumulative GPA */}
                                <div style={{
                                    background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                                    borderRadius: "var(--radius-xl)",
                                    padding: "var(--space-6)",
                                    color: "white",
                                    textAlign: "center",
                                }}>
                                    <div style={{ fontSize: "3rem", fontWeight: 800, lineHeight: 1, color: "white" }}>
                                        {cumulativeGPA.toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: "var(--text-sm)", opacity: 0.8, marginTop: "var(--space-1)", color: "white" }}>
                                        Cumulative GPA
                                    </div>
                                    <div style={{
                                        marginTop: "var(--space-2)",
                                        padding: "var(--space-1) var(--space-3)",
                                        background: "rgba(255,255,255,0.2)",
                                        borderRadius: "var(--radius-full)",
                                        fontSize: "var(--text-xs)",
                                        display: "inline-block",
                                        color: "white",
                                    }}>
                                        {trend === "up" && <><IconTrendUp style={{ width: "12px", height: "12px" }} /> Trending Up</>}
                                        {trend === "down" && <><IconTrendDown style={{ width: "12px", height: "12px" }} /> Trending Down</>}
                                        {trend === "stable" && <><IconTrendFlat style={{ width: "12px", height: "12px" }} /> Stable</>}
                                    </div>
                                </div>

                                {/* Semesters */}
                                <div className="card" style={{ padding: "var(--space-6)", textAlign: "center" }}>
                                    <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--color-primary)" }}>
                                        {semesters.length}
                                    </div>
                                    <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                                        Semesters
                                    </div>
                                </div>

                                {/* Total Courses */}
                                <div className="card" style={{ padding: "var(--space-6)", textAlign: "center" }}>
                                    <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--color-primary)" }}>
                                        {allCourses.length}
                                    </div>
                                    <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                                        Total Courses
                                    </div>
                                </div>

                                {/* Total Credits */}
                                <div className="card" style={{ padding: "var(--space-6)", textAlign: "center" }}>
                                    <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--color-primary)" }}>
                                        {totalCredits}
                                    </div>
                                    <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                                        Total Credits
                                    </div>
                                </div>
                            </div>

                            {/* Academic Record Table */}
                            <div className="card" style={{ overflow: "hidden" }}>
                                <div style={{
                                    background: "#1e293b",
                                    color: "white",
                                    padding: "var(--space-4)",
                                    fontWeight: 600,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}>
                                    <span style={{ color: "white" }}>Academic Record</span>
                                    <span style={{
                                        fontSize: "var(--text-sm)",
                                        opacity: 0.7,
                                        color: "white",
                                    }}>
                                        {viewMode === "college" ? "Semester View" : "Year View"}
                                    </span>
                                </div>

                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f1f5f9" }}>
                                            <th style={{ padding: "var(--space-3)", textAlign: "left", fontWeight: 600 }}>Term</th>
                                            <th style={{ padding: "var(--space-3)", textAlign: "center", fontWeight: 600 }}>Courses</th>
                                            <th style={{ padding: "var(--space-3)", textAlign: "center", fontWeight: 600 }}>Credits</th>
                                            <th style={{ padding: "var(--space-3)", textAlign: "center", fontWeight: 600 }}>Term GPA</th>
                                            <th style={{ padding: "var(--space-3)", textAlign: "center", fontWeight: 600 }}>Cumulative</th>
                                            <th style={{ padding: "var(--space-3)", textAlign: "center", fontWeight: 600 }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {semesterGPAs.map(({ semester, gpa, cumulative }) => {
                                            const isAboveAvg = gpa >= avgGPA;
                                            const credits = semester.courses.reduce((s, c) => s + c.credits, 0);

                                            return (
                                                <tr key={semester.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                                    <td style={{ padding: "var(--space-3)" }}>
                                                        <div style={{ fontWeight: 600 }}>{semester.name}</div>
                                                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                                                            {semester.term} {semester.year}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: "var(--space-3)", textAlign: "center" }}>
                                                        {semester.courses.length}
                                                    </td>
                                                    <td style={{ padding: "var(--space-3)", textAlign: "center" }}>
                                                        {credits}
                                                    </td>
                                                    <td style={{
                                                        padding: "var(--space-3)",
                                                        textAlign: "center",
                                                        fontWeight: 700,
                                                        color: isAboveAvg ? "var(--color-primary)" : "#f59e0b",
                                                    }}>
                                                        {gpa.toFixed(2)}
                                                    </td>
                                                    <td style={{
                                                        padding: "var(--space-3)",
                                                        textAlign: "center",
                                                        fontWeight: 700,
                                                    }}>
                                                        {cumulative.toFixed(2)}
                                                    </td>
                                                    <td style={{ padding: "var(--space-3)", textAlign: "center" }}>
                                                        <span style={{
                                                            padding: "var(--space-1) var(--space-2)",
                                                            background: isAboveAvg ? "#ecfdf5" : "#fef3c7",
                                                            color: isAboveAvg ? "#15803d" : "#92400e",
                                                            borderRadius: "var(--radius-sm)",
                                                            fontSize: "var(--text-xs)",
                                                            fontWeight: 600,
                                                        }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
                                                                {isAboveAvg ? <IconTrendUp style={{ width: "12px", height: "12px" }} /> : <IconTrendDown style={{ width: "12px", height: "12px" }} />}
                                                                {isAboveAvg ? "Above" : "Below"}
                                                            </div>
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Course Details by Semester */}
                            <h3 style={{ marginTop: "var(--space-8)", marginBottom: "var(--space-4)" }}>
                                Course Details
                            </h3>

                            {semesters.map((semester) => (
                                <div key={semester.id} className="card" style={{ marginBottom: "var(--space-4)", overflow: "hidden" }}>
                                    <div style={{
                                        background: "var(--color-primary)",
                                        color: "white",
                                        padding: "var(--space-3) var(--space-4)",
                                        fontWeight: 600,
                                    }}>
                                        <span style={{ color: "white" }}>{semester.name}</span>
                                        <span style={{
                                            marginLeft: "var(--space-2)",
                                            opacity: 0.8,
                                            fontSize: "var(--text-sm)",
                                            color: "white",
                                        }}>
                                            ({semester.courses.length} courses, {semester.courses.reduce((s, c) => s + c.credits, 0)} credits)
                                        </span>
                                    </div>

                                    <div style={{ padding: "var(--space-3)" }}>
                                        {semester.courses.length === 0 ? (
                                            <p style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "var(--space-4)" }}>
                                                No courses in this semester
                                            </p>
                                        ) : (
                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                                gap: "var(--space-2)",
                                            }}>
                                                {semester.courses.map((course) => (
                                                    <div
                                                        key={course.id}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            padding: "var(--space-2) var(--space-3)",
                                                            background: "#f8fafc",
                                                            borderRadius: "var(--radius-sm)",
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ fontWeight: 500, fontSize: "var(--text-sm)" }}>
                                                                {course.name}
                                                            </div>
                                                            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                                                                {course.credits} credits • {course.type}
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            fontWeight: 700,
                                                            color: "var(--color-primary)",
                                                            fontSize: "var(--text-lg)",
                                                        }}>
                                                            {course.grade}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Auto-Sync Note */}
                            <div style={{
                                marginTop: "var(--space-6)",
                                padding: "var(--space-4)",
                                background: "var(--color-primary-light)",
                                borderRadius: "var(--radius-lg)",
                                borderLeft: "4px solid var(--color-primary)",
                            }}>
                                <div style={{ fontWeight: 600, marginBottom: "var(--space-1)", display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                                    <IconNote style={{ width: "20px", height: "20px" }} />
                                    Auto-Synced
                                </div>
                                <p style={{
                                    fontSize: "var(--text-sm)",
                                    color: "var(--color-text-muted)",
                                    margin: 0,
                                }}>
                                    This transcript automatically reflects changes from your GPA Workspace.
                                    To add or edit courses, go to the GPA Workspace.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="section" style={{ background: "#f8fafc" }}>
                <div className="container container--narrow">
                    {/* Problem Framing */}
                    <ExplanationBlock title="Why Your Transcript Matters">
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            Your transcript is more than just a list of grades—it's your <strong>academic story</strong>.
                            Employers, graduate schools, and scholarship committees use it to evaluate your potential.
                        </p>
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            Understanding your transcript helps you:
                        </p>
                        <ul style={{ marginLeft: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                            <li><strong>Plan ahead:</strong> See what grades you need to hit your target GPA</li>
                            <li><strong>Spot trends:</strong> Are you improving or slipping?</li>
                            <li><strong>Make decisions:</strong> Should you retake a course? Add a minor?</li>
                            <li><strong>Meet requirements:</strong> Hit the GPA threshold for scholarships, honors, or grad school</li>
                        </ul>
                    </ExplanationBlock>

                    <ExplanationBlock title="GPA Requirements: What You Need to Know">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                            <div style={{ background: "#ecfdf5", padding: "var(--space-4)", borderRadius: "8px" }}>
                                <h4 style={{ margin: 0, marginBottom: "var(--space-2)", color: "#15803d" }}>Scholarships</h4>
                                <ul style={{ marginLeft: "var(--space-3)", fontSize: "var(--text-sm)" }}>
                                    <li><strong>Merit scholarships:</strong> 3.5+ GPA</li>
                                    <li><strong>Renewal requirements:</strong> 3.0+ GPA</li>
                                    <li><strong>Competitive awards:</strong> 3.7+ GPA</li>
                                </ul>
                            </div>
                            <div style={{ background: "#f0f9ff", padding: "var(--space-4)", borderRadius: "8px" }}>
                                <h4 style={{ margin: 0, marginBottom: "var(--space-2)", color: "#0369a1" }}>Graduate School</h4>
                                <ul style={{ marginLeft: "var(--space-3)", fontSize: "var(--text-sm)" }}>
                                    <li><strong>Most programs:</strong> 3.0+ GPA</li>
                                    <li><strong>Top programs:</strong> 3.5+ GPA</li>
                                    <li><strong>PhD programs:</strong> 3.7+ GPA</li>
                                </ul>
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
                                <strong style={{ color: "#0369a1" }}>Pro Tip:</strong> Many programs look at your last 60 credits more closely
                                than your overall GPA. A strong junior/senior year can offset a weak start.
                            </div>
                        </div>
                    </ExplanationBlock>

                    <ExplanationBlock title="How Cumulative GPA Works">
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            Your cumulative GPA is a running total of all your academic work.
                            Each semester's courses get weighted by their credits and added to the overall calculation.
                        </p>
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            <strong>Important insight:</strong> The more credits you've earned, the harder it becomes
                            to significantly change your GPA. A bad semester hurts more when you're a freshman than a senior.
                        </p>
                        <p>
                            This transcript auto-syncs with your GPA Workspace, so any changes you make there
                            are reflected here immediately.
                        </p>
                    </ExplanationBlock>

                    <ExampleBlock title="How One Semester Affects Cumulative GPA">
                        <p style={{ marginBottom: "var(--space-3)" }}>
                            Suppose you have a <strong>3.2 cumulative GPA</strong> after <strong>30 credits</strong>.
                            That's 96 total grade points (3.2 × 30).
                        </p>
                        <p style={{ marginBottom: "var(--space-3)" }}>
                            You take 15 new credits and get a <strong>3.8 semester GPA</strong>, earning 57 points.
                        </p>
                        <p>
                            New cumulative: (96 + 57) ÷ 45 = <strong>3.40 GPA</strong>.
                            That stellar semester raised your GPA by 0.20!
                        </p>
                    </ExampleBlock>

                    <ExplanationBlock title="Understanding Your Trend" defaultOpen={false}>
                        <p style={{ marginBottom: "var(--space-4)" }}>
                            The trend indicator shows if your recent performance is above or below your average:
                        </p>
                        <ul style={{ marginLeft: "var(--space-4)", marginBottom: "var(--space-4)", listStyle: "none", display: "grid", gap: "var(--space-2)" }}>
                            <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                                <IconTrendUp style={{ width: "20px", height: "20px" }} /> <strong>Trending Up:</strong> Your recent semester was better than your average
                            </li>
                            <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                                <IconTrendDown style={{ width: "20px", height: "20px" }} /> <strong>Trending Down:</strong> Your recent semester was below your average
                            </li>
                            <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                                <IconTrendFlat style={{ width: "20px", height: "20px" }} /> <strong>Stable:</strong> You're performing consistently
                            </li>
                        </ul>
                        <div style={{
                            background: "#fdf2f2",
                            border: "1px solid #ef4444",
                            borderRadius: "8px",
                            padding: "var(--space-4)",
                            marginTop: "var(--space-4)",
                            display: "flex",
                            gap: "var(--space-3)",
                            alignItems: "flex-start"
                        }}>
                            <IconIdea style={{ width: "24px", height: "24px", marginTop: "2px", flexShrink: 0, color: "#ef4444" }} />
                            <div>
                                <strong style={{ color: "#b91c1c" }}>Pro Tip:</strong> If you're trending down, use the GPA Workspace to
                                see what grades you need next semester to get back on track.
                            </div>
                        </div>
                    </ExplanationBlock>

                    <FAQSection items={transcriptFAQs} />

                    <RelatedTools links={transcriptRelatedLinks} title="Continue Your Analysis" />
                </div>
            </section>

            {/* FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(transcriptFAQs)) }}
            />
        </>
    );
}
