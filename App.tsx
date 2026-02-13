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
import { PatientRegistration } from "./components/PatientRegistration";

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
import { supabase } from "./lib/supabase";
import { ClinicProfile } from "./components/ClinicProfile";

export type UserRole = "patient" | "doctor" | "clinic" | "reception" | "nurse" | "lab" | "pharmacy" | "admin" | null;

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
  | "lab-dashboard" | "pharmacy-dashboard";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  clinicId?: string | number; // Added for multi-tenancy
  phone?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('currentView');
      // Validate if savedView is a valid PageView (simplified check)
      if (savedView && savedView !== 'loading') {
        return savedView as PageView;
      }
    }
    return "home";
  });
  const [user, setUser] = useState<User | null>(null);

  // Persist currentView to localStorage
  useEffect(() => {
    if (currentView && currentView !== 'loading') {
      localStorage.setItem('currentView', currentView);
    }
  }, [currentView]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userWithRole = await getUserWithRole();
        if (userWithRole) {
          setUser(userWithRole);
          // Only redirect to dashboard if we are at home or login, otherwise respect persisted view
          if (currentView === "home" || currentView === "login" || currentView.startsWith("register-")) {
            setCurrentView("dashboard");
          }

          if (window.location.pathname === "/auth/callback") {
            window.history.replaceState({}, document.title, "/");
          }
        } else {
          // If no user, but we have a persisted view that REQUIRES auth, we should probably go home/login
          // For now, let's just respect the persisted view unless it's strictly a protected dashboard
          // But since simple persistence is dumb, let's just let it be.

          if (window.location.pathname !== "/auth/callback") {
            // Do not force home if we have a saved view, unless we want to enforce auth
            // But for non-protected pages (features, pricing etc), staying on them is good.
          } else {
            setCurrentView("loading");
            setTimeout(() => {
              if (window.location.pathname === "/auth/callback" && !user) {
                console.log("Auth callback timeout - redirecting home");
                setCurrentView("home");
                window.history.replaceState({}, document.title, "/");
              }
            }, 5000);
          }
        }
      } catch (error) {
        console.error("Initial auth error:", error);
        setCurrentView("home");
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, _session) => {
      console.log("Auth event:", event);
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const userWithRole = await getUserWithRole();
        if (userWithRole) {
          setUser(userWithRole);
          // If just signing in, go to dashboard
          if (currentView === "home" || currentView === "login" || currentView.startsWith("register-")) {
            setCurrentView("dashboard");
          }
          if (window.location.pathname === "/auth/callback") {
            window.history.replaceState({}, document.title, "/");
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setCurrentView("home");
        localStorage.removeItem('currentView'); // Clear saved view on logout
      }
    });

    return () => subscription.unsubscribe();
  }, []); // Remove dependency on empty array to run once, but we need refs inside... actually empty array is fine.

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView("dashboard");
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
      setCurrentView("register-patient");
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

    if (currentView === "register-clinic") {
      return <ClinicRegistration onBack={() => setCurrentView("login")} />;
    }

    if (currentView === "register-doctor") {
      return <DoctorRegistration onBack={() => setCurrentView("login")} />;
    }

    if (currentView === "register-patient") {
      return <PatientRegistration onBack={() => setCurrentView("login")} />;
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

    // Patient Portal Views - Commented out due to missing component imports
    /*
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
    */

    // Clinic Management Views - Commented out due to missing component imports
    /*
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
    */

    if (currentView === "loading") {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Processing login...</p>
        </div>
      );
    }

    // Dashboard Views (Role-based)
    if (currentView === "dashboard" && user) {
      switch (user.role) {
        case "patient":
          return <PatientPortal user={user} onLogout={handleLogout} />;
        case "doctor":
          return <DoctorDashboard user={user} />;
        case "clinic":
          return <ClinicDashboard user={user} />;
        case "reception":
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
              <p className="text-gray-600">You do not have permission to access this dashboard.</p>
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