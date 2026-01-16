import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Heart, ArrowLeft, User, Stethoscope, Building2, Phone, Mail } from "lucide-react";
import type { User as UserType } from "../App";

interface LoginWithOTPProps {
  onLogin: (user: UserType) => void;
  onBack: () => void;
  onRegister: (role: "patient" | "doctor" | "clinic") => void;
}

export function LoginWithOTP({ onLogin, onBack, onRegister }: LoginWithOTPProps) {
  const [step, setStep] = useState<"role" | "mobile" | "otp">("role");
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | "clinic">("patient");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");

  const roles = [
    {
      value: "patient" as const,
      label: "Patient",
      icon: User,
      description: "Access consultations and health records"
    },
    {
      value: "doctor" as const,
      label: "Doctor",
      icon: Stethoscope,
      description: "Manage patients and appointments"
    },
    {
      value: "clinic" as const,
      label: "Clinic / Admin",
      icon: Building2,
      description: "Oversee operations and staff"
    }
  ];

  const handleSendOTP = () => {
    if (mobileNumber.length === 10) {
      // Mock OTP send
      setStep("otp");
      // In real app, send OTP via SMS
      alert(`OTP sent to ${mobileNumber}: 123456 (Demo)`);
    }
  };

  const handleVerifyOTP = () => {
    // Mock OTP verification - in real app, verify with backend
    if (otp === "123456" || otp.length === 6) {
      const mockUser: UserType = {
        id: Math.random().toString(36).substr(2, 9),
        name: "Demo User",
        email: `${mobileNumber}@demo.com`,
        role: selectedRole,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      };
      onLogin(mockUser);
    } else {
      alert("Invalid OTP. Demo OTP is: 123456");
    }
  };

  const handleRoleSelect = (role: "patient" | "doctor" | "clinic") => {
    setSelectedRole(role);
    setStep("mobile");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <Card className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <h2 className="text-center mb-2 text-foreground font-bold">Welcome to E-Clinic</h2>
          <p className="text-center text-foreground/80 mb-6 font-medium">
            {step === "role" && "Select your role to continue"}
            {step === "mobile" && "Enter your mobile number"}
            {step === "otp" && "Enter OTP to verify"}
          </p>

          {/* Step 1: Role Selection */}
          {step === "role" && (
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Select Your Role</Label>
                <div className="grid gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => handleRoleSelect(role.value)}
                      className="p-4 rounded-lg border-2 transition-all hover:border-pink-400 hover:bg-pink-900/20 text-left flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-pink-800/30">
                        <role.icon className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{role.label}</p>
                        <p className="text-sm text-foreground/70">{role.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Mobile Number */}
          {step === "mobile" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-pink-900/20 rounded-lg mb-4 border border-pink-800/30">
                <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {selectedRole === "patient" && <User className="w-5 h-5 text-white" />}
                  {selectedRole === "doctor" && <Stethoscope className="w-5 h-5 text-white" />}
                  {selectedRole === "clinic" && <Building2 className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">Login as {roles.find(r => r.value === selectedRole)?.label}</p>
                  <button 
                    onClick={() => setStep("role")}
                    className="text-xs text-pink-600 hover:underline"
                  >
                    Change role
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/60" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-10"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-foreground/60 mt-1">
                  📱 You will receive an OTP on this number
                </p>
              </div>

              <Button 
                onClick={handleSendOTP}
                className="w-full"
                disabled={mobileNumber.length !== 10}
              >
                Send OTP
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-foreground/70">New User?</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onRegister(selectedRole)}
              >
                Register as {roles.find(r => r.value === selectedRole)?.label}
              </Button>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {step === "otp" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-800/30">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-foreground/70">
                  OTP sent to <strong>+91 {mobileNumber}</strong>
                </p>
                <button 
                  onClick={() => setStep("mobile")}
                  className="text-xs text-pink-600 hover:underline mt-1"
                >
                  Change number
                </button>
              </div>

              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-foreground/60 mt-1 text-center">
                  Demo OTP: <strong>123456</strong>
                </p>
              </div>

              <Button 
                onClick={handleVerifyOTP}
                className="w-full"
                disabled={otp.length !== 6}
              >
                Verify & Login
              </Button>

              <div className="text-center">
                <button 
                  onClick={handleSendOTP}
                  className="text-sm text-pink-600 hover:underline"
                >
                  Didn't receive? Resend OTP
                </button>
              </div>
            </div>
          )}
        </Card>

        <p className="text-center text-sm text-foreground/60 mt-4">
          🔒 Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
}
