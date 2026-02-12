import { Dashboard } from "../Dashboard";
import { User } from "../../App";

interface ReceptionDashboardProps {
  user: User;
}

export function ReceptionDashboard({ user }: ReceptionDashboardProps) {
  return <Dashboard user={user} />;
}
