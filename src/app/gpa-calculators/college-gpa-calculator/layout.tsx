import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "College GPA Calculator - Track Cumulative GPA Across Semesters",
    description:
        "Calculate your cumulative college GPA across multiple semesters. Track trends and see your academic progress over time.",
    keywords: ["college GPA calculator", "cumulative GPA", "semester GPA", "university GPA"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
