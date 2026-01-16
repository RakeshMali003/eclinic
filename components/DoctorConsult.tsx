import { useState } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { PageView } from "../App";
import { Video, Calendar, Star, Clock, Search, Filter, Pill, ArrowRight, Heart, Award, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DoctorConsultProps {
  onNavigate: (view: PageView) => void;
}

export function DoctorConsult({ onNavigate }: DoctorConsultProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const specialties = [
    { id: "all", name: "All Specialties" },
    { id: "general", name: "General Physician" },
    { id: "cardio", name: "Cardiologist" },
    { id: "pediatric", name: "Pediatrician" },
    { id: "derma", name: "Dermatologist" },
    { id: "ortho", name: "Orthopedic" },
    { id: "gyno", name: "Gynecologist" },
  ];

  const doctors = [
    { id: 1, name: "Dr. Priya Sharma", specialty: "Cardiologist", specialtyId: "cardio", exp: "15 years", rating: 4.9, consultations: 1200, fee: 599, nextAvail: "Today, 2:00 PM", avatar: "https://i.pravatar.cc/150?img=5", languages: ["English", "Hindi"], verified: true },
    { id: 2, name: "Dr. Rajesh Kumar", specialty: "General Physician", specialtyId: "general", exp: "12 years", rating: 4.8, consultations: 2400, fee: 399, nextAvail: "Today, 11:30 AM", avatar: "https://i.pravatar.cc/150?img=12", languages: ["English", "Hindi", "Tamil"], verified: true },
    { id: 3, name: "Dr. Anita Desai", specialty: "Pediatrician", specialtyId: "pediatric", exp: "10 years", rating: 4.9, consultations: 1800, fee: 499, nextAvail: "Tomorrow, 10:00 AM", avatar: "https://i.pravatar.cc/150?img=47", languages: ["English", "Hindi"], verified: true },
    { id: 4, name: "Dr. Vikram Singh", specialty: "Dermatologist", specialtyId: "derma", exp: "8 years", rating: 4.7, consultations: 950, fee: 549, nextAvail: "Today, 4:30 PM", avatar: "https://i.pravatar.cc/150?img=33", languages: ["English", "Hindi", "Punjabi"], verified: true },
    { id: 5, name: "Dr. Meera Patel", specialty: "Gynecologist", specialtyId: "gyno", exp: "14 years", rating: 4.9, consultations: 1500, fee: 699, nextAvail: "Today, 3:00 PM", avatar: "https://i.pravatar.cc/150?img=9", languages: ["English", "Hindi", "Gujarati"], verified: true },
    { id: 6, name: "Dr. Arjun Reddy", specialty: "Orthopedic", specialtyId: "ortho", exp: "11 years", rating: 4.8, consultations: 1100, fee: 649, nextAvail: "Tomorrow, 9:00 AM", avatar: "https://i.pravatar.cc/150?img=14", languages: ["English", "Hindi", "Telugu"], verified: true },
  ];

  const medicines = [
    { id: 1, name: "Paracetamol 500mg", price: 45, mrp: 60, image: "💊", discount: 25, category: "Fever & Pain" },
    { id: 2, name: "Cetrizine 10mg", price: 25, mrp: 35, image: "💊", discount: 29, category: "Allergy" },
    { id: 3, name: "Vitamin D3 60K", price: 85, mrp: 100, image: "💊", discount: 15, category: "Vitamins" },
    { id: 4, name: "Omeprazole 20mg", price: 65, mrp: 80, image: "💊", discount: 19, category: "Digestive" },
  ];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doc.specialtyId === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation onNavigate={onNavigate} onGetStarted={() => onNavigate("login")} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl mb-6 font-bold">Consult Top Doctors Online</h1>
            <p className="text-xl mb-8 opacity-90 font-medium">
              Video consultations with verified specialists starting from ₹199
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for doctors, specialties..."
                  className="pl-12 pr-4 py-6 text-lg bg-white text-gray-900 placeholder-gray-500 border-gray-200"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => onNavigate("login")}>
                <Video className="w-5 h-5 mr-2" />
                Book Online Consult
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20" onClick={() => onNavigate("login")}>
                <Calendar className="w-5 h-5 mr-2" />
                Book In-Clinic Visit
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Filter */}
      <section className="bg-card border-b border-border py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Filter className="w-5 h-5 text-foreground/70 flex-shrink-0" />
            {specialties.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                  selectedSpecialty === spec.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground/90'
                }`}
              >
                {spec.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-br from-pink-900/10 to-purple-900/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <Card className="p-6 bg-card border-border">
              <div className="text-4xl text-pink-600 mb-2">500+</div>
              <p className="text-foreground/70 font-medium">Verified Doctors</p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="text-4xl text-purple-600 mb-2">50K+</div>
              <p className="text-foreground/70 font-medium">Consultations</p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="text-4xl text-blue-600 mb-2">4.8★</div>
              <p className="text-foreground/70 font-medium">Average Rating</p>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="text-4xl text-green-600 mb-2">24/7</div>
              <p className="text-foreground/70 font-medium">Available</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Doctors */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl mb-2 text-foreground font-bold">Available Doctors</h2>
              <p className="text-foreground/80 font-medium">
                Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="p-6 hover:shadow-xl transition-all bg-card border-border">
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <ImageWithFallback 
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    {doctor.verified && (
                      <div className="absolute bottom-3 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <Badge className="mb-2 bg-green-500">Available</Badge>
                  <h3 className="mb-1 text-foreground font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-foreground/70 mb-2">{doctor.specialty}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{doctor.rating}</span>
                    <span className="text-xs text-foreground/60">({doctor.consultations}+ consults)</span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {doctor.languages.map((lang, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-foreground/60">{doctor.exp} experience</p>
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/70">Consultation Fee</span>
                    <span className="text-lg text-pink-600 font-semibold">₹{doctor.fee}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Clock className="w-4 h-4" />
                    <span>{doctor.nextAvail}</span>
                  </div>
                  <Button className="w-full" onClick={() => onNavigate("login")}>
                    <Video className="w-4 h-4 mr-2" />
                    Consult Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-16">
              <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl mb-2 text-foreground font-semibold">No doctors found</h3>
              <p className="text-foreground/70 mb-4 font-medium">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Medicine Section */}
      <section className="py-16 bg-gradient-to-br from-pink-900/10 to-purple-900/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl mb-2 text-foreground font-bold">Popular Medicines</h2>
              <p className="text-foreground/80 font-medium">Order medicines online with fast delivery</p>
            </div>
            <Button variant="outline" onClick={() => onNavigate("medicine")}>
              View All Medicines
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicines.map((medicine) => (
              <Card key={medicine.id} className="p-6 hover:shadow-xl transition-all bg-card border-border">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{medicine.image}</div>
                  <Badge variant="secondary" className="mb-2">{medicine.category}</Badge>
                  <h3 className="text-lg mb-2 text-foreground font-semibold">{medicine.name}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-pink-600 font-semibold">₹{medicine.price}</span>
                    <span className="text-sm text-foreground/70 line-through">₹{medicine.mrp}</span>
                  </div>
                  <Badge className="bg-green-500">{medicine.discount}% OFF</Badge>
                  <Button className="w-full" onClick={() => onNavigate("medicine")}>
                    <Pill className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" onClick={() => onNavigate("medicine")}>
              <Pill className="w-5 h-5 mr-2" />
              Browse All Medicines
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12 text-foreground font-bold">Why Choose E-Clinic?</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-pink-900/30 rounded-full mx-auto mb-4 flex items-center justify-center border border-pink-800/30">
                <CheckCircle className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="mb-2 text-foreground font-semibold">Verified Doctors</h3>
              <p className="text-sm text-foreground/70">All doctors are verified with valid medical licenses</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-900/30 rounded-full mx-auto mb-4 flex items-center justify-center border border-blue-800/30">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-foreground font-semibold">Secure Consultations</h3>
              <p className="text-sm text-foreground/70">HIPAA compliant video consultations</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-purple-900/30 rounded-full mx-auto mb-4 flex items-center justify-center border border-purple-800/30">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="mb-2 text-foreground font-semibold">24/7 Support</h3>
              <p className="text-sm text-foreground/70">Round the clock customer support</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-green-900/30 rounded-full mx-auto mb-4 flex items-center justify-center border border-green-800/30">
                <Pill className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-foreground font-semibold">Medicine Delivery</h3>
              <p className="text-sm text-foreground/70">Fast home delivery of medicines</p>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
