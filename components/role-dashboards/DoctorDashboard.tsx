<<<<<<< HEAD
import { Dashboard } from "../Dashboard";
import { User } from "../../App";

interface DoctorDashboardProps {
  user: User;
}

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  return <Dashboard user={user} />;
=======
import React, { useEffect, useState } from 'react';
import { User } from '../../App';
import { appointmentService, AppointmentWithDetails } from '../../services/appointmentService';

interface DoctorDashboardProps {
    user: User;
}

export function DoctorDashboard({ user }: DoctorDashboardProps) {
    const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);

    useEffect(() => {
        async function fetchMyData() {
            if (user.clinicId) {
                // Correct Usage: Fetch appointments for this clinic
                // And potentially filter by doctor_id if the user is a doctor
                // But 'admin' role might view all.
                // Since this is DoctorDashboard, user.role is 'doctor'.
                try {
                    // If the user object has their specific doctor_id (not just user.id which is auth_id)
                    // We'd need to map auth_id to doctor_id first.
                    // For now, let's assume we filter by clinic_id to ensure isolation.
                    const data = await appointmentService.getAppointments({
                        clinic_id: user.clinicId,
                        // doctor_id: user.id // Need mapping logic here ideally
                    });
                    setAppointments(data);
                } catch (e) {
                    console.error("Failed to load appointments", e);
                }
            }
        }
        fetchMyData();
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
                <p className="text-gray-600">Welcome, Dr. {user.name}</p>
                <p className="text-sm text-gray-500 mt-2">Clinic ID: {user.clinicId}</p>
            </div>

            <div className="mt-8 w-full max-w-4xl p-4">
                <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
                <div className="bg-white rounded-lg shadow p-4">
                    {appointments.length === 0 ? <p>No appointments found.</p> : (
                        <ul>
                            {appointments.map(apt => (
                                <li key={apt.appointment_id} className="border-b py-2">
                                    {apt.patient_name} - {apt.appointment_date} @ {apt.appointment_time}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
>>>>>>> 14783141afc458471b13b2994cd6e5939572361f
}
