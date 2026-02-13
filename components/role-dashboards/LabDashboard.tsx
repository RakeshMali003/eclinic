import React from 'react';
import { User } from '../../App';

interface LabDashboardProps {
    user: User;
}

export function LabDashboard({ user }: LabDashboardProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Lab Dashboard</h1>
                <p className="text-gray-600">Lab Orders for Clinic: {user.clinicId}</p>
            </div>
        </div>
    );
}
