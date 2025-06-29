import {
  users, focusSessions, blockedApps, aiLearningChats, adhdAssessments, studySchedules,
  type User, type InsertUser, type FocusSession, type InsertFocusSession,
  type BlockedApp, type InsertBlockedApp, type AiLearningChat, type InsertAiLearningChat,
  type AdhdAssessment, type InsertAdhdAssessment, type StudySchedule, type InsertStudySchedule
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Focus sessions
  createFocusSession(session: InsertFocusSession): Promise<FocusSession>;
  getActiveFocusSession(userId: number): Promise<FocusSession | undefined>;
  updateFocusSession(id: number, updates: Partial<FocusSession>): Promise<FocusSession | undefined>;
  getUserFocusSessions(userId: number): Promise<FocusSession[]>;

  // Blocked apps
  createBlockedApp(app: InsertBlockedApp): Promise<BlockedApp>;
  getUserBlockedApps(userId: number): Promise<BlockedApp[]>;
  updateBlockedApp(id: number, updates: Partial<BlockedApp>): Promise<BlockedApp | undefined>;
  deleteBlockedApp(id: number): Promise<boolean>;

  // AI learning chats
  createAiChat(chat: InsertAiLearningChat): Promise<AiLearningChat>;
  getUserAiChats(userId: number): Promise<AiLearningChat[]>;
  getAiChatsByAvatar(userId: number, avatar: string): Promise<AiLearningChat[]>;

  // ADHD assessments
  createAdhdAssessment(assessment: InsertAdhdAssessment): Promise<AdhdAssessment>;
  getUserLatestAssessment(userId: number): Promise<AdhdAssessment | undefined>;
  getUserAssessments(userId: number): Promise<AdhdAssessment[]>;

  // Study schedules
  createStudySchedule(schedule: InsertStudySchedule): Promise<StudySchedule>;
  getUserActiveSchedule(userId: number): Promise<StudySchedule | undefined>;
  updateStudySchedule(id: number, updates: Partial<StudySchedule>): Promise<StudySchedule | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private focusSessions: Map<number, FocusSession> = new Map();
  private blockedApps: Map<number, BlockedApp> = new Map();
  private aiChats: Map<number, AiLearningChat> = new Map();
  private adhdAssessments: Map<number, AdhdAssessment> = new Map();
  private studySchedules: Map<number, StudySchedule> = new Map();
  
  private currentUserId = 1;
  private currentFocusSessionId = 1;
  private currentBlockedAppId = 1;
  private currentAiChatId = 1;
  private currentAssessmentId = 1;
  private currentScheduleId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      ageGroup: insertUser.ageGroup,
      focusMode: insertUser.focusMode || "study",
      examType: insertUser.examType ?? null,
      permissionsGranted: insertUser.permissionsGranted || {},
      parentalControlsEnabled: insertUser.parentalControlsEnabled || false,
      screenTimeLimit: insertUser.screenTimeLimit || 180,
      bedtimeHour: insertUser.bedtimeHour || 22,
      systemLockdownEnabled: insertUser.systemLockdownEnabled !== false,
      maximumScreenTime: insertUser.maximumScreenTime || 480,
      lockdownStartTime: insertUser.lockdownStartTime || null,
      lockdownDuration: insertUser.lockdownDuration || 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createFocusSession(insertSession: InsertFocusSession): Promise<FocusSession> {
    const id = this.currentFocusSessionId++;
    const session: FocusSession = {
      id,
      userId: insertSession.userId,
      startTime: insertSession.startTime,
      endTime: null,
      plannedDuration: insertSession.plannedDuration,
      actualDuration: null,
      focusMode: insertSession.focusMode,
      blockedApps: insertSession.blockedApps || [],
      emergencyOverrides: 0,
      isActive: true
    };
    this.focusSessions.set(id, session);
    return session;
  }

  async getActiveFocusSession(userId: number): Promise<FocusSession | undefined> {
    return Array.from(this.focusSessions.values()).find(
      session => session.userId === userId && session.isActive
    );
  }

  async updateFocusSession(id: number, updates: Partial<FocusSession>): Promise<FocusSession | undefined> {
    const session = this.focusSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.focusSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getUserFocusSessions(userId: number): Promise<FocusSession[]> {
    return Array.from(this.focusSessions.values()).filter(
      session => session.userId === userId
    );
  }

  async createBlockedApp(insertApp: InsertBlockedApp): Promise<BlockedApp> {
    const id = this.currentBlockedAppId++;
    const app: BlockedApp = {
      id,
      userId: insertApp.userId,
      appName: insertApp.appName,
      appIcon: insertApp.appIcon ?? null,
      blockSchedule: insertApp.blockSchedule || [],
      isSystemBlocked: insertApp.isSystemBlocked || false,
      blockLevel: insertApp.blockLevel || "soft"
    };
    this.blockedApps.set(id, app);
    return app;
  }

  async getUserBlockedApps(userId: number): Promise<BlockedApp[]> {
    return Array.from(this.blockedApps.values()).filter(
      app => app.userId === userId
    );
  }

  async updateBlockedApp(id: number, updates: Partial<BlockedApp>): Promise<BlockedApp | undefined> {
    const app = this.blockedApps.get(id);
    if (!app) return undefined;
    
    const updatedApp = { ...app, ...updates };
    this.blockedApps.set(id, updatedApp);
    return updatedApp;
  }

  async deleteBlockedApp(id: number): Promise<boolean> {
    return this.blockedApps.delete(id);
  }

  async createAiChat(insertChat: InsertAiLearningChat): Promise<AiLearningChat> {
    const id = this.currentAiChatId++;
    const chat: AiLearningChat = {
      id,
      userId: insertChat.userId,
      celebrityAvatar: insertChat.celebrityAvatar,
      contentType: insertChat.contentType,
      originalContent: insertChat.originalContent ?? null,
      contentUrl: insertChat.contentUrl ?? null,
      aiResponse: insertChat.aiResponse ?? null,
      language: insertChat.language || "en",
      hasAudio: insertChat.hasAudio || false,
      audioUrl: insertChat.audioUrl ?? null,
      createdAt: new Date()
    };
    this.aiChats.set(id, chat);
    return chat;
  }

  async getUserAiChats(userId: number): Promise<AiLearningChat[]> {
    return Array.from(this.aiChats.values()).filter(
      chat => chat.userId === userId
    );
  }

  async getAiChatsByAvatar(userId: number, avatar: string): Promise<AiLearningChat[]> {
    return Array.from(this.aiChats.values()).filter(
      chat => chat.userId === userId && chat.celebrityAvatar === avatar
    );
  }

  async createAdhdAssessment(insertAssessment: InsertAdhdAssessment): Promise<AdhdAssessment> {
    const id = this.currentAssessmentId++;
    const assessment: AdhdAssessment = {
      id,
      userId: insertAssessment.userId,
      responses: insertAssessment.responses,
      totalScore: insertAssessment.totalScore,
      inattentionScore: insertAssessment.inattentionScore,
      hyperactivityScore: insertAssessment.hyperactivityScore,
      impulsivityScore: insertAssessment.impulsivityScore,
      riskLevel: insertAssessment.riskLevel,
      recommendations: insertAssessment.recommendations || [],
      completedAt: new Date()
    };
    this.adhdAssessments.set(id, assessment);
    return assessment;
  }

  async getUserLatestAssessment(userId: number): Promise<AdhdAssessment | undefined> {
    const userAssessments = Array.from(this.adhdAssessments.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    
    return userAssessments[0];
  }

  async getUserAssessments(userId: number): Promise<AdhdAssessment[]> {
    return Array.from(this.adhdAssessments.values()).filter(
      assessment => assessment.userId === userId
    );
  }

  async createStudySchedule(insertSchedule: InsertStudySchedule): Promise<StudySchedule> {
    const id = this.currentScheduleId++;
    const schedule: StudySchedule = {
      id,
      userId: insertSchedule.userId,
      examType: insertSchedule.examType,
      scheduleBlocks: insertSchedule.scheduleBlocks,
      strictEnforcement: insertSchedule.strictEnforcement !== false,
      isActive: insertSchedule.isActive !== false
    };
    this.studySchedules.set(id, schedule);
    return schedule;
  }

  async getUserActiveSchedule(userId: number): Promise<StudySchedule | undefined> {
    return Array.from(this.studySchedules.values()).find(
      schedule => schedule.userId === userId && schedule.isActive
    );
  }

  async updateStudySchedule(id: number, updates: Partial<StudySchedule>): Promise<StudySchedule | undefined> {
    const schedule = this.studySchedules.get(id);
    if (!schedule) return undefined;
    
    const updatedSchedule = { ...schedule, ...updates };
    this.studySchedules.set(id, updatedSchedule);
    return updatedSchedule;
  }
}

import { users, type User, type InsertUser, focusSessions, type FocusSession, type InsertFocusSession, blockedApps, type BlockedApp, type InsertBlockedApp, aiLearningChats, type AiLearningChat, type InsertAiLearningChat, adhdAssessments, type AdhdAssessment, type InsertAdhdAssessment, studySchedules, type StudySchedule, type InsertStudySchedule } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createFocusSession(insertSession: InsertFocusSession): Promise<FocusSession> {
    const [session] = await db
      .insert(focusSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getActiveFocusSession(userId: number): Promise<FocusSession | undefined> {
    const [session] = await db
      .select()
      .from(focusSessions)
      .where(eq(focusSessions.userId, userId))
      .orderBy(focusSessions.id)
      .limit(1);
    return session || undefined;
  }

  async updateFocusSession(id: number, updates: Partial<FocusSession>): Promise<FocusSession | undefined> {
    const [session] = await db
      .update(focusSessions)
      .set(updates)
      .where(eq(focusSessions.id, id))
      .returning();
    return session || undefined;
  }

  async getUserFocusSessions(userId: number): Promise<FocusSession[]> {
    return await db
      .select()
      .from(focusSessions)
      .where(eq(focusSessions.userId, userId));
  }

  async createBlockedApp(insertApp: InsertBlockedApp): Promise<BlockedApp> {
    const [app] = await db
      .insert(blockedApps)
      .values(insertApp)
      .returning();
    return app;
  }

  async getUserBlockedApps(userId: number): Promise<BlockedApp[]> {
    return await db
      .select()
      .from(blockedApps)
      .where(eq(blockedApps.userId, userId));
  }

  async updateBlockedApp(id: number, updates: Partial<BlockedApp>): Promise<BlockedApp | undefined> {
    const [app] = await db
      .update(blockedApps)
      .set(updates)
      .where(eq(blockedApps.id, id))
      .returning();
    return app || undefined;
  }

  async deleteBlockedApp(id: number): Promise<boolean> {
    const result = await db
      .delete(blockedApps)
      .where(eq(blockedApps.id, id));
    return result.rowCount > 0;
  }

  async createAiChat(insertChat: InsertAiLearningChat): Promise<AiLearningChat> {
    const [chat] = await db
      .insert(aiLearningChats)
      .values(insertChat)
      .returning();
    return chat;
  }

  async getUserAiChats(userId: number): Promise<AiLearningChat[]> {
    return await db
      .select()
      .from(aiLearningChats)
      .where(eq(aiLearningChats.userId, userId));
  }

  async getAiChatsByAvatar(userId: number, avatar: string): Promise<AiLearningChat[]> {
    return await db
      .select()
      .from(aiLearningChats)
      .where(eq(aiLearningChats.userId, userId));
  }

  async createAdhdAssessment(insertAssessment: InsertAdhdAssessment): Promise<AdhdAssessment> {
    const [assessment] = await db
      .insert(adhdAssessments)
      .values(insertAssessment)
      .returning();
    return assessment;
  }

  async getUserLatestAssessment(userId: number): Promise<AdhdAssessment | undefined> {
    const [assessment] = await db
      .select()
      .from(adhdAssessments)
      .where(eq(adhdAssessments.userId, userId))
      .orderBy(adhdAssessments.id)
      .limit(1);
    return assessment || undefined;
  }

  async getUserAssessments(userId: number): Promise<AdhdAssessment[]> {
    return await db
      .select()
      .from(adhdAssessments)
      .where(eq(adhdAssessments.userId, userId));
  }

  async createStudySchedule(insertSchedule: InsertStudySchedule): Promise<StudySchedule> {
    const [schedule] = await db
      .insert(studySchedules)
      .values(insertSchedule)
      .returning();
    return schedule;
  }

  async getUserActiveSchedule(userId: number): Promise<StudySchedule | undefined> {
    const [schedule] = await db
      .select()
      .from(studySchedules)
      .where(eq(studySchedules.userId, userId))
      .orderBy(studySchedules.id)
      .limit(1);
    return schedule || undefined;
  }

  async updateStudySchedule(id: number, updates: Partial<StudySchedule>): Promise<StudySchedule | undefined> {
    const [schedule] = await db
      .update(studySchedules)
      .set(updates)
      .where(eq(studySchedules.id, id))
      .returning();
    return schedule || undefined;
  }
}

export const storage = new DatabaseStorage();
