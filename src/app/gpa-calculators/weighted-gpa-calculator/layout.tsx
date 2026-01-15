import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Weighted GPA Calculator - Calculate with Honors & AP Bonuses",
    description:
        "Calculate your weighted GPA including Honors (+0.5) and AP/IB (+1.0) course bonuses. Free calculator for US high school students.",
    keywords: ["weighted GPA calculator", "honors GPA", "AP GPA", "IB GPA"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
