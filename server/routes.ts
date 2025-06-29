import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertFocusSessionSchema, insertBlockedAppSchema,
  insertAiLearningChatSchema, insertAdhdAssessmentSchema, insertStudyScheduleSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });

  app.patch("/api/users/:id", async (req, res) => {
    const user = await storage.updateUser(parseInt(req.params.id), req.body);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });

  // Focus session routes
  app.post("/api/focus-sessions", async (req, res) => {
    try {
      const sessionData = insertFocusSessionSchema.parse(req.body);
      const session = await storage.createFocusSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.get("/api/focus-sessions/active/:userId", async (req, res) => {
    const session = await storage.getActiveFocusSession(parseInt(req.params.userId));
    res.json(session);
  });

  app.patch("/api/focus-sessions/:id", async (req, res) => {
    const session = await storage.updateFocusSession(parseInt(req.params.id), req.body);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(session);
  });

  app.get("/api/focus-sessions/user/:userId", async (req, res) => {
    const sessions = await storage.getUserFocusSessions(parseInt(req.params.userId));
    res.json(sessions);
  });

  // Blocked apps routes
  app.post("/api/blocked-apps", async (req, res) => {
    try {
      const appData = insertBlockedAppSchema.parse(req.body);
      const app = await storage.createBlockedApp(appData);
      res.json(app);
    } catch (error) {
      res.status(400).json({ error: "Invalid app data" });
    }
  });

  app.get("/api/blocked-apps/user/:userId", async (req, res) => {
    const apps = await storage.getUserBlockedApps(parseInt(req.params.userId));
    res.json(apps);
  });

  app.patch("/api/blocked-apps/:id", async (req, res) => {
    const app = await storage.updateBlockedApp(parseInt(req.params.id), req.body);
    if (!app) {
      return res.status(404).json({ error: "App not found" });
    }
    res.json(app);
  });

  app.delete("/api/blocked-apps/:id", async (req, res) => {
    const deleted = await storage.deleteBlockedApp(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: "App not found" });
    }
    res.json({ success: true });
  });

  // AI learning chat routes
  app.post("/api/ai-chats", async (req, res) => {
    try {
      const chatData = insertAiLearningChatSchema.parse(req.body);
      
      // Simulate AI processing based on celebrity avatar
      const aiResponse = await processAiRequest(chatData);
      
      const chat = await storage.createAiChat({
        ...chatData,
        aiResponse: aiResponse.text,
        hasAudio: aiResponse.hasAudio,
        audioUrl: aiResponse.audioUrl
      });
      
      res.json(chat);
    } catch (error) {
      res.status(400).json({ error: "Invalid chat data" });
    }
  });

  app.get("/api/ai-chats/user/:userId", async (req, res) => {
    const chats = await storage.getUserAiChats(parseInt(req.params.userId));
    res.json(chats);
  });

  app.get("/api/ai-chats/user/:userId/avatar/:avatar", async (req, res) => {
    const chats = await storage.getAiChatsByAvatar(
      parseInt(req.params.userId), 
      req.params.avatar
    );
    res.json(chats);
  });

  // ADHD assessment routes
  app.post("/api/adhd-assessments", async (req, res) => {
    try {
      const assessmentData = insertAdhdAssessmentSchema.parse(req.body);
      const assessment = await storage.createAdhdAssessment(assessmentData);
      res.json(assessment);
    } catch (error) {
      res.status(400).json({ error: "Invalid assessment data" });
    }
  });

  app.get("/api/adhd-assessments/user/:userId/latest", async (req, res) => {
    const assessment = await storage.getUserLatestAssessment(parseInt(req.params.userId));
    res.json(assessment);
  });

  app.get("/api/adhd-assessments/user/:userId", async (req, res) => {
    const assessments = await storage.getUserAssessments(parseInt(req.params.userId));
    res.json(assessments);
  });

  // Study schedule routes
  app.post("/api/study-schedules", async (req, res) => {
    try {
      const scheduleData = insertStudyScheduleSchema.parse(req.body);
      const schedule = await storage.createStudySchedule(scheduleData);
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid schedule data" });
    }
  });

  app.get("/api/study-schedules/user/:userId/active", async (req, res) => {
    const schedule = await storage.getUserActiveSchedule(parseInt(req.params.userId));
    res.json(schedule);
  });

  app.patch("/api/study-schedules/:id", async (req, res) => {
    const schedule = await storage.updateStudySchedule(parseInt(req.params.id), req.body);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.json(schedule);
  });

  // Emergency override endpoint
  app.post("/api/emergency-override/:userId", async (req, res) => {
    const session = await storage.getActiveFocusSession(parseInt(req.params.userId));
    if (!session) {
      return res.status(404).json({ error: "No active session" });
    }

    const updatedSession = await storage.updateFocusSession(session.id, {
      emergencyOverrides: (session.emergencyOverrides || 0) + 1
    });

    res.json({ 
      success: true, 
      overrideGranted: true,
      session: updatedSession 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

// AI processing simulation
async function processAiRequest(chatData: any) {
  const avatarPersonalities = {
    einstein: {
      prefix: "As Einstein, I must say... ",
      style: "Think of it this way, my curious friend:",
      language: "Scientific yet playful"
    },
    curie: {
      prefix: "From my research experience... ",
      style: "Let me explain this methodically:",
      language: "Precise and encouraging"
    },
    tesla: {
      prefix: "Through my inventions, I've learned... ",
      style: "Imagine the electrical flow like this:",
      language: "Visionary and technical"
    },
    tutor: {
      prefix: "Let's break this down together... ",
      style: "Step by step, here's how:",
      language: "Clear and supportive"
    }
  };

  const personality = avatarPersonalities[chatData.celebrityAvatar as keyof typeof avatarPersonalities] || avatarPersonalities.tutor;
  
  let response = `${personality.prefix} `;
  
  if (chatData.contentType === 'photo') {
    response += `I can see this image contains educational content. ${personality.style} Let me analyze the key concepts and provide a detailed explanation.`;
  } else if (chatData.contentType === 'pdf') {
    response += `I've reviewed your document. ${personality.style} The main topics I'll cover are the fundamental principles and practical applications.`;
  } else {
    response += `Based on your question: "${chatData.originalContent}". ${personality.style} Here's my comprehensive explanation.`;
  }

  return {
    text: response,
    hasAudio: true,
    audioUrl: `/api/audio/${chatData.celebrityAvatar}/${Date.now()}.mp3`
  };
}
