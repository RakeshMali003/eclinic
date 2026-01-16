import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { 
  Activity, 
  Brain, 
  Video, 
  TrendingUp, 
  Heart, 
  Stethoscope,
  Building2,
  Star,
  Check,
  Pill,
  FlaskConical,
  Tag,
  Crown,
  Sparkles,
  ArrowRight,
  Zap,
  Shield
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { PageView } from "../App";
import { MedicineSection } from "./MedicineSection";
import { GradientText } from "./ui/gradient-text";
import { AnimatedButton } from "./ui/animated-button";
import { ResponsiveGrid, ResponsiveContainer, ResponsiveFlex } from "./ui/responsive-grid";
import { ResponsiveHeading, ResponsiveText } from "./ui/responsive-text";
import { ParticleBackground, FloatingElements } from "./ui/particle-background";
import { MagneticButton, GlowingCard, ParallaxSection } from "./ui/magnetic-button";
import { TextReveal, Typewriter } from "./ui/text-reveal";

interface HomeProps {
  onGetStarted: () => void;
  onNavigate: (view: PageView) => void;
}

export function Home({ onGetStarted, onNavigate }: HomeProps) {
  const [showPromoNav, setShowPromoNav] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / window.innerHeight) * 100;
      setShowPromoNav(scrollPercentage > 10);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    setIsLoaded(true);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const promoItems = [
    { name: "Medicine", offer: "SAVE 23%", color: "bg-pink-500" },
    { name: "Lab Tests", offer: "UPTO 70% OFF", color: "bg-purple-500" },
    { name: "Doctor Consult", offer: "FROM ₹199", color: "bg-blue-500" },
    { name: "Branded Substitute", offer: "UPTO 50% OFF", color: "bg-green-500" },
    { name: "Healthcare", offer: "UPTO 60% OFF", color: "bg-orange-500" },
    { name: "Health Blogs", offer: "", color: "bg-teal-500" },
    { name: "PLUS", offer: "Save 5% Extra", color: "bg-yellow-500" },
    { name: "Offers", offer: "", color: "bg-red-500" },
    { name: "Value Store", offer: "UPTO 50% OFF", color: "bg-indigo-500" }
  ];

  const doctors = [
    {
      name: "Dr. Priya Sharma",
      specialty: "Cardiologist",
      experience: "15 years",
      rating: 4.9,
      consultations: 1200,
      fee: 599,
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      name: "Dr. Rajesh Kumar",
      specialty: "General Physician",
      experience: "12 years",
      rating: 4.8,
      consultations: 2400,
      fee: 399,
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    {
      name: "Dr. Anita Desai",
      specialty: "Pediatrician",
      experience: "10 years",
      rating: 4.9,
      consultations: 1800,
      fee: 499,
      avatar: "https://i.pravatar.cc/150?img=47"
    },
    {
      name: "Dr. Vikram Singh",
      specialty: "Dermatologist",
      experience: "8 years",
      rating: 4.7,
      consultations: 950,
      fee: 549,
      avatar: "https://i.pravatar.cc/150?img=33"
    }
  ];

  const features = [
    {
      icon: Video,
      title: "Telemedicine",
      description: "Secure video consultations with doctors from anywhere, anytime"
    },
    {
      icon: Brain,
      title: "AI Health Summaries",
      description: "AI-powered reports that explain medical data in simple language"
    },
    {
      icon: TrendingUp,
      title: "Health Analytics",
      description: "Track your health trends with intelligent insights and predictions"
    },
    {
      icon: Activity,
      title: "IoT Integration",
      description: "Connect wearables and health devices for real-time monitoring"
    }
  ];

  const benefits = [
    {
      role: "Patients",
      items: ["AI-explained reports", "Easy booking & medicines", "Audio summaries", "24/7 access"]
    },
    {
      role: "Doctors",
      items: ["Faster consultations", "Auto prescriptions", "Patient insights", "Smart scheduling"]
    },
    {
      role: "Clinics",
      items: ["Centralized records", "Smart billing & analytics", "Staff management", "Revenue tracking"]
    }
  ];

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Cardiologist",
      content: "E-Clinic's AI assistant has cut my consultation time by 40%. The auto-generated summaries are incredibly accurate.",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      name: "Rajesh Kumar",
      role: "Patient",
      content: "Finally, I can understand my medical reports! The AI explanations in Hindi made everything so clear.",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    {
      name: "City Care Hospital",
      role: "Multi-Specialty Clinic",
      content: "Managing 50+ doctors and 200+ daily appointments has never been easier. The analytics dashboard is a game-changer.",
      avatar: "https://i.pravatar.cc/150?img=8"
    }
  ];

  const quickAccessItems = [
    { name: "Medicine", icon: Pill },
    { name: "Doctor Consult", icon: Stethoscope },
    { name: "Healthcare", icon: Heart },
    { name: "Lab Tests", icon: FlaskConical },
    { name: "PLUS", icon: Crown },
    { name: "Health Insights", icon: Brain },
    { name: "Offers", icon: Tag }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation onGetStarted={onGetStarted} onNavigate={onNavigate} />

      {/* Promotional Sticky Nav (appears after 10% scroll) */}
      {showPromoNav && (
        <div className="fixed top-0 left-0 right-0 bg-card border-b border-border shadow-md z-40 animate-in slide-in-from-top">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 py-2 overflow-x-auto">
              {promoItems.map((item, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-accent transition-colors whitespace-nowrap flex-shrink-0"
                >
                  <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-xs">●</span>
                  </div>
                  <span className="text-xs">{item.name}</span>
                  {item.offer && (
                    <span className="text-xs text-pink-600">{item.offer}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-blue-900/20 py-12 sm:py-16 lg:py-20 border-b border-border overflow-hidden">
        {/* Advanced Background Effects */}
        <ParticleBackground particleCount={30} />
        <FloatingElements>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/10 via-purple-900/10 to-blue-900/10"></div>
        </FloatingElements>
        
        <ResponsiveContainer>
          <ResponsiveFlex 
            direction={{ default: "col", lg: "row" }}
            justify={{ default: "center", lg: "between" }}
            align={{ default: "center", lg: "start" }}
            gap="gap-8 lg:gap-12"
            className="relative z-10"
          >
            <div className={`space-y-6 sm:space-y-8 text-center lg:text-left ${isLoaded ? 'animate-fade-in' : 'opacity-0'} w-full lg:w-auto`}>
              <div className="space-y-4">
                <TextReveal delay={200}>
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-3 sm:px-4 py-2 text-xs sm:text-sm shadow-lg animate-pulse-glow">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    AI-Powered Healthcare Platform
                  </Badge>
                </TextReveal>
                <TextReveal delay={400}>
                  <ResponsiveHeading level={1} align={{ default: "center", lg: "left" }} className="mb-4 sm:mb-6 leading-tight">
                    Your health, our priority. <GradientText colors={["#ec4899", "#a855f7", "#3b82f6"]}>Digitally.</GradientText>
                  </ResponsiveHeading>
                </TextReveal>
                <TextReveal delay={600}>
                  <ResponsiveText 
                    size={{ default: "base", sm: "lg" }} 
                    align={{ default: "center", lg: "left" }}
                    className="mb-6 sm:mb-8 font-medium leading-relaxed text-foreground/80"
                  >
                    Connect patients, doctors, and clinics on one unified platform. Get AI-powered health insights, telemedicine, and seamless care management.
                  </ResponsiveText>
                </TextReveal>
              </div>
              
              <ResponsiveFlex 
                direction={{ default: "col", sm: "row" }}
                justify={{ default: "center", lg: "start" }}
                gap="gap-3 sm:gap-4"
                className="w-full sm:w-auto"
              >
                <MagneticButton variant="glow" onClick={onGetStarted} className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Book Consult
                </MagneticButton>
                <MagneticButton variant="outline" onClick={() => onNavigate("features")} className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Explore Features
                </MagneticButton>
                <MagneticButton variant="outline" onClick={() => onNavigate("how-it-works")} className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  Learn More
                </MagneticButton>
              </ResponsiveFlex>
              
              <GlowingCard className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mt-6 sm:mt-8 p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-border">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400 animate-pulse" />
                    ))}
                  </div>
                  <ResponsiveText size={{ default: "xs", sm: "sm" }} className="text-foreground/70">
                    1000+ doctors trust us
                  </ResponsiveText>
                </div>
                <div className="hidden sm:block h-8 w-px bg-border"></div>
                <div className="text-center sm:text-left">
                  <ResponsiveText size={{ default: "xs", sm: "sm" }} className="text-foreground/70">
                    Available in
                  </ResponsiveText>
                  <p className="font-semibold text-sm sm:text-base">English & Hindi</p>
                </div>
              </GlowingCard>
            </div>
            <div className="relative w-full lg:w-auto">
              <ParallaxSection speed={0.3}>
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwYXRpZW50JTIwY29uc3VsdGF0aW9ufGVufDF8fHx8MTc2MjMxNjYxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Doctor consultation"
                    className="w-full h-auto max-w-md lg:max-w-full"
                  />
                </div>
                {/* Floating cards */}
                <GlowingCard className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 p-3 sm:p-4 bg-card border-border shadow-xl hidden sm:block">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-pink-900/30 rounded-full flex items-center justify-center border border-pink-800/30">
                      <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-foreground/70">Health Score</p>
                      <p className="text-lg sm:text-xl text-green-600">95%</p>
                    </div>
                  </div>
                </GlowingCard>
              </ParallaxSection>
            </div>
          </ResponsiveFlex>
        </ResponsiveContainer>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4 text-foreground font-bold">Core Features</h2>
            <p className="text-base sm:text-xl text-foreground/80 max-w-2xl mx-auto font-medium">
              Everything you need to deliver exceptional healthcare experiences
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 sm:p-6 hover:shadow-xl transition-shadow bg-card border-border">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-900/30 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-pink-800/30">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl mb-2 text-foreground font-semibold text-center">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-foreground/70">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-pink-900/10 to-purple-900/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl mb-4 sm:mb-6 text-foreground font-bold">AI-Powered Intelligence</h2>
              <p className="text-base sm:text-xl text-foreground/80 mb-6 sm:mb-8 font-medium">
                Our advanced AI transforms complex medical data into simple, understandable insights
              </p>
              <div className="space-y-4">
                {[
                  "AI Report Explainer in English & Hindi",
                  "Voice-to-Text symptom input",
                  "Text-to-Speech health summaries",
                  "Smart symptom checker & specialist suggestions",
                  "Auto-generated consultation summaries"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-foreground/90">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1758202292826-c40e172eed1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVjaG5vbG9neSUyMEFJfGVufDF8fHx8MTc2MjQzNjkyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="AI Medical Technology"
                className="rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md lg:max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4 text-foreground font-bold">Built for Everyone</h2>
            <p className="text-base sm:text-xl text-foreground/80 font-medium">
              Tailored experiences for every user type
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 sm:p-8 bg-card border-border">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  {index === 0 && <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                  {index === 1 && <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                  {index === 2 && <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                </div>
                <h3 className="mb-3 sm:mb-4 text-foreground font-semibold text-center">{benefit.role}</h3>
                <ul className="space-y-2 sm:space-y-3">
                  {benefit.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-foreground/80">
                      <Check className="w-4 h-4 text-pink-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="py-20 bg-gradient-to-br from-pink-900/10 to-purple-900/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-foreground font-bold">Shop by Categories</h2>
            <p className="text-xl text-foreground/80 font-medium">
              Browse our curated health and wellness collections
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {quickAccessItems.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto py-6 flex-col gap-2 bg-card hover:bg-accent hover:shadow-lg transition-all border-border"
                onClick={() => {
                  if (item.name === "Medicine") onNavigate("medicine");
                  else if (item.name === "Doctor Consult") onNavigate("doctor-consult");
                  else if (item.name === "Healthcare") onNavigate("healthcare");
                  else if (item.name === "Lab Tests") onNavigate("lab-tests");
                  else if (item.name === "PLUS") onNavigate("plus");
                  else if (item.name === "Health Insights") onNavigate("health-insights");
                  else if (item.name === "Offers") onNavigate("offers");
                }}
              >
                <item.icon className="w-8 h-8 text-pink-600" />
                <span className="text-sm text-center">{item.name}</span>
              </Button>
            ))}
          </div>
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onNavigate("medicine")}
              className="hover:bg-pink-600 hover:text-white transition-all"
            >
              View All Products →
            </Button>
          </div>
        </div>
      </section>

      {/* Doctors List */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl mb-2 text-foreground font-bold">Consult Top Doctors</h2>
              <p className="text-xl text-foreground/80 font-medium">
                Book appointments with verified specialists
              </p>
            </div>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => onNavigate("doctor-consult")}
              className="hover:bg-pink-600 hover:text-white transition-all"
            >
              View All Doctors →
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-shadow bg-card border-border">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="relative mb-4">
                    <ImageWithFallback 
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 text-white border-none">
                        Available
                      </Badge>
                    </div>
                  </div>
                  <h3 className="mb-1 text-foreground font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-foreground/70 mb-2">{doctor.specialty}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{doctor.rating}</span>
                    <span className="text-xs text-foreground/60">({doctor.consultations}+)</span>
                  </div>
                  <p className="text-xs text-foreground/60">{doctor.experience} experience</p>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-foreground/70">Consultation Fee</span>
                    <span className="text-lg text-pink-600">₹{doctor.fee}</span>
                  </div>
                  <Button className="w-full" onClick={onGetStarted}>
                    <Video className="w-4 h-4 mr-2" />
                    Consult Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Medicine Section */}
      <MedicineSection onNavigate={onNavigate} />

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-purple-900/10 to-pink-900/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4 text-foreground font-bold">Trusted by Healthcare Professionals</h2>
            <p className="text-xl text-foreground/80 font-medium">
              See what our users have to say
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-card border-border">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/70 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <ImageWithFallback 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-foreground font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-4">Ready to Transform Healthcare?</h2>
          <p className="text-xl mb-8 text-pink-100">
            Join thousands of healthcare providers already using E-Clinic
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={onGetStarted}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
          <p className="mt-6 text-pink-100">No credit card required • Free 30-day trial</p>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
