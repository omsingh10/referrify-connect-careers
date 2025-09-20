import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Briefcase, Star, Upload, Brain, TrendingUp, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Smart Resume Upload",
      description: "Upload your resume and get AI-powered insights and keyword analysis"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Request Referrals",
      description: "Connect with alumni and professionals in your field for job referrals"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Job Match Score",
      description: "Get personalized job match scores with AI-powered recommendations"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Track Progress",
      description: "Monitor your referral requests and application status in real-time"
    }
  ];

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Find internships and entry-level positions",
      icon: "👨‍🎓",
      route: "/student/dashboard"
    },
    {
      id: "alumni",
      title: "Alumni",
      description: "Help students and manage referrals",
      icon: "🎓",
      route: "/alumni/dashboard"
    },
    {
      id: "admin",
      title: "Admin",
      description: "Manage platform and analytics",
      icon: "⚙️",
      route: "/admin/dashboard"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
              Referrify
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-secondary"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button 
              variant="outline" 
              className="hover:bg-secondary"
              onClick={() => navigate("/auth")}
            >
              Login
            </Button>
            <Button 
              className="gradient-primary text-white hover:opacity-90 transition-opacity"
              onClick={() => navigate("/auth")}
            >
              Create Account
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Star className="h-4 w-4 mr-2" />
            Where connections turn into careers
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
              Referrify
            </span>
            <br />
            <span className="text-foreground">Your Career Network</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with alumni and professionals to unlock job opportunities. 
            Upload your resume, get AI insights, and land your dream role through meaningful referrals.
          </p>

          {/* Role Selection */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-6 text-foreground">Choose your role to get started</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {roles.map((role) => (
                <Card 
                  key={role.id}
                  className={`p-6 cursor-pointer transition-all duration-300 card-hover ${
                    selectedRole === role.id 
                      ? 'ring-2 ring-primary shadow-medium bg-gradient-subtle' 
                      : 'hover:shadow-soft'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="text-4xl mb-4">{role.icon}</div>
                  <h4 className="text-xl font-semibold mb-2">{role.title}</h4>
                  <p className="text-muted-foreground text-sm">{role.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="gradient-primary text-white px-8 py-4 text-lg font-semibold transition-smooth hover:scale-105 hover:shadow-glow"
              disabled={!selectedRole}
              onClick={() => selectedRole && navigate("/auth")}
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-2 hover:bg-secondary transition-smooth"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-subtle">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Your Success</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build meaningful connections and advance your career
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 text-center card-hover bg-card/80 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="gradient-primary p-3 rounded-full w-fit mx-auto mb-4 shadow-soft">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">10K+</div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">5K+</div>
              <p className="text-muted-foreground">Successful Referrals</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">500+</div>
              <p className="text-muted-foreground">Partner Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Referrify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;