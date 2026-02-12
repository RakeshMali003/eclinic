import { useState, useEffect } from 'react';
import api from '../../lib/api';
import {
  Calendar,
  Video,
  Building2,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  X,
  CalendarDays,
  Phone,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import type { PatientUser } from '../PatientPortal';

interface MyAppointmentsProps {
  patient: PatientUser;
}

interface Appointment {
  appointment_id: string;
  appointment_date: string;
  appointment_time: string;
  type: string;
  mode: string;
  status: string;
  doctor: {
    full_name: string;
    qualifications: string;
  };
  clinic?: {
    clinic_name: string;
  };
}

export function MyAppointments({ patient }: MyAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/appointments/patient/${patient.id}`);
        console.log('API RESPONSE:', data);
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
        setAppointments([]); // Ensure appointments is always an array
      } finally {
        setLoading(false);
      }
    };

    if (patient.id) {
      fetchAppointments();
    }
  }, [patient.id]);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.qualifications?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.clinic?.clinic_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-pink-600">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-600">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-600">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-gray-900 mb-1">My Appointments</h1>
          <p className="text-sm text-gray-600">Manage and track all your appointments</p>
        </div>
        <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
          <Calendar className="size-4 mr-2" />
          Book New Appointment
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-pink-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  placeholder="Search appointments by doctor, specialization, or clinic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-white">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-pink-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Scheduled</p>
            <p className="text-2xl font-bold text-purple-900">{stats.scheduled}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card className="border-pink-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-pink-50 border-b border-pink-200">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-pink-900">Date & Time</th>
                  <th className="text-left p-4 text-sm font-semibold text-pink-900">Doctor</th>
                  <th className="text-left p-4 text-sm font-semibold text-pink-900">Specialization</th>
                  <th className="text-left p-4 text-sm font-semibold text-pink-900">Type</th>
                  <th className="text-left p-4 text-sm font-semibold text-pink-900">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-pink-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No appointments found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt, index) => {
                    const appointmentDate = new Date(apt.appointment_date);
                    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                    const formattedTime = apt.appointment_time || 'TBD';
                    const doctorInitials = apt.doctor.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
                    const canJoin = apt.status === 'scheduled' && apt.mode === 'video';

                    return (
                      <tr
                        key={apt.appointment_id}
                        className={`border-b border-gray-100 hover:bg-pink-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{formattedDate}</p>
                            <p className="text-sm text-gray-600">{formattedTime}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10">
                              <AvatarFallback className="bg-pink-600 text-white">
                                {doctorInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{apt.doctor.full_name}</p>
                              <p className="text-sm text-gray-600">{apt.clinic?.clinic_name || 'Clinic'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-900">{apt.doctor.qualifications || 'General Medicine'}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {apt.mode === 'video' ? (
                              <>
                                <Video className="size-4 text-blue-600" />
                                <span className="text-sm text-gray-900">Video Consultation</span>
                              </>
                            ) : (
                              <>
                                <Building2 className="size-4 text-green-600" />
                                <span className="text-sm text-gray-900">In-Clinic</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(apt.status)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {canJoin && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Video className="size-4 mr-1" />
                                Join Call
                              </Button>
                            )}
                            {apt.status === 'completed' && (
                              <Button size="sm" variant="outline">
                                <Download className="size-4 mr-1" />
                                Report
                              </Button>
                            )}
                            {apt.status === 'scheduled' && !canJoin && (
                              <Button size="sm" variant="outline">
                                <Calendar className="size-4 mr-1" />
                                Reschedule
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}