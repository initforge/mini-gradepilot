import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "GPA Calculator for US High School & College Students | Free",
    description:
        "Calculate your weighted or unweighted GPA instantly. Free GPA calculator for US students using the 4.0 scale. Track semesters, analyze grades, and reach your academic goals.",
    keywords: [
        "GPA calculator",
        "college GPA calculator",
        "high school GPA calculator",
        "weighted GPA calculator",
        "unweighted GPA",
        "4.0 scale",
        "calculate GPA",
        "grade point average",
    ],
    openGraph: {
        title: "GPA Calculator for US Students",
        description:
            "Free GPA calculator using the 4.0 scale. Calculate weighted and unweighted GPA for high school and college.",
    },
};

export default function GPALayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
