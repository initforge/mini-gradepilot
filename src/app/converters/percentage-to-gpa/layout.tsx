import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Percentage to GPA Converter - Convert % to 4.0 Scale",
    description:
        "Convert percentage scores to GPA on the US 4.0 scale. Free converter with reference table.",
    keywords: ["percentage to GPA", "convert percentage to GPA", "GPA converter"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
