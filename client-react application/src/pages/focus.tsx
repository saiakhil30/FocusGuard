import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Plus, Phone, Lock, Timer } from "lucide-react";
import EnforcementTimer from "@/components/enforcement-timer";
import SystemLockdown from "@/components/system-lockdown";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface FocusProps {
  user: any;
}

export default function Focus({ user }: FocusProps) {
  const [timeLeft, setTimeLeft] = useState(165); // 2h 45m in minutes
  const [isSystemLocked, setIsSystemLocked] = useState(false);
  const [emergencyOverridesUsed, setEmergencyOverridesUsed] = useState(0);

  // Get active focus session
  const { data: activeSession, isLoading } = useQuery({
    queryKey: [`/api/focus-sessions/active/${user?.id}`],
    enabled: !!user?.id
  });

  // Get blocked apps
  const { data: blockedApps = [] } = useQuery({
    queryKey: [`/api/blocked-apps/user/${user?.id}`],
    enabled: !!user?.id
  });

  // Get active study schedule
  const { data: schedule } = useQuery({
    queryKey: [`/api/study-schedules/user/${user?.id}/active`],
    enabled: !!user?.id
  });

  // Emergency override mutation
  const emergencyOverride = useMutation({
    mutationFn: () => apiRequest('POST', `/api/emergency-override/${user?.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/focus-sessions/active/${user?.id}`] });
    }
  });

  // Start focus session mutation
  const startSession = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/focus-sessions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/focus-sessions/active/${user?.id}`] });
    }
  });

  // Effect to handle system lockdown based on active session
  useEffect(() => {
    if (activeSession?.isActive && user?.systemLockdownEnabled) {
      setIsSystemLocked(true);
    } else {
      setIsSystemLocked(false);
    }
  }, [activeSession, user?.systemLockdownEnabled]);

  const handleEmergencyOverride = () => {
    setEmergencyOverridesUsed(prev => prev + 1);
    setIsSystemLocked(false);
    // Grant 5 minutes of access
    setTimeout(() => {
      if (activeSession && activeSession.isActive) {
        setIsSystemLocked(true);
      }
    }, 5 * 60 * 1000); // 5 minutes
    emergencyOverride.mutate();
  };

  const handleExtendFocus = () => {
    if (activeSession) {
      // Extend current session by 1 hour
      setTimeLeft(prev => prev + 60);
    }
  };

  const popularApps = [
    { name: "Instagram", icon: "fab fa-instagram", blocked: true },
    { name: "YouTube", icon: "fab fa-youtube", blocked: true },
    { name: "TikTok", icon: "fab fa-tiktok", blocked: true },
    { name: "Twitter", icon: "fab fa-twitter", blocked: true },
    { name: "Snapchat", icon: "fab fa-snapchat", blocked: true },
    { name: "WhatsApp", icon: "fab fa-whatsapp", blocked: false }, // Communication allowed
    { name: "Netflix", icon: "fab fa-netflix", blocked: true },
    { name: "Facebook", icon: "fab fa-facebook", blocked: true }
  ];

  const todaySchedule = [
    { name: "Morning Study", time: "6:00 - 10:00 AM", status: "completed" },
    { name: "Afternoon Focus", time: "2:00 - 6:00 PM", status: "active" },
    { name: "Evening Review", time: "8:00 - 10:00 PM", status: "pending" }
  ];

  const stats = {
    studyHours: "8.5h",
    focusStreak: 12,
    blockedApps: 23
  };

  if (isLoading) {
    return (
      <div className="p-6 pb-24">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* System Lockdown Overlay */}
      {isSystemLocked && (
        <SystemLockdown
          user={user}
          isActive={isSystemLocked}
          timeRemaining={timeLeft}
          onEmergencyOverride={handleEmergencyOverride}
          emergencyOverridesUsed={emergencyOverridesUsed}
          maxEmergencyOverrides={3}
        />
      )}
      
      <div className="min-h-screen bg-gray-50 pb-24">
      {/* Status Bar */}
      <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 ios-gradient-blue rounded-lg flex items-center justify-center mr-3">
            <Shield className="text-white w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">FocusGuard</h2>
            <p className="text-xs text-gray-500">
              {user?.examType?.toUpperCase() || 'Focus'} Mode Active
            </p>
          </div>
        </div>
        <EnforcementTimer timeLeft={timeLeft} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleEmergencyOverride}
            disabled={emergencyOverride.isPending}
            variant="outline"
            className="bg-white p-4 h-auto flex-col"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg mb-2 flex items-center justify-center">
              <AlertTriangle className="text-red-500 w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-900">Emergency</p>
            <p className="text-xs text-gray-500">5 min override</p>
          </Button>
          
          <Button
            onClick={handleExtendFocus}
            variant="outline"
            className="bg-white p-4 h-auto flex-col"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg mb-2 flex items-center justify-center">
              <Plus className="text-green-500 w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-900">Extend</p>
            <p className="text-xs text-gray-500">Add 1 hour</p>
          </Button>
        </div>
      </div>

      {/* UPSC/TSPSC Mode */}
      <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <div className="w-6 h-6 bg-orange-500 rounded mr-2 flex items-center justify-center">
            <span className="text-white text-xs">📚</span>
          </div>
          Exam Preparation Mode
        </h3>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {user?.examType?.toUpperCase() || 'Study'} Mode
                </h4>
                <p className="text-sm text-gray-500">Strict enforcement active</p>
              </div>
              <div className="bg-green-500 text-white rounded-full px-3 py-1 text-xs font-bold">
                ON
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-500">{stats.studyHours}</div>
                <div className="text-xs text-gray-500">Today</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-500">{stats.focusStreak}</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-500">{stats.blockedApps}</div>
                <div className="text-xs text-gray-500">Apps Blocked</div>
              </div>
            </div>

            {/* Enforcement Schedule */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h5 className="font-medium text-gray-900 mb-2">Today's Schedule</h5>
              <div className="space-y-2">
                {todaySchedule.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    <span className={`font-medium ${
                      item.status === 'completed' ? 'text-green-500' :
                      item.status === 'active' ? 'text-blue-500' : 'text-gray-400'
                    }`}>
                      {item.time} {item.status === 'completed' ? '✓' : 
                       item.status === 'active' ? '(Active)' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Restrictions */}
      <div className="px-6 py-4 bg-white">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Shield className="text-red-500 w-5 h-5 mr-2" />
          Active Restrictions
        </h3>

        {/* Complete App Lockdown */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">🔒</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Complete Lockdown</h4>
                <p className="text-sm text-gray-500">System-level blocking active</p>
              </div>
            </div>
            <div className="bg-red-500 text-white rounded-full px-3 py-1 text-xs font-bold animate-pulse">
              ACTIVE
            </div>
          </div>
          <div className="text-xs text-red-600 bg-red-100 rounded-lg p-2">
            <AlertTriangle className="inline w-3 h-3 mr-1" />
            Cannot be bypassed during focus periods
          </div>
        </div>

        {/* Blocked Apps Grid */}
        <div className="grid grid-cols-4 gap-3">
          {popularApps.slice(0, 8).map((app, index) => (
            <div key={index} className={`text-center ${app.blocked ? 'opacity-50' : ''}`}>
              <div className={`w-12 h-12 rounded-xl mb-1 flex items-center justify-center ${
                app.blocked ? 'bg-gray-200' : 'bg-green-100'
              }`}>
                <i className={`${app.icon} ${app.blocked ? 'text-gray-400' : 'text-green-500'} text-lg`}></i>
              </div>
              <p className="text-xs text-gray-500">{app.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Emergency Button */}
      <div className="fixed bottom-20 right-6 z-40">
        <Button
          size="icon"
          className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg bounce-subtle"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>
      </div>
    </>
  );
}
