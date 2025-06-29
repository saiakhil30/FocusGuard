import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  ageGroup: text("age_group").notNull(), // 'student' | 'professional'
  focusMode: text("focus_mode").default("study"), // 'study' | 'work' | 'exam'
  examType: text("exam_type"), // 'upsc' | 'tspsc' | null
  permissionsGranted: jsonb("permissions_granted").default({}),
  parentalControlsEnabled: boolean("parental_controls_enabled").default(false),
  screenTimeLimit: integer("screen_time_limit").default(180), // minutes
  bedtimeHour: integer("bedtime_hour").default(22),
  systemLockdownEnabled: boolean("system_lockdown_enabled").default(true),
  maximumScreenTime: integer("maximum_screen_time").default(480), // max minutes per day
  lockdownStartTime: timestamp("lockdown_start_time"),
  lockdownDuration: integer("lockdown_duration").default(0), // minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const focusSessions = pgTable("focus_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  plannedDuration: integer("planned_duration").notNull(), // minutes
  actualDuration: integer("actual_duration"), // minutes
  focusMode: text("focus_mode").notNull(),
  blockedApps: jsonb("blocked_apps").default([]),
  emergencyOverrides: integer("emergency_overrides").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blockedApps = pgTable("blocked_apps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  appName: text("app_name").notNull(),
  appIcon: text("app_icon"),
  blockSchedule: jsonb("block_schedule").default([]), // [{start: "09:00", end: "17:00", days: ["mon", "tue"]}]
  isSystemBlocked: boolean("is_system_blocked").default(false),
  blockLevel: text("block_level").default("soft"), // 'soft' | 'hard' | 'system'
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiLearningChats = pgTable("ai_learning_chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  celebrityAvatar: text("celebrity_avatar").notNull(), // 'einstein' | 'curie' | 'tesla' | 'tutor'
  contentType: text("content_type").notNull(), // 'photo' | 'pdf' | 'text'
  originalContent: text("original_content"),
  contentUrl: text("content_url"),
  aiResponse: text("ai_response"),
  language: text("language").default("en"),
  hasAudio: boolean("has_audio").default(false),
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adhdAssessments = pgTable("adhd_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  responses: jsonb("responses").notNull(), // Array of question responses
  totalScore: integer("total_score").notNull(),
  inattentionScore: integer("inattention_score").notNull(),
  hyperactivityScore: integer("hyperactivity_score").notNull(),
  impulsivityScore: integer("impulsivity_score").notNull(),
  riskLevel: text("risk_level").notNull(), // 'low' | 'moderate' | 'high'
  recommendations: jsonb("recommendations").default([]),
  completedAt: timestamp("completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studySchedules = pgTable("study_schedules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  examType: text("exam_type").notNull(),
  scheduleBlocks: jsonb("schedule_blocks").notNull(), // [{name: "Morning Study", start: "06:00", end: "10:00", days: [...]}]
  strictEnforcement: boolean("strict_enforcement").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFocusSessionSchema = createInsertSchema(focusSessions).omit({
  id: true,
  actualDuration: true,
  endTime: true,
});

export const insertBlockedAppSchema = createInsertSchema(blockedApps).omit({
  id: true,
});

export const insertAiLearningChatSchema = createInsertSchema(aiLearningChats).omit({
  id: true,
  createdAt: true,
});

export const insertAdhdAssessmentSchema = createInsertSchema(adhdAssessments).omit({
  id: true,
  completedAt: true,
});

export const insertStudyScheduleSchema = createInsertSchema(studySchedules).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFocusSession = z.infer<typeof insertFocusSessionSchema>;
export type FocusSession = typeof focusSessions.$inferSelect;
export type InsertBlockedApp = z.infer<typeof insertBlockedAppSchema>;
export type BlockedApp = typeof blockedApps.$inferSelect;
export type InsertAiLearningChat = z.infer<typeof insertAiLearningChatSchema>;
export type AiLearningChat = typeof aiLearningChats.$inferSelect;
export type InsertAdhdAssessment = z.infer<typeof insertAdhdAssessmentSchema>;
export type AdhdAssessment = typeof adhdAssessments.$inferSelect;
export type InsertStudySchedule = z.infer<typeof insertStudyScheduleSchema>;
export type StudySchedule = typeof studySchedules.$inferSelect;
