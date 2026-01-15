"use client";

import { useState } from "react";
import { useAcademicStore } from "@/lib/useAcademicStore";
import { IconUser } from "@/components/Icons";

export default function ProfileSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [nameInput, setNameInput] = useState("");

    const { profiles, activeProfileId, setActiveProfile, createProfile, deleteProfile, renameProfile } = useAcademicStore();
    const activeProfile = profiles.find((p) => p.id === activeProfileId);

    const handleCreate = () => {
        if (nameInput.trim()) {
            createProfile(nameInput.trim());
            setNameInput("");
            setIsCreating(false);
        }
    };

    const handleRename = (id: string) => {
        if (nameInput.trim()) {
            renameProfile(id, nameInput.trim());
            setIsEditing(null);
            setNameInput("");
        }
    };

    const startEditing = (id: string, currentName: string) => {
        setIsEditing(id);
        setNameInput(currentName);
    };

    // Auto-create default profile if none exists
    if (profiles.length === 0) {
        return (
            <button
                onClick={() => createProfile("My Profile")}
                style={{
                    background: "var(--color-primary)",
                    color: "white",
                    border: "none",
                    padding: "var(--space-2) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "var(--text-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                }}
            >
                <span>+</span> Create Profile
            </button>
        );
    }

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    padding: "6px 16px", // Specific padding for height match
                    borderRadius: "var(--radius-md)",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "var(--text-sm)",
                    height: "44px", // Match buttons
                    transition: "background 0.2s"
                }}
            >
                <div style={{
                    width: 24, height: 24,
                    background: "#2dd4bf", // teal-400
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#0f172a"
                }}>
                    <IconUser className="w-4 h-4" />
                </div>
                {activeProfile?.name || "Select Profile"}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 4l4 4 4-4" />
                </svg>
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        marginTop: "var(--space-2)",
                        background: "#2a2f3b",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                        width: "min(260px, calc(100vw - 32px))",
                        maxWidth: "calc(100vw - 32px)",
                        zIndex: 1000,
                        overflow: "hidden",
                    }}
                    className="profile-dropdown"
                >
                    <div style={{ padding: "var(--space-2)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.5)", fontWeight: 600, padding: "var(--space-1) var(--space-2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            PROFILES
                        </div>
                    </div>

                    <div style={{ maxHeight: 240, overflowY: "auto" }}>
                        {profiles.map((profile) => (
                            <div
                                key={profile.id}
                                style={{
                                    padding: "var(--space-2)",
                                    background: profile.id === activeProfileId ? "rgba(255,255,255,0.1)" : "transparent",
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                }}
                            >
                                {isEditing === profile.id ? (
                                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                        <input
                                            type="text"
                                            value={nameInput}
                                            onChange={(e) => setNameInput(e.target.value)}
                                            autoFocus
                                            onKeyDown={(e) => e.key === "Enter" && handleRename(profile.id)}
                                            style={{
                                                flex: 1,
                                                padding: "var(--space-1)",
                                                border: "1px solid rgba(255,255,255,0.2)",
                                                borderRadius: "var(--radius-sm)",
                                                fontSize: "var(--text-sm)",
                                                width: "100%",
                                                background: "#323741",
                                                color: "white",
                                            }}
                                        />
                                        <button onClick={() => handleRename(profile.id)} style={{ border: "none", background: "var(--color-primary)", color: "white", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>✓</button>
                                        <button onClick={() => setIsEditing(null)} style={{ border: "none", background: "#e2e8f0", color: "#64748b", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>×</button>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setActiveProfile(profile.id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <span style={{
                                            fontWeight: profile.id === activeProfileId ? 600 : 400,
                                            color: profile.id === activeProfileId ? "#2dd4bf" : "white",
                                            fontSize: "var(--text-sm)",
                                        }}>
                                            {profile.name}
                                        </span>
                                        <div style={{ display: "flex", gap: "2px" }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEditing(profile.id, profile.name);
                                                }}
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    color: "rgba(255,255,255,0.5)",
                                                    cursor: "pointer",
                                                    padding: "2px 4px",
                                                    fontSize: "12px",
                                                }}
                                                title="Rename"
                                            >
                                                ✎
                                            </button>
                                            {profiles.length > 1 && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteProfile(profile.id);
                                                    }}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "#ef4444",
                                                        cursor: "pointer",
                                                        padding: "2px 4px",
                                                        fontSize: "16px",
                                                    }}
                                                    title="Delete"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "var(--space-2)" }}>
                        {isCreating ? (
                            <div style={{ display: "flex", gap: "var(--space-2)" }}>
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    placeholder="Profile name"
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                    style={{
                                        flex: 1,
                                        padding: "var(--space-1) var(--space-2)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        borderRadius: "var(--radius-sm)",
                                        fontSize: "var(--text-sm)",
                                        background: "#323741",
                                        color: "white",
                                    }}
                                />
                                <button
                                    onClick={handleCreate}
                                    style={{
                                        background: "var(--color-primary)",
                                        color: "white",
                                        border: "none",
                                        padding: "var(--space-1) var(--space-2)",
                                        borderRadius: "var(--radius-sm)",
                                        cursor: "pointer",
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => { setIsCreating(false); setNameInput(""); }}
                                    style={{
                                        background: "transparent",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        color: "rgba(255,255,255,0.6)",
                                        padding: "var(--space-1) var(--space-2)",
                                        borderRadius: "var(--radius-sm)",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setIsCreating(true); setNameInput(""); }}
                                style={{
                                    width: "100%",
                                    background: "transparent",
                                    border: "none",
                                    color: "#2dd4bf",
                                    padding: "var(--space-2)",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                    textAlign: "left",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--space-2)",
                                }}
                            >
                                <span style={{ fontSize: "16px" }}>+</span> New Profile
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
