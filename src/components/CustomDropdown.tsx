"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownOption {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    color?: "teal" | "orange" | "purple";
}

export default function CustomDropdown({
    options,
    value,
    onChange,
    placeholder = "Select...",
    color = "teal",
}: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((o) => o.value === value);

    // Color schemes
    const colors = {
        teal: { bg: "#0d9488", bgHover: "#0f766e" },
        orange: { bg: "#f97316", bgHover: "#ea580c" },
        purple: { bg: "#8b5cf6", bgHover: "#7c3aed" },
    };
    const colorScheme = colors[color];

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            ref={dropdownRef}
            style={{
                position: "relative",
                width: "fit-content",
                cursor: "pointer",
            }}
        >
            {/* Selected Display */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: colorScheme.bg,
                    padding: "6px 12px",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minWidth: 80,
                    justifyContent: "space-between",
                    transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = colorScheme.bgHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = colorScheme.bg)}
            >
                <span>{selectedOption?.label || placeholder}</span>
                <svg
                    style={{
                        width: 12,
                        height: 12,
                        fill: "white",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                    }}
                    viewBox="0 0 24 24"
                >
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </div>

            {/* Options List */}
            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        background: colorScheme.bg,
                        borderRadius: "6px",
                        padding: "4px",
                        zIndex: 1000,
                        minWidth: "100%",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            style={{
                                padding: "6px 12px",
                                borderRadius: "4px",
                                color: "white",
                                fontSize: "14px",
                                fontWeight: option.value === value ? 600 : 400,
                                background: option.value === value ? colorScheme.bgHover : "transparent",
                                transition: "background 0.15s ease",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => {
                                if (option.value !== value) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = option.value === value ? colorScheme.bgHover : "transparent";
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
