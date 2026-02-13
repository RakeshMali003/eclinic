import { useState, useEffect } from 'react';
import { UserRole } from '../App';
import {
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../lib/api';

interface DashboardProps {
  userRole: UserRole;
}

interface DashboardStats {
  todaysAppointments: number;
  totalRevenue: string;
  activePatients: number;
  pendingPayments: number;
}

interface AppointmentData {
  time: string;
  count: number;
}

interface RevenueData {
  day: string;
  revenue: number;
}

interface RecentAppointment {
  appointment_id: number;
  patient: string;
  doctor: string;
  time: string;
  status: string;
}

export function Dashboard({ userRole }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    todaysAppointments: 0,
    totalRevenue: '₹0',
    activePatients: 0,
    pendingPayments: 0
  });
  const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsResponse, appointmentResponse, revenueResponse, appointmentsResponse] = await Promise.all([
          API.get('/dashboard/stats'),
          API.get('/dashboard/appointments-data'),
          API.get('/dashboard/revenue-data'),
          API.get('/dashboard/recent-appointments')
        ]);

        setStats(statsResponse as DashboardStats);
        setAppointmentData(appointmentResponse as AppointmentData[]);
        setRevenueData(revenueResponse as RevenueData[]);
        setRecentAppointments(appointmentsResponse as RecentAppointment[]);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of clinic performance</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const statsConfig = [
    { label: "Today's Appointments", value: stats.todaysAppointments.toString(), change: '+12%', icon: Calendar, color: 'blue' },
    { label: 'Total Revenue', value: stats.totalRevenue, change: '+8%', icon: DollarSign, color: 'green' },
    { label: 'Active Patients', value: stats.activePatients.toString(), change: '+5%', icon: Users, color: 'purple' },
    { label: 'Pending Payments', value: stats.pendingPayments.toString(), change: '-3%', icon: AlertCircle, color: 'orange' },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of clinic performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Today's Appointments</h3>
              <p className="text-sm text-gray-600">By time slot</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span>Peak: 11 AM</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Weekly Revenue</h3>
              <p className="text-sm text-gray-600">Last 7 days</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+15%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Appointments</h3>
          <p className="text-sm text-gray-600">Latest patient appointments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentAppointments.map((appointment) => (
                <tr key={appointment.appointment_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{appointment.patient}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{appointment.doctor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      appointment.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                      appointment.status === 'scheduled' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {appointment.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {appointment.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Peak Hours:</strong> Most appointments scheduled between 10-11 AM. Consider adding more slots.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>Revenue Trend:</strong> 15% increase in weekly revenue. Saturday shows highest revenue generation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>No-show Prediction:</strong> 3 appointments at risk of no-show today. Auto-reminder sent.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
