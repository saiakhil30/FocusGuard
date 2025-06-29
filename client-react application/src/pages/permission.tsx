import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Settings, Camera, Bell, BarChart3, GraduationCap, Briefcase, ArrowRight, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PermissionSetupProps {
  onSetupComplete: (user: any) => void;
}

export default function PermissionSetup({ onSetupComplete }: PermissionSetupProps) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'student' | 'professional'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const permissions = [
    {
      icon: Settings,
      title: "System Control",
      description: "App blocking & device management",
      detail: "Required for time-based restrictions and complete app blocking",
      color: "bg-red-500",
      granted: true
    },
    {
      icon: Camera,
      title: "Camera & Files",
      description: "AI learning content access",
      detail: "For scanning documents, photos and uploading study materials",
      color: "bg-orange-500",
      granted: true
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Study reminders & alerts",
      detail: "For focus session reminders and enforcement notifications",
      color: "bg-purple-500",
      granted: true
    },
    {
      icon: BarChart3,
      title: "Usage Analytics",
      description: "Screen time monitoring",
      detail: "To track app usage and provide insights",
      color: "bg-teal-500",
      granted: true
    }
  ];

  const handleContinue = async () => {
    setIsLoading(true);
    
    try {
      // Request permissions
      await requestPermissions();
      
      // Create user profile
      const userData = {
        username: `user_${Date.now()}`,
        password: 'temp_password',
        ageGroup: selectedAgeGroup,
        focusMode: selectedAgeGroup === 'student' ? 'exam' : 'work',
        examType: selectedAgeGroup === 'student' ? 'upsc' : null,
        permissionsGranted: {
          system: true,
          camera: true,
          notifications: true,
          analytics: true
        },
        parentalControlsEnabled: selectedAgeGroup === 'student',
        screenTimeLimit: selectedAgeGroup === 'student' ? 180 : 480,
        bedtimeHour: selectedAgeGroup === 'student' ? 22 : 24
      };

      const response = await apiRequest('POST', '/api/users', userData);
      const user = await response.json();
      
      onSetupComplete(user);
    } catch (error) {
      console.error('Setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermissions = async () => {
    // Simulate permission requests
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="absolute inset-0 z-50 bg-white fade-in">
      <div className="p-6 pt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 ios-gradient-blue rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">FocusGuard Enhanced</h1>
          <p className="text-gray-500">Complete digital wellness with AI learning</p>
        </div>

        {/* Permission Cards */}
        <div className="space-y-4 mb-8">
          {permissions.map((permission, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 ${permission.color} rounded-lg flex items-center justify-center mr-3`}>
                      <permission.icon className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{permission.title}</h3>
                      <p className="text-sm text-gray-500">{permission.description}</p>
                    </div>
                  </div>
                  {permission.granted && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="text-white w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                  {permission.detail}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Age Selection */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Select Age Group</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedAgeGroup('student')}
              className={`rounded-xl p-3 text-sm font-medium transition-all ${
                selectedAgeGroup === 'student'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <GraduationCap className="w-5 h-5 mx-auto mb-1" />
              Student (13-25)
            </button>
            <button
              onClick={() => setSelectedAgeGroup('professional')}
              className={`rounded-xl p-3 text-sm font-medium transition-all ${
                selectedAgeGroup === 'professional'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Briefcase className="w-5 h-5 mx-auto mb-1" />
              Professional (25+)
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full ios-gradient-blue text-white font-semibold py-4 rounded-xl shadow-lg"
        >
          {isLoading ? 'Setting up...' : 'Continue Setup'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
