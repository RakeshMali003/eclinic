import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
    Activity,
    Users,
    Calendar,
    DollarSign,
    Settings,
    Bell,
    Search,
    UserPlus,
    FileText
} from "lucide-react";
import { User } from '../../App';

interface ClinicDashboardProps {
    user: User;
}

export function ClinicDashboard({ user }: ClinicDashboardProps) {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Clinic Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user.name} ({user.role})</p>
                        {user.clinicId && <p className="text-xs text-gray-400">Clinic ID: {user.clinicId}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-pink-600">CL</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Patients</p>
                                    <h3 className="text-2xl font-bold text-gray-900">--</h3>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ... Add other cards back ... */}

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Data Accessibility</p>
                                    <p className="text-sm text-green-600">
                                        {user.clinicId ? `Restricted to Clinic #${user.clinicId}` : "WARNING: Global Access"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
