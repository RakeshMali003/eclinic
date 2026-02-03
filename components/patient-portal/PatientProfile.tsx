import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Activity, 
  Edit, 
  Save, 
  Shield, 
  Upload,
  File,
  Eye,
  X,
  Plus,
  Droplet,
  AlertTriangle,
  Pill,
  Download,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { PatientUser } from '../PatientPortal';

interface PatientProfileProps {
  patient: PatientUser;
}

const documents = [
  {
    id: 1,
    name: 'Insurance_Card.pdf',
    type: 'Insurance',
    date: '2025-01-10',
    size: '2.4 MB'
  },
  {
    id: 2,
    name: 'Medical_Record_2024.pdf',
    type: 'Medical Record',
    date: '2024-12-15',
    size: '1.8 MB'
  }
];

export function PatientProfile({ patient }: PatientProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [allergies, setAllergies] = useState(['Penicillin', 'Peanuts']);
  const [medications, setMedications] = useState(['Metformin 500mg']);
  const [chronicDiseases, setChronicDiseases] = useState(['Diabetes Type 2', 'Hypertension']);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newDisease, setNewDisease] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddItem = (
    value: string,
    setValue: (v: string) => void,
    items: string[],
    setItems: (items: string[]) => void
  ) => {
    if (value.trim()) {
      setItems([...items, value.trim()]);
      setValue('');
    }
  };

  const handleRemoveItem = (
    index: number,
    items: string[],
    setItems: (items: string[]) => void
  ) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const validateDateOfBirth = (dob: string) => {
    if (!dob) return "Date of Birth is required";

    const dobDate = new Date(dob);
    const today = new Date();

    if (dobDate > today) return "Date of Birth cannot be in the future";

    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate()) ? age - 1 : age;

    if (actualAge > 150) return "Please enter a valid date of birth";
    if (actualAge < 0) return "Date of Birth cannot be in the future";

    return "";
  };

  const handleSaveProfile = () => {
    const dobInput = document.getElementById('dob') as HTMLInputElement;
    const dobValue = dobInput?.value || '';
    const dobError = validateDateOfBirth(dobValue);

    if (dobError) {
      setErrors({ dob: dobError });
      return;
    }

    setErrors({});
    // Save profile logic here
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-gray-900 mb-1">My Profile</h1>
          <p className="text-sm text-gray-600">Manage your personal and medical information</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? 'bg-gradient-to-r from-pink-600 to-purple-600' : ''}
          variant={isEditing ? 'default' : 'outline'}
        >
          {isEditing ? (
            <>
              <Save className="size-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="size-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border-pink-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="size-24 mb-4">
                <AvatarFallback className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-2xl">
                  {patient.avatar}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-semibold text-gray-900">{patient.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{patient.email}</p>
              
              {patient.abhaId && (
                <div className="w-full p-3 bg-pink-50 rounded-lg mb-4 border border-pink-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Shield className="size-4 text-pink-600" />
                    <p className="text-xs font-medium text-pink-900">ABHA ID</p>
                  </div>
                  <p className="text-sm font-mono text-pink-700">{patient.abhaId}</p>
                </div>
              )}
              
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-gray-400" />
                  <span className="text-gray-700">{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-gray-400" />
                  <span className="text-gray-700">32 years old</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-gray-400" />
                  <span className="text-gray-700">Mumbai, India</span>
                </div>
              </div>
              
              {!isEditing && (
                <Button className="w-full mt-6" variant="outline">
                  Upload Photo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2 border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-900">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">
                  <User className="size-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="medical">
                  <Heart className="size-4 mr-2" />
                  Medical
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <File className="size-4 mr-2" />
                  Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      defaultValue={patient.name}
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={patient.email}
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      defaultValue={patient.phone}
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      defaultValue="1993-05-15"
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      defaultValue="Male"
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input
                      id="bloodGroup"
                      defaultValue="O+"
                      disabled={!isEditing}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    defaultValue="123 Main Street, Andheri West, Mumbai - 400053, Maharashtra, India"
                    disabled={!isEditing}
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-6 mt-4">
                <Card className="border-pink-200 bg-pink-50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="size-5 text-pink-600" />
                      Medical Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* ABHA ID */}
                    <div>
                      <Label>ABHA Health ID</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          value={patient.abhaId}
                          disabled={!isEditing}
                          className="font-mono bg-white"
                        />
                        <Badge className="bg-green-600">Verified</Badge>
                      </div>
                    </div>

                    {/* Blood Group */}
                    <div>
                      <Label className="flex items-center gap-2">
                        <Droplet className="size-4 text-pink-600" />
                        Blood Group
                      </Label>
                      <Input
                        defaultValue="O+"
                        disabled={!isEditing}
                        className="mt-2 bg-white"
                      />
                    </div>

                    {/* Allergies */}
                    <div>
                      <Label className="flex items-center gap-2">
                        <AlertTriangle className="size-4 text-orange-600" />
                        Allergies
                      </Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {allergies.map((allergy, index) => (
                            <Badge key={index} variant="outline" className="bg-white">
                              {allergy}
                              {isEditing && (
                                <button
                                  onClick={() => handleRemoveItem(index, allergies, setAllergies)}
                                  className="ml-2 hover:text-red-600"
                                >
                                  <X className="size-3" />
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add allergy"
                              value={newAllergy}
                              onChange={(e) => setNewAllergy(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddItem(newAllergy, setNewAllergy, allergies, setAllergies);
                                }
                              }}
                              className="bg-white"
                            />
                            <Button 
                              size="sm"
                              onClick={() => handleAddItem(newAllergy, setNewAllergy, allergies, setAllergies)}
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Current Medications */}
                    <div>
                      <Label className="flex items-center gap-2">
                        <Pill className="size-4 text-blue-600" />
                        Current Medications
                      </Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {medications.map((medication, index) => (
                            <Badge key={index} variant="outline" className="bg-white">
                              {medication}
                              {isEditing && (
                                <button
                                  onClick={() => handleRemoveItem(index, medications, setMedications)}
                                  className="ml-2 hover:text-red-600"
                                >
                                  <X className="size-3" />
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add medication"
                              value={newMedication}
                              onChange={(e) => setNewMedication(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddItem(newMedication, setNewMedication, medications, setMedications);
                                }
                              }}
                              className="bg-white"
                            />
                            <Button 
                              size="sm"
                              onClick={() => handleAddItem(newMedication, setNewMedication, medications, setMedications)}
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chronic Diseases */}
                    <div>
                      <Label className="flex items-center gap-2">
                        <Activity className="size-4 text-purple-600" />
                        Chronic Diseases
                      </Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {chronicDiseases.map((disease, index) => (
                            <Badge key={index} variant="outline" className="bg-white">
                              {disease}
                              {isEditing && (
                                <button
                                  onClick={() => handleRemoveItem(index, chronicDiseases, setChronicDiseases)}
                                  className="ml-2 hover:text-red-600"
                                >
                                  <X className="size-3" />
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add chronic disease and press Enter"
                              value={newDisease}
                              onChange={(e) => setNewDisease(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddItem(newDisease, setNewDisease, chronicDiseases, setChronicDiseases);
                                }
                              }}
                              className="bg-white"
                            />
                            <Button 
                              size="sm"
                              onClick={() => handleAddItem(newDisease, setNewDisease, chronicDiseases, setChronicDiseases)}
                            >
                              <Plus className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {isEditing && (
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                    <Save className="size-4 mr-2" />
                    Save Medical Details
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-6 mt-4">
                {/* Upload Section */}
                <Card className="border-2 border-dashed border-pink-300 bg-pink-50">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-pink-100 rounded-full">
                          <Upload className="size-8 text-pink-600" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Upload Documents</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload Medical Records, Insurance Card, or other documents
                      </p>
                      <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                        <Upload className="size-4 mr-2" />
                        Choose Files
                      </Button>
                      <p className="text-xs text-gray-500 mt-3">
                        Supported formats: PDF, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents List */}
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="border-pink-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 rounded-lg">
                              <File className="size-5 text-pink-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{doc.name}</h4>
                              <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {doc.type}
                                </Badge>
                                <span>{doc.date}</span>
                                <span>{doc.size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="size-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="bg-pink-50 border-pink-300 text-pink-600 hover:bg-pink-100">
                              <Download className="size-4 mr-1" />
                              Download
                            </Button>
                            {isEditing && (
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <X className="size-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}