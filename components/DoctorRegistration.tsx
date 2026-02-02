import { useState } from 'react';
import {
  User,
  Briefcase,
  FileText,
  Building2,
  DollarSign,
  Upload,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface DoctorRegistrationProps {
  onBack: () => void;
}

const steps = [
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Professional', icon: Briefcase },
  { id: 3, title: 'Documents', icon: FileText },
  { id: 4, title: 'Practice', icon: Building2 },
  { id: 5, title: 'Financial', icon: DollarSign }
];

const specializations = [
  'General Medicine', 'Cardiology', 'Pediatrics', 'Dermatology',
  'Orthopedics', 'ENT', 'Gynecology', 'Ophthalmology',
  'Dentistry', 'Physiotherapy', 'Psychiatry', 'Neurology'
];

const languages = [
  'Hindi', 'English', 'Marathi', 'Bengali',
  'Tamil', 'Telugu', 'Gujarati', 'Punjabi'
];

const conditionsTreated = [
  'Diabetes', 'Hypertension', 'Asthma', 'Arthritis',
  'Heart Disease', 'Skin Problems', 'Hair Loss', 'Fever & Infection',
  'Pregnancy Care', 'Child Health', 'Mental Health', 'Pain Management'
];

const servicesOffered = [
  'Teleconsultation', 'Lab Referral', 'Prescription Renewal', 'Health Checkup',
  'Vaccination', 'Home Visit', 'Emergency Care'
];

const consultationModes = ['Walk-in', 'Video Call', 'Chat', 'Home Visit'];

export function DoctorRegistration({ onBack }: DoctorRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [workingDays, setWorkingDays] = useState<string[]>([]);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    mobile: '',
    email: '',
    mciReg: '',
    council: '',
    regYear: '',
    degrees: '',
    university: '',
    gradYear: '',
    experience: '',
    clinicName: '',
    clinicAddress: '',
    inClinicFee: '',
    onlineFee: '',
    accountName: '',
    accountNumber: '',
    ifsc: '',
    pan: '',
    gstin: '',
    bio: '',
    password: ''
  });

  const [files, setFiles] = useState<Record<string, File>>({});
  const [customService, setCustomService] = useState('');
  const [showCustomServiceInput, setShowCustomServiceInput] = useState(false);

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
      toast.success(`${key} selected: ${e.target.files![0].name}`);
    }
  };

  const handleAddCustomService = () => {
    if (customService.trim()) {
      setSelectedServices(prev => [...prev, customService.trim()]);
      setCustomService('');
      setShowCustomServiceInput(false);
      toast.success("Custom service added!");
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full Name is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.dob) newErrors.dob = "Date of Birth is required";
      if (!formData.mobile) newErrors.mobile = "Mobile Number is required";
      else if (formData.mobile.length !== 10) newErrors.mobile = "Mobile Number must be 10 digits";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.password) newErrors.password = "Password is required";
    }

    if (step === 2) {
      if (!formData.mciReg) newErrors.mciReg = "MCI Registration Number is required";
      if (!formData.council) newErrors.council = "Medical Council Name is required";
      if (!formData.regYear) newErrors.regYear = "Registration Year is required";
      if (!formData.degrees) newErrors.degrees = "Degrees are required";
      if (!formData.university) newErrors.university = "University Name is required";
      if (!formData.gradYear) newErrors.gradYear = "Graduation Year is required";
      if (!formData.experience) newErrors.experience = "Experience is required";
      if (selectedSpecializations.length === 0) newErrors.specializations = "Select at least one specialization";
      if (selectedLanguages.length === 0) newErrors.languages = "Select at least one language";
    }

    if (step === 5) {
      if (!formData.accountName) newErrors.accountName = "Account Holder Name is required";
      if (!formData.accountNumber) newErrors.accountNumber = "Account Number is required";
      if (!formData.ifsc) newErrors.ifsc = "IFSC Code is required";
      if (!formData.pan) newErrors.pan = "PAN Number is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
      toast.error("Please fill in all required fields correctly.");
    } else {
      setErrors({});
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const registrationData: any = {
        name: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        gender: formData.gender,
        dob: formData.dob,
        mciReg: formData.mciReg,
        councilName: formData.council,
        regYear: parseInt(formData.regYear),
        degrees: formData.degrees,
        university: formData.university,
        gradYear: parseInt(formData.gradYear),
        experience: parseInt(formData.experience),
        specializations: selectedSpecializations,
        languages: selectedLanguages,
        clinicName: formData.clinicName,
        clinicAddress: formData.clinicAddress,
        inClinicFee: parseFloat(formData.inClinicFee),
        onlineFee: parseFloat(formData.onlineFee),
        consultationModes: selectedModes,
        conditionsTreated: selectedConditions,
        servicesOffered: selectedServices,
        bankDetails: {
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          ifsc: formData.ifsc,
          pan: formData.pan,
          gstin: formData.gstin
        },
        bio: formData.bio
      };

      await authService.signUpDoctor(registrationData, formData.password, files);

      toast.success("Registration successful! Please login to continue.");
      // Redirect to login or verification pending page
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="fullName">Dr. Full Name *</Label>
        <Input
          id="fullName"
          placeholder="Dr. First Middle Last"
          className={`mt-2 ${errors.fullName ? 'border-red-500' : ''}`}
          value={formData.fullName}
          onChange={handleInputChange}
        />
        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select onValueChange={(v) => handleSelectChange('gender', v)}>
            <SelectTrigger id="gender" className={`mt-2 ${errors.gender ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
        </div>

        <div>
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input
            id="dob"
            type="date"
            className={`mt-2 ${errors.dob ? 'border-red-500' : ''}`}
            value={formData.dob}
            onChange={handleInputChange}
          />
          {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="password">Login Password *</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a secure password"
          className={`mt-2 ${errors.password ? 'border-red-500' : ''}`}
          value={formData.password}
          onChange={handleInputChange}
        />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
      </div>

      <div>
        <Label htmlFor="mobile">Mobile Number *</Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="mobile"
            placeholder="10-digit mobile"
            maxLength={10}
            className={`flex-1 ${errors.mobile ? 'border-red-500' : ''}`}
            value={formData.mobile}
            onChange={handleInputChange}
          />
          {!mobileVerified ? (
            <Button onClick={() => { if (formData.mobile.length === 10) setMobileVerified(true); else toast.error("Invalid mobile"); }} className="bg-pink-600 px-3 h-10">
              Verify
            </Button>
          ) : (
            <Button disabled className="bg-green-600 px-3 h-10">
              <CheckCircle className="size-4" />
            </Button>
          )}
        </div>
        {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="email"
            type="email"
            placeholder="doctor@example.com"
            className={`flex-1 ${errors.email ? 'border-red-500' : ''}`}
            value={formData.email}
            onChange={handleInputChange}
          />
          {!emailVerified ? (
            <Button onClick={() => { if (/\S+@\S+\.\S+/.test(formData.email)) setEmailVerified(true); else toast.error("Invalid email"); }} className="bg-pink-600 px-3 h-10">
              Verify
            </Button>
          ) : (
            <Button disabled className="bg-green-600 px-3 h-10">
              <CheckCircle className="size-4" />
            </Button>
          )}
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="mciReg">MCI / State Medical Council Registration No. *</Label>
        <p className="text-xs text-pink-600 mt-1">🏷️ This is mandatory for verification</p>
        <Input
          id="mciReg"
          placeholder="e.g., MH/12345/2015"
          className={`mt-2 ${errors.mciReg ? 'border-red-500' : ''}`}
          value={formData.mciReg}
          onChange={handleInputChange}
        />
        {errors.mciReg && <p className="text-xs text-red-500 mt-1">{errors.mciReg}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="council">Medical Council Name *</Label>
          <Input
            id="council"
            placeholder="e.g., Maharashtra Medical Council"
            className={`mt-2 ${errors.council ? 'border-red-500' : ''}`}
            value={formData.council}
            onChange={handleInputChange}
          />
          {errors.council && <p className="text-xs text-red-500 mt-1">{errors.council}</p>}
        </div>

        <div>
          <Label htmlFor="regYear">Registration Year *</Label>
          <Input
            id="regYear"
            placeholder="e.g., 2015"
            type="number"
            className={`mt-2 ${errors.regYear ? 'border-red-500' : ''}`}
            value={formData.regYear}
            onChange={handleInputChange}
          />
          {errors.regYear && <p className="text-xs text-red-500 mt-1">{errors.regYear}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="degrees">Degrees *</Label>
        <Input
          id="degrees"
          placeholder="MBBS, MD, BDS, etc. (comma-separated)"
          className={`mt-2 ${errors.degrees ? 'border-red-500' : ''}`}
          value={formData.degrees}
          onChange={handleInputChange}
        />
        {errors.degrees && <p className="text-xs text-red-500 mt-1">{errors.degrees}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="university">University *</Label>
          <Input
            id="university"
            placeholder="University name"
            className={`mt-2 ${errors.university ? 'border-red-500' : ''}`}
            value={formData.university}
            onChange={handleInputChange}
          />
          {errors.university && <p className="text-xs text-red-500 mt-1">{errors.university}</p>}
        </div>

        <div>
          <Label htmlFor="gradYear">Graduation Year *</Label>
          <Input
            id="gradYear"
            placeholder="e.g., 2010"
            type="number"
            className={`mt-2 ${errors.gradYear ? 'border-red-500' : ''}`}
            value={formData.gradYear}
            onChange={handleInputChange}
          />
          {errors.gradYear && <p className="text-xs text-red-500 mt-1">{errors.gradYear}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="experience">Years of Experience *</Label>
        <Input
          id="experience"
          placeholder="e.g., 10"
          type="number"
          className={`mt-2 ${errors.experience ? 'border-red-500' : ''}`}
          value={formData.experience}
          onChange={handleInputChange}
        />
        {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience}</p>}
      </div>

      <div>
        <Label>Specializations * (Select all that apply)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {specializations.map((spec) => (
            <div
              key={spec}
              onClick={() => toggleSelection(spec, selectedSpecializations, setSelectedSpecializations)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedSpecializations.includes(spec)
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white border-gray-300 hover:border-pink-400'
                }`}
            >
              <p className="text-sm font-medium">{spec}</p>
            </div>
          ))}
        </div>
        {errors.specializations && <p className="text-xs text-red-500 mt-1">{errors.specializations}</p>}
      </div>

      <div>
        <Label>Languages Spoken *</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {languages.map((lang) => (
            <div
              key={lang}
              onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedLanguages.includes(lang)
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white border-gray-300 hover:border-purple-400'
                }`}
            >
              <p className="text-sm font-medium">{lang}</p>
            </div>
          ))}
        </div>
        {errors.languages && <p className="text-xs text-red-500 mt-1">{errors.languages}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          📄 Upload clear copies. All mandatory documents must be submitted for verification.
        </p>
      </div>

      {[
        { key: 'mciReg', label: 'Upload Medical Council Registration', desc: 'Click to upload or drag & drop' },
        { key: 'degree', label: 'Upload Degree Certificate', desc: 'Click to upload' },
        { key: 'idProof', label: 'Upload Government ID', desc: 'Aadhaar / PAN / Passport' },
        { key: 'clinicLetter', label: 'Upload Clinic Letter (if attached to clinic)', desc: 'Optional' },
        { key: 'signature', label: 'Upload signature image (transparent background preferred)', desc: 'Digital signature for prescriptions' }
      ].map((doc) => (
        <div key={doc.key}>
          <Label>{doc.label}</Label>
          <div className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors relative ${files[doc.key] ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-pink-400'}`}>
            <input
              type="file"
              id={`file-${doc.key}`}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(doc.key, e)}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {files[doc.key] ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="size-10 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-green-700 font-medium">{files[doc.key].name}</p>
                <p className="text-xs text-green-600 mt-1">{(files[doc.key].size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <>
                <Upload className="size-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{doc.desc}</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="clinicName">Clinic or Hospital Name</Label>
        <Input
          id="clinicName"
          placeholder="Clinic or Hospital name"
          className="mt-2"
          value={formData.clinicName}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label htmlFor="clinicAddress">Clinic Address</Label>
        <Textarea
          id="clinicAddress"
          placeholder="Complete address"
          rows={3}
          className="mt-2"
          value={formData.clinicAddress}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label>Working Days</Label>
        <div className="grid grid-cols-7 gap-2 mt-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              onClick={() => toggleSelection(day, workingDays, setWorkingDays)}
              className={`p-3 border rounded-lg cursor-pointer text-center transition-colors ${workingDays.includes(day)
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white border-gray-300 hover:border-pink-400'
                }`}
            >
              <p className="text-sm font-medium">{day}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="inClinicFee">In-Clinic Consultation Fee (₹)</Label>
          <Input
            id="inClinicFee"
            placeholder="e.g., 500"
            type="number"
            className="mt-2"
            value={formData.inClinicFee}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="onlineFee">Online Consultation Fee (₹)</Label>
          <Input
            id="onlineFee"
            placeholder="e.g., 300"
            type="number"
            className="mt-2"
            value={formData.onlineFee}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <Label>Consultation Modes</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {consultationModes.map((mode) => (
            <div
              key={mode}
              onClick={() => toggleSelection(mode, selectedModes, setSelectedModes)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedModes.includes(mode)
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white border-gray-300 hover:border-purple-400'
                }`}
            >
              <p className="text-sm font-medium">{mode}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Conditions You Treat</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {conditionsTreated.map((condition) => (
            <div
              key={condition}
              onClick={() => toggleSelection(condition, selectedConditions, setSelectedConditions)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedConditions.includes(condition)
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white border-gray-300 hover:border-pink-400'
                }`}
            >
              <p className="text-sm font-medium">{condition}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Services Offered</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {servicesOffered.map((service) => (
            <div
              key={service}
              onClick={() => toggleSelection(service, selectedServices, setSelectedServices)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedServices.includes(service)
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white border-gray-300 hover:border-purple-400'
                }`}
            >
              <p className="text-sm font-medium">{service}</p>
            </div>
          ))}
          {/* Custom Services Display */}
          {selectedServices.filter(s => !servicesOffered.includes(s)).map((service) => (
            <div
              key={service}
              onClick={() => toggleSelection(service, selectedServices, setSelectedServices)}
              className="p-3 border rounded-lg cursor-pointer transition-colors bg-purple-600 text-white border-purple-600"
            >
              <p className="text-sm font-medium">{service}</p>
            </div>
          ))}

          {/* Add Other Button */}
          {!showCustomServiceInput ? (
            <div
              onClick={() => setShowCustomServiceInput(true)}
              className="p-3 border border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center"
            >
              <p className="text-sm font-medium text-gray-600">+ Other</p>
            </div>
          ) : (
            <div className="p-3 border border-purple-200 rounded-lg bg-white flex items-center gap-2">
              <Input
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                placeholder="Type service..."
                className="h-8 text-sm"
              />
              <Button size="sm" onClick={handleAddCustomService} className="h-8 w-8 p-0 bg-purple-600">
                <CheckCircle className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💰 Bank details required for receiving consultation payments
        </p>
      </div>

      <div>
        <Label htmlFor="accountName">Account Holder Name</Label>
        <p className="text-xs text-gray-600 mt-1">As per bank records</p>
        <Input
          id="accountName"
          placeholder="Account holder name"
          className="mt-2"
          value={formData.accountName}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          placeholder="Account number"
          className="mt-2"
          value={formData.accountNumber}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label htmlFor="ifsc">IFSC Code</Label>
        <Input
          id="ifsc"
          placeholder="e.g., SBIN0001234"
          className="mt-2"
          value={formData.ifsc}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label htmlFor="pan">PAN Number</Label>
        <Input
          id="pan"
          placeholder="e.g., ABCDE1234F"
          className="mt-2 uppercase"
          value={formData.pan}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label htmlFor="gstin">GSTIN (if applicable)</Label>
        <Input
          id="gstin"
          placeholder="15-digit GSTIN"
          maxLength={15}
          className="mt-2 uppercase"
          value={formData.gstin}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          placeholder="Write a brief introduction about yourself, your expertise, and approach to patient care..."
          rows={4}
          className="mt-2"
          value={formData.bio}
          onChange={handleInputChange}
        />
        <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/200 characters</p>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Compliance & Declaration</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
              I accept the Terms & Conditions and Privacy Policy
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox id="registered" defaultChecked />
            <label htmlFor="registered" className="text-sm text-gray-700 cursor-pointer">
              ✅ I confirm that I am a registered medical practitioner authorized to provide medical consultations
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox id="consent" defaultChecked />
            <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer">
              ✅ I consent to E-Clinic verifying my uploaded documents and credentials
            </label>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-2">Verification Process:</h4>
        <ul className="space-y-2 text-sm text-purple-800">
          <li>• Documents reviewed by verification team (24-48 hours)</li>
          <li>• Email/SMS updates on verification status</li>
          <li>• Once verified → "✅ Verified Doctor" badge on profile</li>
          <li>• Your profile goes live on E-Clinic platform</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-gray-900 mb-2">Doctor Registration</h1>
          <p className="text-sm text-gray-600">Join E-Clinic as a verified medical practitioner</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`size-12 rounded-full flex items-center justify-center mb-2 ${isActive
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                      : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="size-6" />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  <p
                    className={`text-xs font-medium ${isActive ? 'text-pink-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <Card className="border-pink-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-pink-900">
              {steps[currentStep - 1].title} {currentStep === 2 && 'Details'}
              {currentStep === 3 && ''}
              {currentStep === 4 && 'Details'}
              {currentStep === 5 && 'Details & Compliance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}

            {/* Navigation */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  <ChevronLeft className="size-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Next
                  <ChevronRight className="size-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => { if (validateStep(5)) handleSubmit(); }}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {loading ? (
                    'Registering...'
                  ) : (
                    <>
                      <CheckCircle className="size-4 mr-2" />
                      Submit Registration
                    </>
                  )}
                </Button>
              )}
              {currentStep === 1 && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}