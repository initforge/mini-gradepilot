import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "GPA Calculator - Calculate Your Grade Point Average",
    description:
        "Free GPA calculator for US students. Calculate your GPA, see course impact analysis, and identify which courses to focus on for maximum improvement.",
    keywords: ["GPA calculator", "grade point average", "college GPA", "calculate GPA"],
};

export default function GPACalculatorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        name: "GPA Calculator",
                        applicationCategory: "EducationalApplication",
                        operatingSystem: "Web",
                        offers: {
                            "@type": "Offer",
                            price: "0",
                            priceCurrency: "USD",
                        },
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: "4.8",
                            ratingCount: "150",
                        },
                        description:
                            "Free GPA calculator with impact analysis for US students.",
                    }),
                }}
            />

            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            {
                                "@type": "ListItem",
                                position: 1,
                                name: "Home",
                                item: "https://gradepilot.org",
                            },
                            {
                                "@type": "ListItem",
                                position: 2,
                                name: "GPA Calculators",
                                item: "https://gradepilot.org/gpa-calculators",
                            },
                            {
                                "@type": "ListItem",
                                position: 3,
                                name: "GPA Calculator",
                                item: "https://gradepilot.org/gpa-calculators/gpa-calculator",
                            },
                        ],
                    }),
                }}
            />

            {/* FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "What is a good GPA?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "For college admissions: 3.5+ is competitive for most universities, 3.7+ for selective schools, and 3.9+ for Ivy League.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "How can I improve my GPA quickly?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Focus on high-credit courses where you have room for improvement. A B→A jump in a 4-credit course has more impact than an A in a 1-credit elective.",
                                },
                            },
                        ],
                    }),
                }}
            />
        </>
    );
}
