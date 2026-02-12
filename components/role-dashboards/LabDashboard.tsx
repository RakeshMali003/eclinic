import { Dashboard } from "../Dashboard";
import { User } from "../../App";

interface LabDashboardProps {
  user: User;
}

export function LabDashboard({ user }: LabDashboardProps) {
  return <Dashboard user={user} />;
}
