# FocusGuard - Mobile App Blocking & AI Learning Platform

A comprehensive mobile application designed to help students and professionals maintain focus through app blocking, screen time management, and AI-powered learning assistance. Features celebrity AI avatars for personalized learning experiences and ADHD assessment capabilities.

## 🌟 Features

### Focus Management
- **System-level app blocking** with soft, hard, and system enforcement modes
- **Real-time focus sessions** with customizable durations and break schedules
- **Emergency override** system with limited daily usage
- **Screen time limits** with parental controls and bedtime enforcement

### AI Learning Platform
- **Celebrity AI Tutors**: Einstein, Marie Curie, Tesla, and dedicated AI Tutor
- **Multi-modal input**: Photo scanning, PDF uploads, and text-based queries
- **Voice synthesis** with personality-specific communication styles
- **Content processing** for handwritten notes, documents, and images

### ADHD Support
- **Standardized assessment** with 18-question diagnostic tool
- **Progress tracking** with focus metrics and productivity analytics
- **Personalized recommendations** based on behavior patterns
- **Visual progress charts** and streak tracking

### User Management
- **Age-based profiles** for students vs professionals
- **Exam-specific modes** for UPSC, TSPSC, and general study prep
- **Permission management** with clear explanations for required access
- **Cross-device synchronization** for seamless experience

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with custom iOS-style design
- **Radix UI** components via shadcn/ui
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** with Neon Database serverless hosting

### Development Tools
- **Vite** for fast builds and hot reload
- **ESBuild** for production bundling
- **Drizzle Kit** for database migrations

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon Database account)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/focusguard.git
cd focusguard
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env
# Add your DATABASE_URL and other environment variables
```

4. **Database setup**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`
