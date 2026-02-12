import { useState, useEffect } from "react";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/sonner";

// Core Pages
import { Home } from "./components/Home";
import { LoginPage as Login } from "./components/Login";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Pricing } from "./components/Pricing";
import { AIFeatures } from "./components/AIFeatures";
import { Healthcare } from "./components/Healthcare";
import { MedicineEnhanced as Medicine } from "./components/MedicineEnhanced";
import { TelemedicineConsultationEnhanced as DoctorConsult } from "./components/TelemedicineConsultationEnhanced";
import { LabTests } from "./components/LabTests";
import { Plus } from "./components/Plus";
import { HealthInsights } from "./components/HealthInsights";
import { Offers } from "./components/Offers";
import { Contact } from "./components/Contact";

// Registration Components
import { ClinicRegistration } from "./components/ClinicRegistration";
import { DoctorRegistration } from "./components/DoctorRegistration";

// Patient Portal Components
import { PatientPortal } from "./components/PatientPortal";
import { DoctorDashboard } from "./components/role-dashboards/DoctorDashboard";
import { ClinicDashboard } from "./components/role-dashboards/ClinicDashboard";
import { ReceptionDashboard } from "./components/role-dashboards/ReceptionDashboard";
import { NurseDashboard } from "./components/role-dashboards/NurseDashboard";
import { LabDashboard } from "./components/role-dashboards/LabDashboard";
import { PharmacyDashboard } from "./components/role-dashboards/PharmacyDashboard";
import { AdminDashboard } from "./components/role-dashboards/AdminDashboard";
import { getUserWithRole, authService } from "./services/authService";
import { ClinicProfile } from "./components/ClinicProfile";
import { AppointmentManagement } from "./components/AppointmentManagement";
import { PatientManagement } from "./components/PatientManagement";
import { DoctorManagement } from "./components/DoctorManagement";
import { StaffManagement } from "./components/StaffManagement";
import { BillingPayments } from "./components/BillingPayments";
import { PharmacyInventory } from "./components/PharmacyInventory";
import { LabDiagnostics } from "./components/LabDiagnostics";
import { PrescriptionRecords } from "./components/PrescriptionRecords";
import { QueueManagement } from "./components/QueueManagement";
import { ReportsAnalytics } from "./components/ReportsAnalytics";
import { IoTIntegration } from "./components/IoTIntegration";
import { AIModules } from "./components/AIModules";
import { SecurityCompliance } from "./components/SecurityCompliance";
import { Settings } from "./components/Settings";
import { Notifications } from "./components/Notifications";

// Patient Portal Components
import { BookAppointment } from "./components/patient-portal/BookAppointment";
import { MyAppointments } from "./components/patient-portal/MyAppointments";
import { MyPrescriptions } from "./components/patient-portal/MyPrescriptions";
import { MyReports } from "./components/patient-portal/MyReports";
import { MyBilling } from "./components/patient-portal/MyBilling";
import { PatientProfile } from "./components/patient-portal/PatientProfile";
import { MedicineStore } from "./components/patient-portal/MedicineStore";
import { VideoConsultation } from "./components/patient-portal/VideoConsultation";
import { AIHealthTools } from "./components/patient-portal/AIHealthTools";

export type UserRole = "patient" | "doctor" | "clinic" | "receptionist" | "nurse" | "lab" | "pharmacy" | "admin" | null;

export type PageView =
  // Core Pages
  | "home" | "login" | "dashboard" | "loading"
  | "features" | "how-it-works" | "pricing" | "ai-features"
  | "medicine" | "cart" | "healthcare" | "doctor-consult"
  | "lab-tests" | "plus" | "health-insights" | "offers" | "contact"
  | "register-clinic" | "register-doctor" | "register-patient"
  // Patient Portal Views
  | "patient-book-appointment" | "patient-appointments"
  | "patient-prescriptions" | "patient-reports" | "patient-billing"
  | "patient-profile" | "patient-medicine-store" | "patient-video-consult"
  | "patient-ai-tools"
  // Clinic Management Views
  | "clinic-appointments" | "clinic-patients" | "clinic-doctors"
  | "clinic-staff" | "clinic-billing" | "clinic-pharmacy"
  | "clinic-lab" | "clinic-prescriptions" | "clinic-queue"
  | "clinic-reports" | "clinic-iot" | "clinic-ai"
  | "clinic-security" | "clinic-settings" | "clinic-notifications"
  | "clinic-profile"
  // Specific Role Dashboards (if needed separately)
  | "doctor-dashboard" | "reception-dashboard" | "nurse-dashboard"
  | "lab-dashboard" | "pharmacy-dashboard" | "patient-dashboard" | "clinic-dashboard" | "admin-dashboard";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>("home");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for auth callback parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userParam = urlParams.get('user');

        if (token && userParam) {
          // Handle auth callback from backend
          localStorage.setItem('auth_token', token);
          const userData = JSON.parse(decodeURIComponent(userParam));
          // Validate role
          const validRoles = ['patient', 'doctor', 'clinic', 'receptionist', 'nurse', 'lab', 'pharmacy', 'admin'];
          if (!validRoles.includes(userData.role)) {
            userData.role = 'patient';
          }
          const user = {
            id: userData.user_id,
            name: userData.full_name,
            email: userData.email,
            role: userData.role as UserRole,
          };
          setUser(user);
          // Cache the user in localStorage
          localStorage.setItem('user', JSON.stringify(user));
          switch (userData.role.toLowerCase()) {
            case "patient":
              setCurrentView("patient-dashboard");
              break;
            case "doctor":
              setCurrentView("doctor-dashboard");
              break;
            case "clinic":
              setCurrentView("clinic-dashboard");
              break;
            case "receptionist":
              setCurrentView("reception-dashboard");
              break;
            case "nurse":
              setCurrentView("nurse-dashboard");
              break;
            case "lab":
              setCurrentView("lab-dashboard");
              break;
            case "pharmacy":
              setCurrentView("pharmacy-dashboard");
              break;
            case "admin":
              setCurrentView("admin-dashboard");
              break;
            default:
              setCurrentView("dashboard");
          }
          // Clear URL parameters
          window.history.replaceState({}, document.title, "/");
        } else {
          // Check for existing session
          const userWithRole = await getUserWithRole();
          if (userWithRole) {
            console.log("initAuth: got userWithRole:", userWithRole);
            // Validate role
            const validRoles = ['patient', 'doctor', 'clinic', 'receptionist', 'nurse', 'lab', 'pharmacy', 'admin'];
            if (!userWithRole.role || !validRoles.includes(userWithRole.role)) {
              userWithRole.role = 'patient';
            }
            setUser(userWithRole);
            switch (userWithRole.role) {
              case "patient":
                setCurrentView("patient-dashboard");
                break;
              case "doctor":
                setCurrentView("doctor-dashboard");
                break;
              case "clinic":
                setCurrentView("clinic-dashboard");
                break;
              case "receptionist":
                setCurrentView("reception-dashboard");
                break;
              case "nurse":
                setCurrentView("nurse-dashboard");
                break;
              case "lab":
                setCurrentView("lab-dashboard");
                break;
              case "pharmacy":
                setCurrentView("pharmacy-dashboard");
                break;
              case "admin":
                setCurrentView("admin-dashboard");
                break;
              default:
                setCurrentView("dashboard");
            }
          } else {
            setCurrentView("home");
          }
        }
      } catch (error) {
        console.error("Initial auth error:", error);
        setCurrentView("home");
      }
    };

    initAuth();
  }, []);

  const handleLogin = (userData: User) => {
    console.log("handleLogin called with:", userData);
    // Persist user to localStorage first
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    switch (userData.role?.toLowerCase()) {
      case "patient":
        setCurrentView("patient-dashboard");
        break;
      case "doctor":
        setCurrentView("doctor-dashboard");
        break;
      case "clinic":
        setCurrentView("clinic-dashboard");
        break;
      case "receptionist":
        setCurrentView("reception-dashboard");
        break;
      case "nurse":
        setCurrentView("nurse-dashboard");
        break;
      case "lab":
        setCurrentView("lab-dashboard");
        break;
      case "pharmacy":
        setCurrentView("pharmacy-dashboard");
        break;
      case "admin":
        setCurrentView("admin-dashboard");
        break;
      default:
        setCurrentView("clinic-dashboard");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setCurrentView("home");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigateTo = (view: PageView) => {
    setCurrentView(view);
  };

  const handleLoginRequired = () => {
    alert("Please login to continue");
    setCurrentView("login");
  };

  const handleRegister = (role: "patient" | "doctor" | "clinic") => {
    if (role === "clinic") {
      setCurrentView("register-clinic");
    } else if (role === "doctor") {
      setCurrentView("register-doctor");
    } else {
      // For patient, can use a simpler form or direct to login
      alert("Patient registration will use quick signup with mobile OTP");
      setCurrentView("login");
    }
  };

  const handleRegistrationComplete = () => {
    alert("Registration completed successfully!");
    setCurrentView("login");
  };

  const renderView = () => {
    if (currentView === "home") {
      return <Home onGetStarted={() => setCurrentView("login")} onNavigate={navigateTo} />;
    }

    if (currentView === "login") {
      return <Login onLogin={handleLogin} onBack={() => setCurrentView("home")} onRegister={handleRegister} />;
    }

    // Registration Views
    if (currentView === "register-clinic") {
      return <ClinicRegistration onComplete={handleRegistrationComplete} onBack={() => setCurrentView("login")} />;
    }

    if (currentView === "register-doctor") {
      return <DoctorRegistration onComplete={handleRegistrationComplete} onBack={() => setCurrentView("login")} />;
    }

    // Core Service Pages
    if (currentView === "cart") {
      // TODO: Create CartPage component
      alert("Cart page component needs to be created");
      return <Home onGetStarted={() => setCurrentView("login")} onNavigate={navigateTo} />;
    }

    if (currentView === "features") {
      return <Features onNavigate={navigateTo} />;
    }

    if (currentView === "how-it-works") {
      return <HowItWorks onNavigate={navigateTo} />;
    }

    if (currentView === "pricing") {
      return <Pricing onNavigate={navigateTo} />;
    }

    if (currentView === "ai-features") {
      return <AIFeatures onNavigate={navigateTo} />;
    }

    if (currentView === "medicine") {
      return <Medicine onNavigate={navigateTo} user={user} onLoginRequired={handleLoginRequired} />;
    }

    if (currentView === "healthcare") {
      return <Healthcare onNavigate={navigateTo} />;
    }

    if (currentView === "doctor-consult") {
      return <DoctorConsult onNavigate={navigateTo} />;
    }

    if (currentView === "lab-tests") {
      return <LabTests onNavigate={navigateTo} />;
    }

    if (currentView === "plus") {
      return <Plus onNavigate={navigateTo} />;
    }

    if (currentView === "health-insights") {
      return <HealthInsights onNavigate={navigateTo} />;
    }

    if (currentView === "offers") {
      return <Offers onNavigate={navigateTo} />;
    }

    if (currentView === "contact") {
      return <Contact onNavigate={navigateTo} />;
    }

    // Patient Portal Views
    if (currentView === "patient-book-appointment") {
      return <BookAppointment user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "patient-appointments") {
      return <MyAppointments user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "patient-prescriptions") {
      return <MyPrescriptions user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "patient-reports") {
      return <MyReports user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "patient-billing") {
      return <MyBilling user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "patient-profile") {
      return <PatientProfile user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "patient-medicine-store") {
      return <MedicineStore user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "patient-video-consult") {
      return <VideoConsultation user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "patient-ai-tools") {
      return <AIHealthTools user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    // Clinic Management Views
    if (currentView === "clinic-appointments") {
      return <AppointmentManagement user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-patients") {
      return <PatientManagement user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-doctors") {
      return <DoctorManagement user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-staff") {
      return <StaffManagement user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-billing") {
      return <BillingPayments user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-pharmacy") {
      return <PharmacyInventory user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-lab") {
      return <LabDiagnostics user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-prescriptions") {
      return <PrescriptionRecords user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-queue") {
      return <QueueManagement user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-reports") {
      return <ReportsAnalytics user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-iot") {
      return <IoTIntegration user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-ai") {
      return <AIModules user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-security") {
      return <SecurityCompliance user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-settings") {
      return <Settings user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-notifications") {
      return <Notifications user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "clinic-profile") {
      return <ClinicProfile user={user} onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "loading") {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Processing login...</p>
        </div>
      );
    }

    if (currentView === "patient-dashboard" && user) {
      return <PatientPortal user={user} onLogout={handleLogout} />;
    }

    if (currentView === "doctor-dashboard" && user) {
      return <DoctorDashboard user={user} />;
    }

    if (currentView === "clinic-dashboard" && user) {
      return <ClinicDashboard user={user} />;
    }

    if (currentView === "reception-dashboard" && user) {
      return <ReceptionDashboard user={user} />;
    }

    if (currentView === "nurse-dashboard" && user) {
      return <NurseDashboard user={user} />;
    }

    if (currentView === "lab-dashboard" && user) {
      return <LabDashboard user={user} />;
    }

    if (currentView === "pharmacy-dashboard" && user) {
      return <PharmacyDashboard user={user} />;
    }

    if (currentView === "admin-dashboard" && user) {
      return <AdminDashboard user={user} />;
    }

    // Dashboard Views (Role-based)
    if (currentView === "dashboard" && user) {
      switch (user.role?.toLowerCase()) {
        case "patient":
          return <PatientPortal user={user} onLogout={handleLogout} />;
        case "doctor":
          return <DoctorDashboard user={user} />;
        case "clinic":
          return <ClinicDashboard user={user} />;
        case "receptionist":
          return <ReceptionDashboard user={user} />;
        case "nurse":
          return <NurseDashboard user={user} />;
        case "lab":
          return <LabDashboard user={user} />;
        case "pharmacy":
          return <PharmacyDashboard user={user} />;
        case "admin":
          return <AdminDashboard user={user} />;
        default:
          return (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
              <p className="text-gray-600">You do not have permission to access this dashboard. Role: {user.role}</p>
              <button onClick={() => setCurrentView("home")} className="mt-4 text-blue-600 hover:underline">Return Home</button>
            </div>
          );
      }
    }

    return <Home onGetStarted={() => setCurrentView("login")} onNavigate={navigateTo} />;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <CartProvider>
          {renderView()}
          <Toaster />
        </CartProvider>
      </div>
    </ThemeProvider>
  );
}