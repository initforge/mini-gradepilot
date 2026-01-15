import React from "react";

interface IconProps {
    className?: string;
    style?: React.CSSProperties;
}

// ==========================================
// BRAND ICONS (Contact Page)
// ==========================================

export const IconFacebook = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} style={{ ...style, fill: "#1877F2" }}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

export const IconWhatsApp = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} style={{ ...style, fill: "#25D366" }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export const IconTelegram = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} style={{ ...style, fill: "#0088CC" }}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zM17.9 8.24l-2.028 10.03c-.15.706-.575.88-1.164.546l-3.228-2.38-1.56 1.503c-.173.173-.318.318-.65.318l.233-3.28 5.97-5.394c.26-.23-.056-.358-.404-.128L8.68 13.56 5.5 12.564c-.694-.216-.708-.695.145-1.03L17.5 4.933c.795-.298 1.493.18 1.398 3.308z" />
    </svg>
);

export const IconEmail = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={{ ...style, color: "#8b5cf6" }}>
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
);

// ==========================================
// WORKSPACE ICONS (Professional Duotone)
// ==========================================

// GPA - Bar Chart (Unified Teal)
export const IconChartBar = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" fillOpacity="0.1" />
        <path d="M7 17v-4M12 17V9M17 17V5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

// Course Analyzer - Unified Teal
export const IconCourse = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 13h4M8 17h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="15" cy="15" r="3" stroke="currentColor" strokeWidth="2" />
        <line x1="17.5" y1="17.5" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Transcript - Unified Teal
export const IconTranscript = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M9 7h6M9 11h6M9 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 19l-2-1-2 1v-4l2 1 2-1v4z" fill="currentColor" />
    </svg>
);

// ==========================================
// ACTION ICONS (Buttons)
// ==========================================

// Weighted - Balance Scale (Unified Style)
export const IconScale = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <path d="M12 3v18M6 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 10l-3 7h6l-3-7zm12 0l-3 7h6l-3-7z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// % -> GPA Converter
export const IconConverter = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <text x="2" y="16" style={{ fontSize: "14px", fill: "currentColor", fontWeight: "bold", fontFamily: "sans-serif" }}>%</text>
        <path d="M11 12h6m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="9" width="4" height="6" rx="1" fill="currentColor" />
    </svg>
);

// Clear All - Trash
export const IconTrash = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Add Semester - Book stack + Plus
export const IconAddSemester = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" />
        <circle cx="15" cy="11" r="5" fill="#f97316" />
        <path d="M15 8v6M12 11h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// ==========================================
// UTILITY ICONS
// ==========================================

export const IconUser = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export const IconBookOpen = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

export const GradePilotLogo = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "#14b8a6", ...style }}>
        <path d="M22 10L12 5L2 10L12 15L22 10Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M6 12v3c0 3 3 5 6 5s6-2 6-5v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const IconLock = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
);

export const IconLightning = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);
// ==========================================
// FEEDBACK & STATUS ICONS
// ==========================================

// Idea / Pro-Tip - Lightbulb (Yellow)
export const IconIdea = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "#eab308", ...style }}>
        <path d="M9 18h6m-3-15a7 7 0 0 0-5 11.9c.5.5 1 1.1 1 1.8v1.3c0 .5.5 1 1 1h6c.5 0 1-.5 1-1v-1.3c0-.7.5-1.3 1-1.8A7 7 0 0 0 12 3z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 22h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="11" r="3" fill="currentColor" fillOpacity="0.1" />
    </svg>
);

// Check / Success - Circle Check (Green)
export const IconCheckCircle = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "#22c55e", ...style }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
        <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Target / Goal - Bullseye (Indigo/Purple)
export const IconTarget = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "#6366f1", ...style }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2.5" strokeDasharray="2 2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
);

// Analytics - Chart Pie (Blue)
export const IconChartPie = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "#0ea5e9", ...style }}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
        <path d="M12 2v10h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12l7 7" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
);

// Trends (Up/Down/Stable)
export const IconTrendUp = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "#22c55e", ...style }}>
        <path d="M23 6l-9.5 9.5-5-5L1 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 6h6v6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconTrendDown = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "#ef4444", ...style }}>
        <path d="M23 18l-9.5-9.5-5 5L1 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 18h6v-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconTrendFlat = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "#94a3b8", ...style }}>
        <path d="M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 8l4 4-4 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Numbers In Circles
export const IconNumberCircle = ({ num, color = "#14b8a6", className, style }: IconProps & { num: number; color?: string }) => (
    <div className={className} style={{
        width: "32px",
        height: "32px",
        background: `${color}15`,
        border: `2px solid ${color}`,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
        fontWeight: 800,
        fontSize: "16px",
        flexShrink: 0,
        ...style
    }}>
        {num}
    </div>
);

// Balance / Weighted - Scale (White/Transp for header)
export const IconBalance = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <path d="M12 3v18M6 10h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M6 10l-3 7h6l-3-7zm12 0l-3 7h6l-3-7z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
);

// Note / Sync - Document with Sync (Blue/Teal)
export const IconNote = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "#0d9488", ...style }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" />
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" />
        <path d="M12 13a3 3 0 1 0 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 16l2-2m-2 2l-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Empty State - Box (Gray)
export const IconEmpty = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "#94a3b8", ...style }}>
        <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" stroke="currentColor" strokeWidth="2" />
        <path d="M21 8l-9 6-9-6" stroke="currentColor" strokeWidth="2" />
        <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" stroke="currentColor" strokeWidth="2" />
    </svg>
);

// Folders
export const IconFolder = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconFolderOpen = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <path d="M20 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 13h18l-2 7H5z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Link / Connection
export const IconLink = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Lock / Unlock
export const IconUnlock = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Alert / Warning
export const IconAlert = ({ className, style }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={{ color: "currentColor", ...style }}>
        <path d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.33 18c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

