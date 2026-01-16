"use client";

import { ReactNode } from "react";
import styles from "./FancyButtons.module.css";

interface SlideToggleButtonProps {
    active: boolean;
    onClick: () => void;
    icon?: ReactNode;
    activeLabel: string;
    inactiveLabel: string;
    activeColor?: string;
}

/**
 * Slide-fill toggle button (LinkedIn-style inspiration)
 * Used for: Weighted OFF/ON
 */
export function SlideToggleButton({
    active,
    onClick,
    icon,
    activeLabel,
    inactiveLabel,
    activeColor = "#7c3aed"
}: SlideToggleButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`${styles.slideToggle} ${active ? styles.slideToggleActive : ""}`}
            style={{ "--active-color": activeColor } as React.CSSProperties}
        >
            <span className={styles.slideToggleBg}></span>
            {icon && <span className={styles.slideToggleIcon}>{icon}</span>}
            <span className={styles.slideToggleText}>
                {active ? activeLabel : inactiveLabel}
            </span>
        </button>
    );
}

interface OutlineButtonProps {
    active: boolean;
    onClick: () => void;
    icon?: ReactNode;
    label: string;
    activeColor?: string;
}

/**
 * Outline → Fill button (GitHub-style inspiration)
 * Used for: Linked Mode, % → GPA
 */
export function OutlineButton({
    active,
    onClick,
    icon,
    label,
    activeColor = "#f97316"
}: OutlineButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`${styles.outlineBtn} ${active ? styles.outlineBtnActive : ""}`}
            style={{ "--active-color": activeColor } as React.CSSProperties}
        >
            {icon && <span className={styles.outlineBtnIcon}>{icon}</span>}
            <span className={styles.outlineBtnText}>{label}</span>
        </button>
    );
}

interface ProfileButtonProps {
    onClick: () => void;
    icon?: ReactNode;
    label: string;
    chevron?: boolean;
}

/**
 * Profile button with slide-up text effect
 * Used for: My Profile dropdown trigger
 */
export function ProfileButton({
    onClick,
    icon,
    label,
    chevron = true
}: ProfileButtonProps) {
    return (
        <button onClick={onClick} className={styles.profileBtn}>
            {icon && <span className={styles.profileBtnIcon}>{icon}</span>}
            <span className={styles.profileBtnText}>
                <span className={styles.profileBtnTextInner}>{label}</span>
            </span>
            {chevron && (
                <svg className={styles.profileBtnChevron} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 4l4 4 4-4" />
                </svg>
            )}
        </button>
    );
}

interface CornerCTAProps {
    href: string;
    children: ReactNode;
    color?: "teal" | "orange";
}

/**
 * CTA button with 3D shadow layers (marcelodolza style)
 * Used for: "Open GPA Workspace →" links
 */
export function CornerCTA({ href, children, color = "teal" }: CornerCTAProps) {
    return (
        <a
            href={href}
            className={`${styles.cornerCta} ${color === "orange" ? styles.cornerCtaOrange : ""}`}
        >
            <span className={styles.cornerCtaWrap}>
                <span className={styles.cornerCtaContent}>
                    <span className={styles.cornerCtaText}>{children}</span>
                    <span className={styles.cornerCtaArrow}></span>
                </span>
            </span>
        </a>
    );
}

interface TabToggleProps {
    options: { value: string; label: string }[];
    selected: string;
    onChange: (value: string) => void;
}

/**
 * Tab toggle for College/High School switch
 */
export function TabToggle({ options, selected, onChange }: TabToggleProps) {
    return (
        <div className={styles.tabToggle}>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`${styles.tabToggleBtn} ${selected === opt.value ? styles.tabToggleBtnActive : ""}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

interface SwitchToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

/**
 * Switch toggle (Praashoo7 sliding bar style)
 * Used for: Alternative toggle style
 */
export function SwitchToggle({ checked, onChange, label }: SwitchToggleProps) {
    return (
        <label className={styles.switchToggle}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className={styles.switchSlider}></span>
            {label && <span className={styles.switchLabel}>{label}</span>}
        </label>
    );
}
