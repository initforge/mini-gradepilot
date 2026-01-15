import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Final Grade Calculator - What Score Do I Need?",
    description:
        "Calculate what grade you need on your final exam to pass or get an A. Free weighted grade calculator shows exactly what score you need on remaining assignments.",
    keywords: [
        "final grade calculator",
        "what grade do I need",
        "grade calculator",
        "weighted grade calculator",
        "final exam calculator",
        "course grade calculator",
        "calculate final grade",
    ],
    openGraph: {
        title: "Final Grade Calculator",
        description:
            "Find out exactly what score you need on your final exam to reach your target grade.",
    },
};

export default function CourseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
