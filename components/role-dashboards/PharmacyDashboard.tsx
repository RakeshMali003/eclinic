import { Dashboard } from "../Dashboard";
import { User } from "../../App";

interface PharmacyDashboardProps {
  user: User;
}

export function PharmacyDashboard({ user }: PharmacyDashboardProps) {
  return <Dashboard user={user} />;
}
