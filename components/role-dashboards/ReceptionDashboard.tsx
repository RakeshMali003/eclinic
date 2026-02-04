import React from 'react';
import { User } from '../../App';

interface ReceptionDashboardProps {
    user: User;
}

export function ReceptionDashboard({ user }: ReceptionDashboardProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Reception Dashboard</h1>
                <p className="text-gray-600">Front Desk: {user.clinicId}</p>
            </div>
        </div>
    );
}
