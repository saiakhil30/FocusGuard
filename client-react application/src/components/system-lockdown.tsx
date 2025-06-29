import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Clock, AlertTriangle } from "lucide-react";

interface SystemLockdownProps {
  user: any;
  isActive: boolean;
  timeRemaining: number; // minutes
  onEmergencyOverride: () => void;
  emergencyOverridesUsed: number;
  maxEmergencyOverrides: number;
}

export default function SystemLockdown({ 
  user, 
  isActive, 
  timeRemaining, 
  onEmergencyOverride,
  emergencyOverridesUsed,
  maxEmergencyOverrides
}: SystemLockdownProps) {
  const [displayTime, setDisplayTime] = useState(timeRemaining);
  const [showEmergencyOption, setShowEmergencyOption] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setDisplayTime(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [isActive]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const canUseEmergencyOverride = emergencyOverridesUsed < maxEmergencyOverrides;

  if (!isActive) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <Shield className="h-5 w-5" />
            System Ready
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 dark:text-green-300">
            Complete app restriction is ready to activate when you start a focus session.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 bg-red-900/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 bg-white dark:border-red-800 dark:bg-gray-900">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-800 dark:text-red-200">
            Complete App Restriction Active
          </CardTitle>
          <Badge variant="destructive" className="mx-auto">
            System Locked
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
              {formatTime(displayTime)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Time remaining in focus session
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                  All Applications Blocked
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Complete system lockdown is active. No apps can be accessed until the session ends.
                </p>
              </div>
            </div>
          </div>

          {user?.examType && (
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {user.examType.toUpperCase()} Preparation Mode
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Strict enforcement enabled for exam preparation
              </p>
            </div>
          )}

          {canUseEmergencyOverride && (
            <div className="space-y-3">
              {!showEmergencyOption ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEmergencyOption(true)}
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-950"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Emergency Override Available
                </Button>
              ) : (
                <div className="space-y-3 p-3 border border-orange-300 dark:border-orange-600 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    <strong>Warning:</strong> Emergency override will allow 5 minutes of app access.
                    Use only for genuine emergencies.
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    Overrides used: {emergencyOverridesUsed} / {maxEmergencyOverrides}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={onEmergencyOverride}
                      className="flex-1"
                    >
                      Confirm Override
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEmergencyOption(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Focus mode: {user?.focusMode || 'study'} • Session will end automatically
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
