import { redirect } from "next/navigation";

// Redirect old GPA calculators index to new GPA workspace
export default function GPACalculatorsPage() {
    redirect("/gpa");
}
