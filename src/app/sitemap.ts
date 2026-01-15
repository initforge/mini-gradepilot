import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://gradepilot.org";
    const lastModified = new Date();

    const routes = [
        "",
        // Core Workspaces
        "/gpa",
        "/course",
        "/transcript",
        // GPA Calculators
        "/gpa-calculators/gpa-calculator",
        "/gpa-calculators/weighted-gpa-calculator",
        "/gpa-calculators/college-gpa-calculator",
        "/gpa-calculators/high-school-gpa-calculator",
        // Grade Calculators
        "/grade-calculators/final-grade-calculator",
        "/grade-calculators/required-final-grade-calculator",
        // Converters & Utilities
        "/converters/percentage-to-gpa",
        "/attendance/attendance-percentage-calculator",
        // Info Pages
        "/about",
        "/privacy",
        "/terms",
        "/contact",
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : route.includes("gpa-calculator") ? 0.9 : 0.8,
    }));
}
