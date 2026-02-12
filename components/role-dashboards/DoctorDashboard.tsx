import { Dashboard } from "../Dashboard";
import { User } from "../../App";

interface DoctorDashboardProps {
  user: User;
}

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  return <Dashboard user={user} />;
}
