import { 
  users, type User, type InsertUser,
  focusSessions, type FocusSession, type InsertFocusSession,
  blockedApps, type BlockedApp, type InsertBlockedApp,
  aiLearningChats, type AiLearningChat, type InsertAiLearningChat,
  adhdAssessments, type AdhdAssessment, type InsertAdhdAssessment,
  studySchedules, type StudySchedule, type InsertStudySchedule
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

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
      .where(and(eq(focusSessions.userId, userId), eq(focusSessions.isActive, true)))
      .orderBy(desc(focusSessions.createdAt))
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
      .where(eq(focusSessions.userId, userId))
      .orderBy(desc(focusSessions.createdAt));
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
      .where(eq(aiLearningChats.userId, userId))
      .orderBy(desc(aiLearningChats.createdAt));
  }

  async getAiChatsByAvatar(userId: number, avatar: string): Promise<AiLearningChat[]> {
    return await db
      .select()
      .from(aiLearningChats)
      .where(and(eq(aiLearningChats.userId, userId), eq(aiLearningChats.celebrityAvatar, avatar)))
      .orderBy(desc(aiLearningChats.createdAt));
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
      .orderBy(desc(adhdAssessments.createdAt))
      .limit(1);
    return assessment || undefined;
  }

  async getUserAssessments(userId: number): Promise<AdhdAssessment[]> {
    return await db
      .select()
      .from(adhdAssessments)
      .where(eq(adhdAssessments.userId, userId))
      .orderBy(desc(adhdAssessments.createdAt));
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
      .where(and(eq(studySchedules.userId, userId), eq(studySchedules.isActive, true)))
      .orderBy(desc(studySchedules.createdAt))
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
