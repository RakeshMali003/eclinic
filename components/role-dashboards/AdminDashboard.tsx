import { Dashboard } from "../Dashboard";
import { User } from "../../App";

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
    return <Dashboard user={user} />;
}
