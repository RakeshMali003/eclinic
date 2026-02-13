import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Building2, 
  Search,
  Star,
  MapPin,
  Award,
  ChevronRight,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Calendar } from '../ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import type { PatientUser } from '../PatientPortal';

interface BookAppointmentProps {
  patient: PatientUser;
}

const doctors = [
  {
    id: 'DOC-001',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    experience: '15 years',
    rating: 4.8,
    reviews: 234,
    fee: 1500,
    avatar: 'SJ',
    available: true,
    nextSlot: 'Tomorrow, 10:30 AM'
  },
  {
    id: 'DOC-002',
    name: 'Dr. Rajesh Kumar',
    specialty: 'General Physician',
    experience: '12 years',
    rating: 4.9,
    reviews: 456,
    fee: 800,
    avatar: 'RK',
    available: true,
    nextSlot: 'Today, 4:00 PM'
  },
  {
    id: 'DOC-003',
    name: 'Dr. Priya Patel',
    specialty: 'Pediatrics',
    experience: '10 years',
    rating: 4.7,
    reviews: 189,
    fee: 1000,
    avatar: 'PP',
    available: true,
    nextSlot: 'Jan 25, 2:30 PM'
  },
  {
    id: 'DOC-004',
    name: 'Dr. Amit Verma',
    specialty: 'Orthopedics',
    experience: '18 years',
    rating: 4.9,
    reviews: 321,
    fee: 1800,
    avatar: 'AV',
    available: true,
    nextSlot: 'Jan 26, 11:00 AM'
  }
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export function BookAppointment({ patient }: BookAppointmentProps) {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [appointmentType, setAppointmentType] = useState<'in-clinic' | 'video'>('in-clinic');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDoctorSelect = (doctor: typeof doctors[0]) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleBooking = () => {
    // Simulate booking
    setStep(4);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-semibold text-gray-900 mb-1">Book Appointment</h1>
        <p className="text-sm text-gray-600">Schedule consultation with our expert doctors</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 py-4">
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center size-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            {step > 1 ? <Check className="size-4" /> : '1'}
          </div>
          <span className="text-sm font-medium">Select Doctor</span>
        </div>
        <ChevronRight className="size-4 text-gray-400" />
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center size-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            {step > 2 ? <Check className="size-4" /> : '2'}
          </div>
          <span className="text-sm font-medium">Choose Date & Time</span>
        </div>
        <ChevronRight className="size-4 text-gray-400" />
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center size-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            {step > 3 ? <Check className="size-4" /> : '3'}
          </div>
          <span className="text-sm font-medium">Confirm</span>
        </div>
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by doctor name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="size-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((doctor) => (
              <Card 
                key={doctor.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleDoctorSelect(doctor)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="size-16">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {doctor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          <Award className="size-3 mr-1" />
                          {doctor.experience}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Star className="size-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {doctor.rating} ({doctor.reviews})
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Consultation Fee</p>
                          <p className="font-semibold text-gray-900">₹{doctor.fee}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Next Available</p>
                          <p className="text-sm font-medium text-green-600">{doctor.nextSlot}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Choose Date, Time & Type */}
      {step === 2 && selectedDoctor && (
        <div className="space-y-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {selectedDoctor.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{selectedDoctor.name}</h3>
                  <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  Change Doctor
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={appointmentType} onValueChange={(v) => setAppointmentType(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="in-clinic">
                    <Building2 className="size-4 mr-2" />
                    In-Clinic Visit
                  </TabsTrigger>
                  <TabsTrigger value="video">
                    <Video className="size-4 mr-2" />
                    Video Consultation
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {appointmentType === 'in-clinic' && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Elinic Healthcare Center</p>
                      <p className="text-xs text-gray-600">Andheri West, Mumbai - 400053</p>
                    </div>
                  </div>
                </div>
              )}

              {appointmentType === 'video' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Video className="size-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Online Video Consultation</p>
                      <p className="text-xs text-blue-700">Join from anywhere using your device</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="size-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5" />
                  Select Time Slot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="w-full"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button 
              className="flex-1" 
              onClick={() => setStep(3)}
              disabled={!selectedDate || !selectedTime}
            >
              Continue to Confirmation
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm Booking */}
      {step === 3 && selectedDoctor && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Doctor</Label>
                  <p className="font-medium text-gray-900">{selectedDoctor.name}</p>
                  <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Appointment Type</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {appointmentType === 'video' ? (
                      <>
                        <Video className="size-4 text-blue-600" />
                        <span className="font-medium text-gray-900">Video Consultation</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="size-4 text-green-600" />
                        <span className="font-medium text-gray-900">In-Clinic Visit</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">Date</Label>
                  <p className="font-medium text-gray-900">
                    {selectedDate?.toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Time</Label>
                  <p className="font-medium text-gray-900">{selectedTime}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Patient Name</Label>
                  <p className="font-medium text-gray-900">{patient.name}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Contact</Label>
                  <p className="font-medium text-gray-900">{patient.phone}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-medium text-gray-900">₹{selectedDoctor.fee}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium text-gray-900">₹50</span>
                </div>
                <div className="flex justify-between items-center text-lg pt-2 border-t">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-semibold text-gray-900">₹{selectedDoctor.fee + 50}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reason for Visit (Optional)</Label>
                <Textarea 
                  placeholder="Describe your symptoms or reason for consultation..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleBooking}>
              Confirm & Pay ₹{selectedDoctor.fee + 50}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && selectedDoctor && (
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="size-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="size-8 text-white" />
              </div>
              <h2 className="font-semibold text-gray-900 mb-2">Appointment Booked Successfully!</h2>
              <p className="text-sm text-gray-600 mb-6">
                Your appointment has been confirmed. You will receive a confirmation email and SMS shortly.
              </p>
              
              <div className="bg-white rounded-lg p-6 mb-6 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Appointment ID</p>
                    <p className="font-mono font-semibold text-gray-900">APT-2026-{Math.floor(Math.random() * 1000)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Doctor</p>
                    <p className="font-medium text-gray-900">{selectedDoctor.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {selectedDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {selectedTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Type</p>
                    <Badge className={appointmentType === 'video' ? 'bg-blue-600' : 'bg-green-600'}>
                      {appointmentType === 'video' ? 'Video Call' : 'In-Clinic'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  Download Receipt
                </Button>
                <Button className="flex-1" onClick={() => setStep(1)}>
                  Book Another Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
