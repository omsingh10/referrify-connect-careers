import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Lock, User, UserCheck, Eye, EyeOff, Info, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Dummy credentials for testing
const DUMMY_CREDENTIALS = {
  student: { email: "student@demo.com", password: "student123", role: "student" },
  alumni: { email: "alumni@demo.com", password: "alumni123", role: "alumni" },
  admin: { email: "admin@demo.com", password: "admin123", role: "admin" }
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    role: "" 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!validateEmail(loginForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!validatePassword(loginForm.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Check dummy credentials
    const credential = Object.values(DUMMY_CREDENTIALS).find(
      cred => cred.email === loginForm.email && cred.password === loginForm.password
    );

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (credential) {
        toast({
          title: "Login successful!",
          description: `Welcome back, ${credential.role}!`,
        });
        // Redirect based on role
        navigate(`/${credential.role}/dashboard`);
      } else {
        setErrors({ general: "Invalid email or password" });
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!signupForm.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!validateEmail(signupForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!validatePassword(signupForm.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!signupForm.role) {
      newErrors.role = "Please select a role";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created successfully!",
        description: `Welcome to Referrify, ${signupForm.name}!`,
      });
      navigate(`/${signupForm.role}/dashboard`);
    }, 2000);
  };

  const fillDummyCredentials = (role: keyof typeof DUMMY_CREDENTIALS) => {
    const cred = DUMMY_CREDENTIALS[role];
    setLoginForm({ email: cred.email, password: cred.password });
  };

  const handleLoginInputChange = (field: string, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSignupInputChange = (field: string, value: string) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground transition-smooth"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-strong backdrop-blur-sm bg-card/90 border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-xl">R</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to Referrify</CardTitle>
            <CardDescription className="text-base">
              Connect with professionals and grow your career
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Credentials Alert */}
            <Alert className="mb-6 border-info/20 bg-info/5">
              <Info className="h-4 w-4 text-info" />
              <AlertDescription className="text-sm">
                <strong>Demo Credentials:</strong>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Student:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-xs"
                      onClick={() => fillDummyCredentials("student")}
                    >
                      student@demo.com / student123
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Alumni:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-xs"
                      onClick={() => fillDummyCredentials("alumni")}
                    >
                      alumni@demo.com / alumni123
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Admin:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-xs"
                      onClick={() => fillDummyCredentials("admin")}
                    >
                      admin@demo.com / admin123
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="transition-smooth">Login</TabsTrigger>
                <TabsTrigger value="signup" className="transition-smooth">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                {errors.general && (
                  <Alert className="mb-4 border-destructive/20 bg-destructive/5">
                    <AlertDescription className="text-destructive text-sm">
                      {errors.general}
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-10 transition-smooth ${errors.email ? 'border-destructive' : ''}`}
                        value={loginForm.email}
                        onChange={(e) => handleLoginInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-destructive text-xs">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 transition-smooth ${errors.password ? 'border-destructive' : ''}`}
                        value={loginForm.password}
                        onChange={(e) => handleLoginInputChange("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-destructive text-xs">{errors.password}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-primary text-white transition-smooth hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className={`pl-10 transition-smooth ${errors.name ? 'border-destructive' : ''}`}
                        value={signupForm.name}
                        onChange={(e) => handleSignupInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="text-destructive text-xs">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        className={`pl-10 transition-smooth ${errors.email ? 'border-destructive' : ''}`}
                        value={signupForm.email}
                        onChange={(e) => handleSignupInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-destructive text-xs">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                    <div className="relative">
                      <UserCheck className="h-4 w-4 absolute left-3 top-3 text-muted-foreground z-10" />
                      <Select 
                        value={signupForm.role} 
                        onValueChange={(value) => handleSignupInputChange("role", value)}
                        required
                      >
                        <SelectTrigger className={`pl-10 transition-smooth ${errors.role ? 'border-destructive' : ''}`}>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">
                            <div className="flex items-center space-x-2">
                              <span>👨‍🎓</span>
                              <span>Student</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="alumni">
                            <div className="flex items-center space-x-2">
                              <span>🎓</span>
                              <span>Alumni</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center space-x-2">
                              <span>⚙️</span>
                              <span>Admin</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.role && (
                      <p className="text-destructive text-xs">{errors.role}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 transition-smooth ${errors.password ? 'border-destructive' : ''}`}
                        value={signupForm.password}
                        onChange={(e) => handleSignupInputChange("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-destructive text-xs">{errors.password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 transition-smooth ${errors.confirmPassword ? 'border-destructive' : ''}`}
                        value={signupForm.confirmPassword}
                        onChange={(e) => handleSignupInputChange("confirmPassword", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-destructive text-xs">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-primary text-white transition-smooth hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t border-border/40 text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-success" />
                <span>Secured with industry-standard encryption</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;