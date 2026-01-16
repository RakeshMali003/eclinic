import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Toaster } from "./ui/sonner";
import { 
  Home,
  User,
  Calendar,
  FileText,
  Pill,
  CreditCard,
  Heart,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Video,
  Brain,
  Mic,
  Volume2,
  Upload,
  Activity,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  Phone,
  MapPin,
  Clock,
  Download,
  Stethoscope,
  TestTube,
  ShoppingBag,
  Sparkles,
  Gift
} from "lucide-react";
import type { User as UserType } from "../App";
import { MyProfile } from "./pages/MyProfile";
import { MyAppointments } from "./pages/MyAppointments";
import { MyPrescriptions } from "./pages/MyPrescriptions";
import { MedicalReports } from "./pages/MedicalReports";
import { MedicalReportsEnhanced } from "./pages/MedicalReportsEnhanced";
import { MyBilling } from "./pages/MyBilling";
import { AppointmentBookingEnhanced } from "./AppointmentBookingEnhanced";
import { TelemedicineConsultationEnhanced } from "./TelemedicineConsultationEnhanced";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PatientDashboardNewProps {
  user: UserType;
  onLogout: () => void;
}

export function PatientDashboardNew({ user, onLogout }: PatientDashboardNewProps) {
  const [activePage, setActivePage] = useState("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const healthMetrics = [
    { name: "Mon", heartRate: 72, steps: 8500 },
    { name: "Tue", heartRate: 75, steps: 9200 },
    { name: "Wed", heartRate: 70, steps: 7800 },
    { name: "Thu", heartRate: 73, steps: 10500 },
    { name: "Fri", heartRate: 71, steps: 9800 },
    { name: "Sat", heartRate: 74, steps: 11200 },
    { name: "Sun", heartRate: 72, steps: 8900 }
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "ai-tools", label: "AI Tools", icon: Brain },
    { id: "profile", label: "My Profile", icon: User },
    { id: "appointments", label: "My Appointments", icon: Calendar },
    { id: "prescriptions", label: "My Prescriptions", icon: Pill },
    { id: "reports", label: "Medical Reports", icon: FileText },
    { id: "billing", label: "My Billing", icon: CreditCard }
  ];

  const renderPage = () => {
    switch (activePage) {
      case "profile":
        return <MyProfile user={user} />;
      case "appointments":
        return <MyAppointments />;
      case "prescriptions":
        return <MyPrescriptions />;
      case "reports":
        return <MedicalReportsEnhanced />;
      case "billing":
        return <MyBilling />;
      case "ai-tools":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="mb-2">AI-Powered Health Tools</h1>
              <p className="text-muted-foreground">Get instant insights about your health using advanced AI</p>
            </div>

            {/* Service Tabs */}
            <div className="flex flex-wrap gap-3 p-4 bg-white rounded-lg border">
              <Button variant="outline" className="h-auto py-3 px-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                <span>Medicine</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 px-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <span>Healthcare</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 px-6 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <span>Doctor Consult</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 px-6 flex items-center gap-2">
                <TestTube className="w-5 h-5 text-purple-600" />
                <span>Lab Tests</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 px-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <span>PLUS</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 px-6 flex items-center gap-2">
                <Gift className="w-5 h-5 text-orange-600" />
                <span>Health Insights</span>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Symptom Checker */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2">AI Symptom Checker</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Describe your symptoms and get AI-powered insights with specialist recommendations
                </p>
                <Button className="w-full">Start Diagnosis</Button>
              </Card>

              {/* Voice Input */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2">Voice-to-Text</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Speak your symptoms in English or Hindi, and AI will analyze them
                </p>
                <Button className="w-full" variant="outline">
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              </Card>

              {/* Report Explainer */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2">Report Explainer</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload any medical report and get a simple explanation in your language
                </p>
                <Button className="w-full" variant="outline" onClick={() => setActivePage("reports")}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Report
                </Button>
              </Card>

              {/* Audio Summary */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2">Audio Summary</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Listen to your health reports and summaries in audio format
                </p>
                <Button className="w-full" variant="outline">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Text-to-Speech
                </Button>
              </Card>

              {/* X-Ray Analysis */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2">X-Ray & Scan Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-powered analysis of X-rays, CT scans, and MRIs with detailed explanations
                </p>
                <Button className="w-full" variant="outline" onClick={() => setActivePage("reports")}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Scan
                </Button>
              </Card>

              {/* Health Insights */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2">Health Insights</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get personalized health recommendations based on your medical history
                </p>
                <Button className="w-full">View Insights</Button>
              </Card>
            </div>

            {/* Demo AI Symptom Checker */}
            <Card className="p-6">
              <h3 className="mb-4">Try AI Symptom Checker</h3>
              <div className="space-y-4">
                <div>
                  <Label>Describe your symptoms (English or Hindi)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input placeholder="E.g., I have a headache and fever..." className="flex-1" />
                    <Button size="icon" variant="outline">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button className="w-full">Analyze Symptoms</Button>
                
                {/* Sample Result */}
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="text-sm mb-2">
                        <strong>AI Analysis:</strong> Based on your symptoms, you may have a common viral infection. 
                        The AI suggests consulting a General Physician or an ENT Specialist.
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        सामान्य वायरल संक्रमण की संभावना है। कृपया सामान्य चिकित्सक से परामर्श लें।
                      </p>
                      <Button size="sm" onClick={() => setActivePage("appointments")}>Book Appointment with GP</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl mb-2">Welcome back, {user.name}! 👋</h1>
              <p className="text-muted-foreground">Here's your health overview for today</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Upcoming Appointments</p>
                    <p className="text-3xl">3</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600 opacity-20" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Prescriptions</p>
                    <p className="text-3xl">5</p>
                  </div>
                  <Pill className="w-8 h-8 text-green-600 opacity-20" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Health Score</p>
                    <p className="text-3xl text-green-600">85%</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-600 opacity-20" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Bills</p>
                    <p className="text-3xl">₹1,450</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-orange-600 opacity-20" />
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg mb-4">Heart Rate Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={healthMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="heartRate" stroke="#ec4899" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg mb-4">Daily Steps</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={healthMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="steps" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-4 gap-3">
                <Button className="h-auto py-4 flex-col gap-2" onClick={() => setActivePage("appointments")}>
                  <Calendar className="w-6 h-6" />
                  Book Appointment
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActivePage("reports")}>
                  <FileText className="w-6 h-6" />
                  Upload Report
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActivePage("prescriptions")}>
                  <Pill className="w-6 h-6" />
                  View Prescriptions
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActivePage("billing")}>
                  <CreditCard className="w-6 h-6" />
                  Pay Bills
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Appointment Scheduled</p>
                    <p className="text-sm text-muted-foreground">Dr. Sarah Johnson - Cardiology, Nov 15 at 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <FileText className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Report Uploaded</p>
                    <p className="text-sm text-muted-foreground">Complete Blood Count (CBC) - Nov 10, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Pill className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium">New Prescription</p>
                    <p className="text-sm text-muted-foreground">Metformin 500mg prescribed by Dr. Rajesh Kumar</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl hidden sm:inline">E-Clinic</span>
              </div>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients, doctors, appointments..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Patient</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r transition-transform duration-300 ease-in-out mt-16 md:mt-0`}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activePage === item.id
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
