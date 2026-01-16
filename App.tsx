import { useState } from "react";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/sonner";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { LoginWithOTP } from "./components/LoginWithOTP";
import { ClinicRegistration } from "./components/ClinicRegistration";
import { DoctorRegistration } from "./components/DoctorRegistration";
import { PatientDashboard } from "./components/PatientDashboard";
import { PatientDashboardNew } from "./components/PatientDashboardNew";
import { DoctorDashboard } from "./components/DoctorDashboard";
import { ClinicDashboard } from "./components/ClinicDashboard";
import ClinicModuleComplete from "./components/ClinicModuleComplete";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Pricing } from "./components/Pricing";
import { AIFeatures } from "./components/AIFeatures";
import { Healthcare } from "./components/Healthcare";
import { Medicine } from "./components/Medicine";
import { CartPage } from "./components/CartPage";
import { DoctorConsult } from "./components/DoctorConsult";
import { LabTests } from "./components/LabTests";
import { Plus } from "./components/Plus";
import { HealthInsights } from "./components/HealthInsights";
import { Offers } from "./components/Offers";
import { Contact } from "./components/Contact";

export type UserRole = "patient" | "doctor" | "clinic" | null;
export type PageView = "home" | "login" | "dashboard" | "features" | "how-it-works" | "pricing" | "ai-features" | "medicine" | "cart" | "healthcare" | "doctor-consult" | "lab-tests" | "plus" | "health-insights" | "offers" | "contact" | "register-clinic" | "register-doctor" | "register-patient" | "clinic-module";

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

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("home");
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
    alert("Registration submitted successfully! You'll receive verification status via email/SMS.");
    setCurrentView("login");
  };

  const renderView = () => {
    if (currentView === "home") {
      return <Home onGetStarted={() => setCurrentView("login")} onNavigate={navigateTo} />;
    }
    
    if (currentView === "login") {
      return <LoginWithOTP onLogin={handleLogin} onBack={() => setCurrentView("home")} onRegister={handleRegister} />;
    }
    
    if (currentView === "register-clinic") {
      return <ClinicRegistration onComplete={handleRegistrationComplete} onBack={() => setCurrentView("login")} />;
    }
    
    if (currentView === "register-doctor") {
      return <DoctorRegistration onComplete={handleRegistrationComplete} onBack={() => setCurrentView("login")} />;
    }
    
    if (currentView === "cart") {
      return <CartPage onNavigate={navigateTo} user={user} onLoginRequired={handleLoginRequired} />;
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
    
    if (currentView === "dashboard" && user) {
      switch (user.role) {
        case "patient":
          return <PatientDashboardNew user={user} onLogout={handleLogout} />;
        case "doctor":
          return <DoctorDashboard user={user} onLogout={handleLogout} />;
        case "clinic":
          return <ClinicDashboard user={user} onLogout={handleLogout} />;
        default:
          return <Home onGetStarted={() => setCurrentView("login")} onNavigate={navigateTo} />;
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