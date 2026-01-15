"use client";

import { ReactNode } from "react";

// ==========================================
// ANIMATED DELETE BUTTON
// Based on Uiverse.io by boryanakrasteva
// ==========================================

interface DeleteButtonProps {
    onClick: () => void;
    label?: string;
}

export function DeleteButton({ onClick, label = "Clear All" }: DeleteButtonProps) {
    return (
        <button
            onClick={onClick}
            className="animated-delete-btn"
            style={{
                cursor: "pointer",
                width: "40px",
                height: "40px",
                border: "2px solid #ef4444",
                position: "relative",
                borderRadius: "10px",
                boxShadow: "4px 4px #ef4444",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                background: "#dc2626",
                overflow: "hidden",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.width = "150px";
                const text = e.currentTarget.querySelector(".delete-text") as HTMLElement;
                if (text) {
                    text.style.opacity = "1";
                    text.style.visibility = "visible";
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.width = "40px";
                const text = e.currentTarget.querySelector(".delete-text") as HTMLElement;
                if (text) {
                    text.style.opacity = "0";
                    text.style.visibility = "hidden";
                }
            }}
            onMouseDown={(e) => {
                e.currentTarget.style.transform = "translate(3px, 3px)";
                e.currentTarget.style.boxShadow = "0px 0px #ef4444";
            }}
            onMouseUp={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "4px 4px #ef4444";
            }}
        >
            <span
                className="delete-text"
                style={{
                    color: "white",
                    visibility: "hidden",
                    opacity: 0,
                    fontSize: "13px",
                    paddingLeft: "12px",
                    transition: "opacity 0.2s linear 0.1s, visibility 0.2s linear 0.1s",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                }}
            >
                {label}
            </span>
            <div
                className="icon-wrapper"
                style={{
                    width: "40px",
                    height: "40px",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                        width: "20px",
                        height: "20px",
                        transition: "transform 0.2s linear",
                    }}
                >
                    <path
                        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </button>
    );
}

// ==========================================
// ANIMATED ADD BUTTON
// Based on Uiverse.io by andrew-demchenk0
// ==========================================

interface AddButtonProps {
    onClick: () => void;
    label?: string;
    color?: "teal" | "orange" | "purple";
}

const colorMap = {
    teal: {
        main: "#14b8a6",
        bg: "#0d9488",
        bgSub: "#115e59",
        font: "#ffffff",
    },
    orange: {
        main: "#f97316",
        bg: "#ea580c",
        bgSub: "#9a3412",
        font: "#ffffff",
    },
    purple: {
        main: "#8b5cf6",
        bg: "#7c3aed",
        bgSub: "#5b21b6",
        font: "#ffffff",
    },
};

export function AddButton({ onClick, label = "Add", color = "teal" }: AddButtonProps) {
    const colors = colorMap[color];

    return (
        <button
            onClick={onClick}
            className="animated-add-btn"
            style={{
                position: "relative",
                width: "150px",
                height: "40px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                border: `2px solid ${colors.main}`,
                boxShadow: `4px 4px ${colors.main}`,
                backgroundColor: colors.bg,
                borderRadius: "10px",
                overflow: "hidden",
                transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
                const icon = e.currentTarget.querySelector(".button__icon") as HTMLElement;
                const text = e.currentTarget.querySelector(".button__text") as HTMLElement;
                if (icon) {
                    icon.style.width = "146px";
                    icon.style.transform = "translateX(0)";
                }
                if (text) {
                    text.style.color = "transparent";
                }
            }}
            onMouseLeave={(e) => {
                const icon = e.currentTarget.querySelector(".button__icon") as HTMLElement;
                const text = e.currentTarget.querySelector(".button__text") as HTMLElement;
                if (icon) {
                    icon.style.width = "40px";
                    icon.style.transform = "translateX(106px)";
                }
                if (text) {
                    text.style.color = colors.font;
                }
            }}
            onMouseDown={(e) => {
                e.currentTarget.style.transform = "translate(3px, 3px)";
                e.currentTarget.style.boxShadow = `0px 0px ${colors.main}`;
            }}
            onMouseUp={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = `4px 4px ${colors.main}`;
            }}
        >
            <span
                className="button__text"
                style={{
                    marginLeft: "12px",
                    color: colors.font,
                    fontWeight: 600,
                    fontSize: "13px",
                    transition: "all 0.3s",
                    whiteSpace: "nowrap",
                }}
            >
                {label}
            </span>
            <span
                className="button__icon"
                style={{
                    position: "absolute",
                    right: 0,
                    transform: "translateX(106px)",
                    height: "100%",
                    width: "40px",
                    backgroundColor: colors.bgSub,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s",
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ width: "20px", height: "20px" }}
                >
                    <path
                        d="M12 5v14M5 12h14"
                        stroke={colors.main}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </svg>
            </span>
        </button>
    );
}

// ==========================================
// SIMPLE ADD COURSE BUTTON (smaller)
// ==========================================

interface AddCourseButtonProps {
    onClick: () => void;
}

export function AddCourseButton({ onClick }: AddCourseButtonProps) {
    return (
        <button
            onClick={onClick}
            style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(20, 184, 166, 0.3)",
                transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(20, 184, 166, 0.4)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(20, 184, 166, 0.3)";
            }}
        >
            <svg viewBox="0 0 24 24" fill="none" style={{ width: "16px", height: "16px" }}>
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Add Course
        </button>
    );
}
