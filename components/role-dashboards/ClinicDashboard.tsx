import { Dashboard } from "../Dashboard";
import { User } from "../../App";

interface ClinicDashboardProps {
  user: User;
}

export function ClinicDashboard({ user }: ClinicDashboardProps) {
  return <Dashboard user={user} />;
}
