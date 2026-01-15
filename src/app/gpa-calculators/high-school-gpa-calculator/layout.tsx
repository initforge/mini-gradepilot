import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "High School GPA Calculator - Calculate Your 4-Year GPA",
    description:
        "Calculate your cumulative high school GPA from Freshman to Senior year. Track your academic progress for college applications.",
    keywords: ["high school GPA calculator", "cumulative GPA", "freshman sophomore junior senior GPA"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
