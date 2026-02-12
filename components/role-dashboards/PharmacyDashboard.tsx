<<<<<<< HEAD
import { Dashboard } from "../Dashboard";
import { User } from "../../App";

interface PharmacyDashboardProps {
  user: User;
}

export function PharmacyDashboard({ user }: PharmacyDashboardProps) {
  return <Dashboard user={user} />;
=======
import React from 'react';
import { User } from '../../App';

interface PharmacyDashboardProps {
    user: User;
}

export function PharmacyDashboard({ user }: PharmacyDashboardProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Pharmacy Dashboard</h1>
                <p className="text-gray-600">Inventory for Clinic: {user.clinicId}</p>
            </div>
        </div>
    );
>>>>>>> 14783141afc458471b13b2994cd6e5939572361f
}
