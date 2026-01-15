import Link from "next/link";
import { GradePilotLogo } from "./Icons";

const workspaceLinks = [
    { name: "GPA Workspace", href: "/gpa", desc: "Analyze & plan your GPA" },
    { name: "Course Analyzer", href: "/course", desc: "Grade breakdown & projections" },
    { name: "Transcript", href: "/transcript", desc: "Track cumulative GPA" },
];

const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
];

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__grid">
                    <div className="footer__brand">
                        <div className="footer__brand-name" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                            <GradePilotLogo className="w-8 h-8" />
                            GradePilot
                        </div>
                        <p className="footer__brand-desc">
                            Academic decision workspaces for US high school and college students.
                            Analyze your GPA, prioritize courses, and make data-driven decisions.
                        </p>
                    </div>

                    <div>
                        <h4 className="footer__column-title">Workspaces</h4>
                        <ul className="footer__links">
                            {workspaceLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="footer__link">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer__column-title">Legal</h4>
                        <ul className="footer__links">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="footer__link">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>Made for US students. Free, fast, and private.</p>
                </div>
            </div>
        </footer>
    );
}
