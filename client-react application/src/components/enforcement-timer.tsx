import { useEffect, useState } from "react";

interface EnforcementTimerProps {
  timeLeft: number; // in minutes
}

export default function EnforcementTimer({ timeLeft: initialTime }: EnforcementTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  const formatTime = (minutes: number) => {
    if (minutes <= 0) return "LOCKED";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className={`rounded-full px-3 py-1 ${
      timeLeft <= 0 ? 'bg-red-500 animate-pulse' : 'bg-red-500'
    }`}>
      <span className="text-white text-xs font-bold">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
