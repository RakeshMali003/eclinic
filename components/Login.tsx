import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Heart, ArrowLeft, User, Stethoscope, Building2 } from "lucide-react";
import type { User as UserType } from "../App";

interface LoginProps {
  onLogin: (user: UserType) => void;
  onBack: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | "clinic">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in real app this would authenticate with backend
    const mockUser: UserType = {
      id: Math.random().toString(36).substr(2, 9),
      name: isSignup ? name : "Demo User",
      email: email,
      role: selectedRole,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    
    onLogin(mockUser);
  };

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
          
          <h2 className="text-center mb-2">Welcome to E-Clinic</h2>
          <p className="text-center text-muted-foreground mb-6">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </p>

          <Tabs value={isSignup ? "signup" : "login"} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" onClick={() => setIsSignup(false)}>
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setIsSignup(true)}>
                Sign Up
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="mb-3 block">Select Your Role</Label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedRole === role.value
                      ? "border-primary bg-pink-50"
                      : "border-border hover:border-pink-300"
                  }`}
                >
                  <role.icon className={`w-6 h-6 mx-auto mb-1 ${
                    selectedRole === role.value ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <p className="text-xs text-center">{role.label}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {roles.find(r => r.value === selectedRole)?.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isSignup && (
              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" required className="mt-1" />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
            )}
            
            <Button type="submit" className="w-full">
              {isSignup ? "Create Account" : "Sign In"}
            </Button>
          </form>

          {!isSignup && (
            <div className="text-center mt-4">
              <Button variant="link" className="text-sm">
                Forgot password?
              </Button>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </Button>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Demo Mode: Use any email to login
        </p>
      </div>
    </div>
  );
}
