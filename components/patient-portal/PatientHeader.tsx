import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import type { PatientUser } from '../PatientPortal';

interface PatientHeaderProps {
  patient: PatientUser;
  onLogout?: () => void;
}

export function PatientHeader({ patient, onLogout }: PatientHeaderProps) {
  return (
    <header className="bg-white border-b border-pink-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-gray-900">Welcome back, {patient.name.split(' ')[0]}!</h1>
          <p className="text-sm text-gray-600">Manage your health, anytime, anywhere</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative hover:bg-pink-50">
            <Bell className="size-5 text-gray-700" />
            <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-pink-600">
              3
            </Badge>
          </Button>
          
          <div className="flex items-center gap-3 border-l border-pink-200 pl-4">
            <Avatar>
              <AvatarFallback className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                {patient.avatar || <User className="size-5" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{patient.name}</p>
              {patient.abhaId && (
                <p className="text-xs text-pink-600">ABHA: {patient.abhaId}</p>
              )}
            </div>
          </div>
          
          {onLogout && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="border-pink-300 text-pink-600 hover:bg-pink-50"
            >
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}