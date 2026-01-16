"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface Course {
    id: string;
    name: string;
    grade: string;
    credits: number;
    type: "Regular" | "Honors" | "AP/IB";
    // For Course Analyzer - weight breakdown
    categories?: CategoryWeight[];
}

export interface CategoryWeight {
    id: string;
    name: string;
    weight: number;
    score: number | null;
    maxScore: number;
}

export interface Semester {
    id: string;
    name: string;
    year: number;
    term: "Fall" | "Spring" | "Summer";
    courses: Course[];
}

export interface Profile {
    id: string;
    name: string;
    createdAt: number;
    semesters: Semester[];
}

interface AcademicStore {
    // Hydration tracking
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;

    // Profiles
    profiles: Profile[];
    activeProfileId: string | null;

    // Profile actions
    createProfile: (name: string) => void;
    deleteProfile: (id: string) => void;
    setActiveProfile: (id: string) => void;
    renameProfile: (id: string, name: string) => void;

    // Semester actions
    addSemester: (name: string, year: number, term: "Fall" | "Spring" | "Summer") => void;
    updateSemester: (semesterId: string, updates: Partial<Omit<Semester, "id" | "courses">>) => void;
    deleteSemester: (semesterId: string) => void;

    // Course actions
    addCourse: (semesterId: string, course: Omit<Course, "id">) => void;
    updateCourse: (semesterId: string, courseId: string, updates: Partial<Omit<Course, "id">>) => void;
    deleteCourse: (semesterId: string, courseId: string) => void;

    // Bulk actions
    clearAllData: () => void;

    // Computed helpers
    getActiveProfile: () => Profile | null;
    getAllCourses: () => { course: Course; semester: Semester }[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAcademicStore = create<AcademicStore>()(
    persist(
        (set, get) => ({
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),

            profiles: [],
            activeProfileId: null,

            // Profile actions
            createProfile: (name) => {
                const newProfile: Profile = {
                    id: generateId(),
                    name,
                    createdAt: Date.now(),
                    semesters: [],
                };
                set((state) => ({
                    profiles: [...state.profiles, newProfile],
                    activeProfileId: state.activeProfileId || newProfile.id,
                }));
            },

            deleteProfile: (id) => {
                set((state) => {
                    const newProfiles = state.profiles.filter((p) => p.id !== id);
                    return {
                        profiles: newProfiles,
                        activeProfileId: state.activeProfileId === id
                            ? newProfiles[0]?.id || null
                            : state.activeProfileId,
                    };
                });
            },

            setActiveProfile: (id) => set({ activeProfileId: id }),

            renameProfile: (id, name) => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === id ? { ...p, name } : p
                    ),
                }));
            },

            // Semester actions
            addSemester: (name, year, term) => {
                const newSemester: Semester = {
                    id: generateId(),
                    name,
                    year,
                    term,
                    courses: [],
                };
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === state.activeProfileId
                            ? { ...p, semesters: [...p.semesters, newSemester] }
                            : p
                    ),
                }));
            },

            updateSemester: (semesterId, updates) => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === state.activeProfileId
                            ? {
                                ...p,
                                semesters: p.semesters.map((s) =>
                                    s.id === semesterId ? { ...s, ...updates } : s
                                ),
                            }
                            : p
                    ),
                }));
            },

            deleteSemester: (semesterId) => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === state.activeProfileId
                            ? {
                                ...p,
                                semesters: p.semesters.filter((s) => s.id !== semesterId),
                            }
                            : p
                    ),
                }));
            },

            // Course actions
            addCourse: (semesterId, course) => {
                const newCourse: Course = { ...course, id: generateId() };
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === state.activeProfileId
                            ? {
                                ...p,
                                semesters: p.semesters.map((s) =>
                                    s.id === semesterId
                                        ? { ...s, courses: [...s.courses, newCourse] }
                                        : s
                                ),
                            }
                            : p
                    ),
                }));
            },

            updateCourse: (semesterId, courseId, updates) => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === state.activeProfileId
                            ? {
                                ...p,
                                semesters: p.semesters.map((s) =>
                                    s.id === semesterId
                                        ? {
                                            ...s,
                                            courses: s.courses.map((c) =>
                                                c.id === courseId ? { ...c, ...updates } : c
                                            ),
                                        }
                                        : s
                                ),
                            }
                            : p
                    ),
                }));
            },

            deleteCourse: (semesterId, courseId) => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === state.activeProfileId
                            ? {
                                ...p,
                                semesters: p.semesters.map((s) =>
                                    s.id === semesterId
                                        ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) }
                                        : s
                                ),
                            }
                            : p
                    ),
                }));
            },

            // Bulk actions
            clearAllData: () => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === state.activeProfileId
                            ? { ...p, semesters: [] }
                            : p
                    ),
                }));
            },

            // Computed helpers
            getActiveProfile: () => {
                const state = get();
                return state.profiles.find((p) => p.id === state.activeProfileId) || null;
            },

            getAllCourses: () => {
                const profile = get().getActiveProfile();
                if (!profile) return [];
                return profile.semesters.flatMap((semester) =>
                    semester.courses.map((course) => ({ course, semester }))
                );
            },
        }),
        {
            name: "gradepilot-academic-store",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

// Helper: Grade to GPA conversion
export const gradeToGPA: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0,
};

export const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];

// Helper: Calculate GPA
export function calculateGPA(courses: Course[], weighted: boolean = false): number {
    if (courses.length === 0) return 0;

    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
        const baseGPA = gradeToGPA[course.grade] ?? 0;
        let gpa = baseGPA;

        if (weighted) {
            if (course.type === "Honors") gpa = Math.min(4.0, baseGPA + 0.5);
            if (course.type === "AP/IB") gpa = Math.min(5.0, baseGPA + 1.0);
        }

        totalPoints += gpa * course.credits;
        totalCredits += course.credits;
    }

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

// Helper: Get semester GPA
export function getSemesterGPA(semester: Semester, weighted: boolean = false): number {
    return calculateGPA(semester.courses, weighted);
}

// Helper: Get cumulative GPA up to semester index
export function getCumulativeGPA(semesters: Semester[], upToIndex: number, weighted: boolean = false): number {
    const allCourses = semesters
        .slice(0, upToIndex + 1)
        .flatMap((s) => s.courses);
    return calculateGPA(allCourses, weighted);
}
