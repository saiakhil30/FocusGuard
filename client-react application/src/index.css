@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(20, 14.3%, 4.1%);
  --muted: hsl(60, 4.8%, 95.9%);
  --muted-foreground: hsl(25, 5.3%, 44.7%);
  --popover: hsl(0, 0%, 100%);
  --popover-foreground: hsl(20, 14.3%, 4.1%);
  --card: hsl(0, 0%, 100%);
  --card-foreground: hsl(20, 14.3%, 4.1%);
  --border: hsl(20, 5.9%, 90%);
  --input: hsl(20, 5.9%, 90%);
  --primary: hsl(207, 90%, 54%);
  --primary-foreground: hsl(211, 100%, 99%);
  --secondary: hsl(60, 4.8%, 95.9%);
  --secondary-foreground: hsl(24, 9.8%, 10%);
  --accent: hsl(60, 4.8%, 95.9%);
  --accent-foreground: hsl(24, 9.8%, 10%);
  --destructive: hsl(0, 84.2%, 60.2%);
  --destructive-foreground: hsl(60, 9.1%, 97.8%);
  --ring: hsl(20, 14.3%, 4.1%);
  --radius: 0.5rem;

  /* FocusGuard iOS-style colors */
  --ios-blue: hsl(211, 100%, 50%);
  --ios-red: hsl(4, 90%, 70%);
  --ios-green: hsl(142, 76%, 47%);
  --ios-orange: hsl(25, 100%, 50%);
  --ios-purple: hsl(261, 73%, 59%);
  --ios-teal: hsl(178, 100%, 39%);
  --ios-gray-1: hsl(240, 20%, 96%);
  --ios-gray-2: hsl(240, 12%, 89%);
  --ios-gray-3: hsl(240, 8%, 82%);
  --ios-gray-4: hsl(240, 6%, 56%);
  --ios-gray-5: hsl(240, 5%, 39%);
  --ios-gray-6: hsl(240, 6%, 29%);
  --ios-dark-1: hsl(240, 9%, 18%);
  --ios-dark-2: hsl(240, 10%, 11%);
}

.dark {
  --background: hsl(240, 10%, 3.9%);
  --foreground: hsl(0, 0%, 98%);
  --muted: hsl(240, 3.7%, 15.9%);
  --muted-foreground: hsl(240, 5%, 64.9%);
  --popover: hsl(240, 10%, 3.9%);
  --popover-foreground: hsl(0, 0%, 98%);
  --card: hsl(240, 10%, 3.9%);
  --card-foreground: hsl(0, 0%, 98%);
  --border: hsl(240, 3.7%, 15.9%);
  --input: hsl(240, 3.7%, 15.9%);
  --primary: hsl(207, 90%, 54%);
  --primary-foreground: hsl(211, 100%, 99%);
  --secondary: hsl(240, 3.7%, 15.9%);
  --secondary-foreground: hsl(0, 0%, 98%);
  --accent: hsl(240, 3.7%, 15.9%);
  --accent-foreground: hsl(0, 0%, 98%);
  --destructive: hsl(0, 62.8%, 30.6%);
  --destructive-foreground: hsl(0, 0%, 98%);
  --ring: hsl(240, 4.9%, 83.9%);
  --radius: 0.5rem;
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply font-sans antialiased bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  }
}

@layer components {
  .ios-gradient-blue {
    background: linear-gradient(135deg, var(--ios-blue), var(--ios-purple));
  }
  
  .ios-gradient-red {
    background: linear-gradient(135deg, var(--ios-red), var(--ios-orange));
  }
  
  .ios-gradient-green {
    background: linear-gradient(135deg, var(--ios-green), var(--ios-teal));
  }

  .bounce-subtle {
    animation: bounce-subtle 2s infinite;
  }

  .pulse-slow {
    animation: pulse 3s infinite;
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .avatar-enter {
    animation: avatarEnter 0.6s ease-out;
  }

  .glass-effect {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .dark .glass-effect {
    backdrop-filter: blur(20px);
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes avatarEnter {
  0% { transform: scale(0.8) rotate(-10deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* Custom scrollbars */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: var(--ios-gray-1);
}

::-webkit-scrollbar-thumb {
  background: var(--ios-gray-3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--ios-gray-4);
}
