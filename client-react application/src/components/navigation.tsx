import { useLocation } from "wouter";
import { Home, Bot, BarChart3, Brain, Settings as SettingsIcon } from "lucide-react";

export default function Navigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/focus", icon: Home, label: "Focus" },
    { path: "/ai-learn", icon: Bot, label: "AI Learn" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/adhd", icon: Brain, label: "ADHD" },
    { path: "/settings", icon: SettingsIcon, label: "Settings" }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-6 py-3 z-30">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path || (location === "/" && item.path === "/focus");
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center transition-colors ${
                isActive ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
