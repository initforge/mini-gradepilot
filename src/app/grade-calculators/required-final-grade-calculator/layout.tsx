import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Required Final Grade Calculator - What Do I Need on My Final?",
    description:
        "Calculate what score you need on your final exam to reach your target grade. Free calculator with what-if scenarios.",
    keywords: ["required final grade calculator", "what grade do I need", "final exam calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
