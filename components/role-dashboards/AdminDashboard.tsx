<<<<<<< HEAD
import { Dashboard } from "../Dashboard";
import { User } from "../../App";

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
    return <Dashboard user={user} />;
=======
import React from 'react';
import { User } from '../../App';

interface AdminDashboardProps {
    user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Managing Clinic: {user.clinicId}</p>
            </div>
        </div>
    );
>>>>>>> 14783141afc458471b13b2994cd6e5939572361f
}
