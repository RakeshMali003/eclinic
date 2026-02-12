import { Dashboard } from "../Dashboard";
import { User } from "../../App";

interface NurseDashboardProps {
  user: User;
}

export function NurseDashboard({ user }: NurseDashboardProps) {
    return <Dashboard user={user} />;
}
