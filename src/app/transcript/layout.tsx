import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cumulative GPA Calculator - Track Your Academic Progress",
    description:
        "Calculate your cumulative GPA across all semesters. See how each term affects your overall GPA. Free transcript-style view for US college and high school students.",
    keywords: [
        "cumulative GPA calculator",
        "semester GPA",
        "transcript GPA",
        "academic progress",
        "calculate cumulative GPA",
        "college transcript",
        "GPA trend",
    ],
    openGraph: {
        title: "Cumulative GPA Calculator",
        description:
            "Track your cumulative GPA across all semesters and see your academic progress.",
    },
};

export default function TranscriptLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
