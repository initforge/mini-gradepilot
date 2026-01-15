import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Final Grade Calculator - Calculate Weighted Course Average",
    description:
        "Calculate your final course grade based on weighted categories. Free grade calculator for US students.",
    keywords: ["final grade calculator", "weighted average calculator", "course grade calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
