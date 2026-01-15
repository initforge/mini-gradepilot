import { redirect } from "next/navigation";

// Redirect old grade calculators index to new Course workspace
export default function GradeCalculatorsPage() {
    redirect("/course");
}
