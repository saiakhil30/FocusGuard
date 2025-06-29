import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

import PermissionSetup from "@/pages/permission-setup";
import Focus from "@/pages/focus";
import AiLearn from "@/pages/ai-learn";
import Analytics from "@/pages/analytics";
import ADHD from "@/pages/adhd";
import Settings from "@/pages/settings";
import Navigation from "@/components/navigation";
import NotFound from "@/pages/not-found";

function Router() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if setup is complete from localStorage
    const setupComplete = localStorage.getItem('focusguard-setup-complete');
    const userData = localStorage.getItem('focusguard-user');
    
    if (setupComplete && userData) {
      setIsSetupComplete(true);
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleSetupComplete = (user: any) => {
    setCurrentUser(user);
    setIsSetupComplete(true);
    localStorage.setItem('focusguard-setup-complete', 'true');
    localStorage.setItem('focusguard-user', JSON.stringify(user));
  };

  if (!isSetupComplete) {
    return <PermissionSetup onSetupComplete={handleSetupComplete} />;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen relative overflow-hidden">
      <Switch>
        <Route path="/" component={() => <Focus user={currentUser} />} />
        <Route path="/focus" component={() => <Focus user={currentUser} />} />
        <Route path="/ai-learn" component={() => <AiLearn user={currentUser} />} />
        <Route path="/analytics" component={() => <Analytics user={currentUser} />} />
        <Route path="/adhd" component={() => <ADHD user={currentUser} />} />
        <Route path="/settings" component={() => <Settings user={currentUser} />} />
        <Route component={NotFound} />
      </Switch>
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
