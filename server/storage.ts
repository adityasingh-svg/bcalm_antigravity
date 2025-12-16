import { type User, type UpsertUser, type ResourcesUser, type InsertResourcesUser, type Resource, type InsertResource, type DownloadLog, type InsertDownloadLog, type AssessmentQuestion, type InsertAssessmentQuestion, type AssessmentAttempt, type InsertAssessmentAttempt, type AssessmentAnswer, type InsertAssessmentAnswer, type HackathonRegistration, type InsertHackathonRegistration, type CvSubmission, type InsertCvSubmission, type AnalysisJob, type InsertAnalysisJob, users, resourcesUsers, resources, downloadLogs, assessmentQuestions, assessmentAttempts, assessmentAnswers, hackathonRegistrations, cvSubmissions, analysisJobs } from "@shared/schema";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  getResourcesUserByEmail(email: string): Promise<ResourcesUser | undefined>;
  getResourcesUserById(id: string): Promise<ResourcesUser | undefined>;
  createResourcesUser(user: InsertResourcesUser): Promise<ResourcesUser>;
  getAllResources(): Promise<Resource[]>;
  getResourceById(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: string): Promise<boolean>;
  logDownload(log: InsertDownloadLog): Promise<DownloadLog>;
  getDownloadStats(): Promise<{
    totalResources: number;
    totalDownloads: number;
    mostDownloaded: { resourceId: string; title: string; downloads: number } | null;
  }>;

  getAllAssessmentQuestions(): Promise<AssessmentQuestion[]>;
  createAssessmentQuestion(question: InsertAssessmentQuestion): Promise<AssessmentQuestion>;
  createAssessmentAttempt(attempt: InsertAssessmentAttempt): Promise<AssessmentAttempt>;
  getAssessmentAttempt(id: string): Promise<AssessmentAttempt | undefined>;
  getLatestIncompleteAttempt(userId: string): Promise<AssessmentAttempt | undefined>;
  deleteAssessmentAttempt(id: string): Promise<boolean>;
  saveAssessmentAnswer(answer: InsertAssessmentAnswer): Promise<AssessmentAnswer>;
  getAttemptAnswers(attemptId: string): Promise<AssessmentAnswer[]>;
  completeAssessmentAttempt(attemptId: string, totalScore: number, readinessBand: string, scoresJson: string): Promise<AssessmentAttempt | undefined>;

  // Hackathon Registration Methods
  createHackathonRegistration(registration: InsertHackathonRegistration): Promise<HackathonRegistration>;
  getHackathonRegistrationById(id: string): Promise<HackathonRegistration | undefined>;
  getHackathonRegistrationByPhone(phone: string): Promise<HackathonRegistration | undefined>;
  getHackathonRegistrationByEmail(email: string): Promise<HackathonRegistration | undefined>;
  updateHackathonOtp(id: string, otpCode: string, expiresAt: Date): Promise<HackathonRegistration | undefined>;
  verifyHackathonRegistration(id: string): Promise<HackathonRegistration | undefined>;

  // CV Submission Methods
  createCvSubmission(submission: InsertCvSubmission): Promise<CvSubmission>;
  getAllCvSubmissions(): Promise<CvSubmission[]>;
  getCvSubmissionStats(): Promise<{ total: number; byRole: Record<string, number>; today: number }>;

  // User Onboarding Methods
  updateUserOnboarding(userId: string, data: {
    currentStatus?: string;
    targetRole?: string;
    yearsExperience?: number;
    onboardingStatus?: string;
    personalizationQuality?: string;
  }): Promise<User | undefined>;

  // Analysis Job Methods
  createAnalysisJob(job: InsertAnalysisJob): Promise<AnalysisJob>;
  getAnalysisJob(id: string): Promise<AnalysisJob | undefined>;
  getAnalysisJobsByUser(userId: string): Promise<AnalysisJob[]>;
  updateAnalysisJobResults(id: string, results: {
    status: string;
    score?: number;
    strengths?: string[];
    gaps?: string[];
    quickWins?: string[];
    notes?: string;
    needsJd?: boolean;
    needsTargetRole?: boolean;
  }): Promise<AnalysisJob | undefined>;
}

export class DatabaseStorage implements IStorage {
  async initialize(): Promise<void> {
    await this.initializeAdminUser();
    await this.initializeAssessmentQuestions();
  }

  private async initializeAdminUser(): Promise<void> {
    const adminEmail = "admin@bcalm.org";
    const adminPassword = "admin123";

    const existingAdmin = await this.getResourcesUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log("Admin user already exists:", adminEmail);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await this.createResourcesUser({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    });

    console.log("Admin user initialized:", adminEmail);
  }

  private async initializeAssessmentQuestions(): Promise<void> {
    const existingQuestions = await this.getAllAssessmentQuestions();
    if (existingQuestions.length > 0) {
      console.log("Assessment questions already seeded:", existingQuestions.length);
      return;
    }

    const { ASSESSMENT_QUESTIONS } = await import("./data/assessmentQuestions");

    for (const question of ASSESSMENT_QUESTIONS) {
      await this.createAssessmentQuestion(question);
    }

    console.log("Assessment questions initialized:", ASSESSMENT_QUESTIONS.length);
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getResourcesUserByEmail(email: string): Promise<ResourcesUser | undefined> {
    const [user] = await db.select().from(resourcesUsers).where(eq(resourcesUsers.email, email));
    return user || undefined;
  }

  async createResourcesUser(insertUser: InsertResourcesUser): Promise<ResourcesUser> {
    const [user] = await db.insert(resourcesUsers).values(insertUser).returning();
    return user;
  }

  async getResourcesUserById(id: string): Promise<ResourcesUser | undefined> {
    const [user] = await db.select().from(resourcesUsers).where(eq(resourcesUsers.id, id));
    return user || undefined;
  }

  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.isActive, true));
  }

  async getResourceById(id: string): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource).returning();
    return resource;
  }

  async updateResource(id: string, updateData: Partial<InsertResource>): Promise<Resource | undefined> {
    const [resource] = await db
      .update(resources)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return resource || undefined;
  }

  async deleteResource(id: string): Promise<boolean> {
    const [resource] = await db
      .update(resources)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(resources.id, id))
      .returning();
    return !!resource;
  }

  async logDownload(insertLog: InsertDownloadLog): Promise<DownloadLog> {
    const [log] = await db.insert(downloadLogs).values(insertLog).returning();
    return log;
  }

  async getDownloadStats(): Promise<{
    totalResources: number;
    totalDownloads: number;
    mostDownloaded: { resourceId: string; title: string; downloads: number } | null;
  }> {
    const activeResources = await this.getAllResources();
    const totalResources = activeResources.length;

    const allDownloads = await db.select().from(downloadLogs);
    const totalDownloads = allDownloads.length;

    const downloadCounts = new Map<string, number>();
    allDownloads.forEach((log) => {
      downloadCounts.set(log.resourceId, (downloadCounts.get(log.resourceId) || 0) + 1);
    });

    let mostDownloaded: { resourceId: string; title: string; downloads: number } | null = null;
    let maxDownloads = 0;

    for (const [resourceId, count] of Array.from(downloadCounts.entries())) {
      if (count > maxDownloads) {
        const resource = await this.getResourceById(resourceId);
        if (resource) {
          mostDownloaded = {
            resourceId,
            title: resource.title,
            downloads: count,
          };
          maxDownloads = count;
        }
      }
    }

    return {
      totalResources,
      totalDownloads,
      mostDownloaded,
    };
  }

  async getAllAssessmentQuestions(): Promise<AssessmentQuestion[]> {
    return await db.select().from(assessmentQuestions).orderBy(assessmentQuestions.orderIndex);
  }

  async createAssessmentQuestion(question: InsertAssessmentQuestion): Promise<AssessmentQuestion> {
    const [newQuestion] = await db.insert(assessmentQuestions).values(question).returning();
    return newQuestion;
  }

  async createAssessmentAttempt(attempt: InsertAssessmentAttempt): Promise<AssessmentAttempt> {
    const [newAttempt] = await db.insert(assessmentAttempts).values(attempt).returning();
    return newAttempt;
  }

  async getAssessmentAttempt(id: string): Promise<AssessmentAttempt | undefined> {
    const [attempt] = await db.select().from(assessmentAttempts).where(eq(assessmentAttempts.id, id));
    return attempt || undefined;
  }

  async getLatestIncompleteAttempt(userId: string): Promise<AssessmentAttempt | undefined> {
    const { and } = await import("drizzle-orm");
    const [attempt] = await db
      .select()
      .from(assessmentAttempts)
      .where(and(
        eq(assessmentAttempts.userId, userId),
        eq(assessmentAttempts.isCompleted, false)
      ))
      .orderBy(sql`${assessmentAttempts.createdAt} DESC`)
      .limit(1);
    return attempt || undefined;
  }

  async deleteAssessmentAttempt(id: string): Promise<boolean> {
    await db.delete(assessmentAnswers).where(eq(assessmentAnswers.attemptId, id));
    const result = await db.delete(assessmentAttempts).where(eq(assessmentAttempts.id, id));
    return true;
  }

  async saveAssessmentAnswer(answer: InsertAssessmentAnswer): Promise<AssessmentAnswer> {
    const { and } = await import("drizzle-orm");
    const existing = await db
      .select()
      .from(assessmentAnswers)
      .where(and(
        eq(assessmentAnswers.attemptId, answer.attemptId),
        eq(assessmentAnswers.questionId, answer.questionId)
      ))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(assessmentAnswers)
        .set({ answerValue: answer.answerValue })
        .where(eq(assessmentAnswers.id, existing[0].id))
        .returning();
      return updated;
    }

    const [newAnswer] = await db.insert(assessmentAnswers).values(answer).returning();
    return newAnswer;
  }

  async getAttemptAnswers(attemptId: string): Promise<AssessmentAnswer[]> {
    return await db.select().from(assessmentAnswers).where(eq(assessmentAnswers.attemptId, attemptId));
  }

  async completeAssessmentAttempt(
    attemptId: string,
    totalScore: number,
    readinessBand: string,
    scoresJson: string
  ): Promise<AssessmentAttempt | undefined> {
    const shareToken = nanoid(16);

    const [updated] = await db
      .update(assessmentAttempts)
      .set({
        totalScore,
        readinessBand,
        scoresJson,
        isCompleted: true,
        completedAt: new Date(),
        shareToken,
      })
      .where(eq(assessmentAttempts.id, attemptId))
      .returning();
    return updated || undefined;
  }

  async getAssessmentAttemptByShareToken(shareToken: string): Promise<AssessmentAttempt | undefined> {
    const [attempt] = await db
      .select()
      .from(assessmentAttempts)
      .where(eq(assessmentAttempts.shareToken, shareToken));
    return attempt || undefined;
  }

  async createHackathonRegistration(registration: InsertHackathonRegistration): Promise<HackathonRegistration> {
    const [newRegistration] = await db.insert(hackathonRegistrations).values(registration).returning();
    return newRegistration;
  }

  async getHackathonRegistrationById(id: string): Promise<HackathonRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(hackathonRegistrations)
      .where(eq(hackathonRegistrations.id, id));
    return registration || undefined;
  }

  async getHackathonRegistrationByPhone(phone: string): Promise<HackathonRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(hackathonRegistrations)
      .where(eq(hackathonRegistrations.phone, phone));
    return registration || undefined;
  }

  async getHackathonRegistrationByEmail(email: string): Promise<HackathonRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(hackathonRegistrations)
      .where(eq(hackathonRegistrations.email, email));
    return registration || undefined;
  }

  async updateHackathonOtp(id: string, otpCode: string, expiresAt: Date): Promise<HackathonRegistration | undefined> {
    const [updated] = await db
      .update(hackathonRegistrations)
      .set({ otpCode, otpExpiresAt: expiresAt })
      .where(eq(hackathonRegistrations.id, id))
      .returning();
    return updated || undefined;
  }

  async verifyHackathonRegistration(id: string): Promise<HackathonRegistration | undefined> {
    const [updated] = await db
      .update(hackathonRegistrations)
      .set({ isVerified: true, otpCode: null, otpExpiresAt: null })
      .where(eq(hackathonRegistrations.id, id))
      .returning();
    return updated || undefined;
  }

  // CV Submission Methods
  async createCvSubmission(submission: InsertCvSubmission): Promise<CvSubmission> {
    const [newSubmission] = await db.insert(cvSubmissions).values(submission).returning();
    return newSubmission;
  }

  async getAllCvSubmissions(): Promise<CvSubmission[]> {
    return await db.select().from(cvSubmissions).orderBy(sql`${cvSubmissions.createdAt} DESC`);
  }

  async getCvSubmissionStats(): Promise<{ total: number; byRole: Record<string, number>; today: number }> {
    const allSubmissions = await this.getAllCvSubmissions();
    const total = allSubmissions.length;

    const byRole: Record<string, number> = {};
    allSubmissions.forEach((sub) => {
      byRole[sub.targetRole] = (byRole[sub.targetRole] || 0) + 1;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = allSubmissions.filter((sub) => {
      const subDate = new Date(sub.createdAt);
      subDate.setHours(0, 0, 0, 0);
      return subDate.getTime() === today.getTime();
    }).length;

    return { total, byRole, today: todayCount };
  }

  // User Onboarding Methods
  async updateUserOnboarding(userId: string, data: {
    currentStatus?: string;
    targetRole?: string;
    yearsExperience?: number;
    onboardingStatus?: string;
    personalizationQuality?: string;
  }): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return updated || undefined;
  }

  // Analysis Job Methods
  async createAnalysisJob(job: InsertAnalysisJob): Promise<AnalysisJob> {
    const [newJob] = await db.insert(analysisJobs).values(job).returning();
    return newJob;
  }

  async getAnalysisJob(id: string): Promise<AnalysisJob | undefined> {
    const [job] = await db.select().from(analysisJobs).where(eq(analysisJobs.id, id));
    return job || undefined;
  }

  async getAnalysisJobsByUser(userId: string): Promise<AnalysisJob[]> {
    return await db
      .select()
      .from(analysisJobs)
      .where(eq(analysisJobs.userId, userId))
      .orderBy(sql`${analysisJobs.createdAt} DESC`);
  }

  async updateAnalysisJobResults(id: string, results: {
    status: string;
    score?: number;
    strengths?: string[];
    gaps?: string[];
    quickWins?: string[];
    notes?: string;
    needsJd?: boolean;
    needsTargetRole?: boolean;
  }): Promise<AnalysisJob | undefined> {
    const [updated] = await db
      .update(analysisJobs)
      .set({
        status: results.status,
        score: results.score,
        strengths: results.strengths,
        gaps: results.gaps,
        quickWins: results.quickWins,
        notes: results.notes,
        needsJd: results.needsJd,
        needsTargetRole: results.needsTargetRole,
        completedAt: results.status === "complete" ? new Date() : undefined,
      })
      .where(eq(analysisJobs.id, id))
      .returning();
    return updated || undefined;
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private resourcesUsers: Map<string, ResourcesUser> = new Map();
  private resources: Map<string, Resource> = new Map();
  private downloadLogs: Map<string, DownloadLog> = new Map();
  private assessmentQuestions: Map<string, AssessmentQuestion> = new Map();
  private assessmentAttempts: Map<string, AssessmentAttempt> = new Map();
  private assessmentAnswers: Map<string, AssessmentAnswer> = new Map();
  private hackathonRegistrations: Map<string, HackathonRegistration> = new Map();
  private cvSubmissions: Map<string, CvSubmission> = new Map();
  private analysisJobs: Map<string, AnalysisJob> = new Map();

  async initialize(): Promise<void> {
    await this.initializeAdminUser();
    await this.initializeAssessmentQuestions();
  }

  private async initializeAdminUser(): Promise<void> {
    const adminEmail = "admin@bcalm.org";
    const adminPassword = "admin123";

    if (this.resourcesUsers.size > 0) return; // Already seeded?

    // Check if admin exists
    const existing = await this.getResourcesUserByEmail(adminEmail);
    if (existing) return;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const userId = nanoid();
    const newUser: ResourcesUser = {
      id: userId,
      email: adminEmail,
      password: hashedPassword,
      name: "Admin User",
      year: null,
      background: null,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.resourcesUsers.set(userId, newUser);
    console.log("Admin user initialized (Memory):", adminEmail);
  }

  private async initializeAssessmentQuestions(): Promise<void> {
    if (this.assessmentQuestions.size > 0) return;

    const { ASSESSMENT_QUESTIONS } = await import("./data/assessmentQuestions");

    for (const question of ASSESSMENT_QUESTIONS) {
      this.createAssessmentQuestion(question); // No await needed really
    }
    console.log("Assessment questions initialized (Memory):", ASSESSMENT_QUESTIONS.length);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Check if user exists by id
    const id = userData.id || nanoid();
    // In upsert, usually we check conflicts. 
    // Here we assume if ID provided it exists, or create new.
    let user = this.users.get(id);
    if (user) {
      user = { ...user, ...userData, updatedAt: new Date() } as User;
    } else {
      user = {
        ...userData,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Defaults
        onboardingStatus: userData.onboardingStatus || "not_started",
      } as User;
    }
    this.users.set(id, user);
    return user;
  }

  async getResourcesUserByEmail(email: string): Promise<ResourcesUser | undefined> {
    return Array.from(this.resourcesUsers.values()).find(u => u.email === email);
  }

  async getResourcesUserById(id: string): Promise<ResourcesUser | undefined> {
    return this.resourcesUsers.get(id);
  }

  async createResourcesUser(insertUser: InsertResourcesUser): Promise<ResourcesUser> {
    const id = nanoid();
    const user: ResourcesUser = {
      ...insertUser,
      id,
      year: insertUser.year || null,
      background: insertUser.background || null,
      isAdmin: false, // Default
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.resourcesUsers.set(id, user);
    return user;
  }

  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(r => r.isActive);
  }

  async getResourceById(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const id = nanoid();
    const newResource: Resource = {
      ...resource,
      id,
      filePath: resource.filePath || null,
      fileSize: resource.fileSize || null,
      originalFileName: resource.originalFileName || null,
      mimeType: resource.mimeType || null,
      isActive: true,
      uploadedDate: new Date(),
      updatedAt: new Date()
    };
    this.resources.set(id, newResource);
    return newResource;
  }

  async updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource | undefined> {
    const existing = this.resources.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...resource, updatedAt: new Date() };
    this.resources.set(id, updated);
    return updated;
  }

  async deleteResource(id: string): Promise<boolean> {
    const existing = this.resources.get(id);
    if (!existing) return false;
    existing.isActive = false;
    existing.updatedAt = new Date();
    this.resources.set(id, existing);
    return true;
  }

  async logDownload(log: InsertDownloadLog): Promise<DownloadLog> {
    const id = nanoid();
    const newLog: DownloadLog = {
      ...log,
      id,
      downloadedAt: new Date()
    };
    this.downloadLogs.set(id, newLog);
    return newLog;
  }

  async getDownloadStats(): Promise<{
    totalResources: number;
    totalDownloads: number;
    mostDownloaded: { resourceId: string; title: string; downloads: number } | null;
  }> {
    const activeResources = await this.getAllResources();
    const totalResources = activeResources.length;
    const totalDownloads = this.downloadLogs.size;

    const downloadCounts = new Map<string, number>();
    this.downloadLogs.forEach(log => {
      downloadCounts.set(log.resourceId, (downloadCounts.get(log.resourceId) || 0) + 1);
    });

    let mostDownloaded: { resourceId: string; title: string; downloads: number } | null = null;
    let maxDownloads = 0;

    for (const [resourceId, count] of Array.from(downloadCounts.entries())) {
      if (count > maxDownloads) {
        const resource = this.resources.get(resourceId);
        if (resource) {
          mostDownloaded = { resourceId, title: resource.title, downloads: count };
          maxDownloads = count;
        }
      }
    }
    return { totalResources, totalDownloads, mostDownloaded };
  }

  async getAllAssessmentQuestions(): Promise<AssessmentQuestion[]> {
    return Array.from(this.assessmentQuestions.values()).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createAssessmentQuestion(question: InsertAssessmentQuestion): Promise<AssessmentQuestion> {
    const id = nanoid();
    const newQ: AssessmentQuestion = {
      ...question,
      id,
      createdAt: new Date()
    };
    this.assessmentQuestions.set(id, newQ);
    return newQ;
  }

  async createAssessmentAttempt(attempt: InsertAssessmentAttempt): Promise<AssessmentAttempt> {
    const id = nanoid();
    const newAttempt: AssessmentAttempt = {
      ...attempt,
      id,
      totalScore: null,
      readinessBand: null,
      scoresJson: null,
      isCompleted: false,
      shareToken: null,
      createdAt: new Date(),
      completedAt: null
    };
    this.assessmentAttempts.set(id, newAttempt);
    return newAttempt;
  }

  async getAssessmentAttempt(id: string): Promise<AssessmentAttempt | undefined> {
    return this.assessmentAttempts.get(id);
  }

  async getLatestIncompleteAttempt(userId: string): Promise<AssessmentAttempt | undefined> {
    const attempts = Array.from(this.assessmentAttempts.values())
      .filter(a => a.userId === userId && !a.isCompleted)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return attempts[0];
  }

  async deleteAssessmentAttempt(id: string): Promise<boolean> {
    // Delete answers first
    const answerIdsToDelete: string[] = [];
    this.assessmentAnswers.forEach((val, key) => {
      if (val.attemptId === id) answerIdsToDelete.push(key);
    });
    answerIdsToDelete.forEach(kid => this.assessmentAnswers.delete(kid));

    const deleted = this.assessmentAttempts.delete(id);
    return deleted;
  }

  async saveAssessmentAnswer(answer: InsertAssessmentAnswer): Promise<AssessmentAnswer> {
    // Check if exists
    const existing = Array.from(this.assessmentAnswers.values())
      .find(a => a.attemptId === answer.attemptId && a.questionId === answer.questionId);

    if (existing) {
      existing.answerValue = answer.answerValue;
      return existing;
    }

    const id = nanoid();
    const newAnswer: AssessmentAnswer = {
      ...answer,
      id,
      createdAt: new Date()
    };
    this.assessmentAnswers.set(id, newAnswer);
    return newAnswer;
  }

  async getAttemptAnswers(attemptId: string): Promise<AssessmentAnswer[]> {
    return Array.from(this.assessmentAnswers.values()).filter(a => a.attemptId === attemptId);
  }

  async completeAssessmentAttempt(
    attemptId: string,
    totalScore: number,
    readinessBand: string,
    scoresJson: string
  ): Promise<AssessmentAttempt | undefined> {
    const attempt = this.assessmentAttempts.get(attemptId);
    if (!attempt) return undefined;

    attempt.totalScore = totalScore;
    attempt.readinessBand = readinessBand;
    attempt.scoresJson = scoresJson;
    attempt.isCompleted = true;
    attempt.completedAt = new Date();
    attempt.shareToken = nanoid(16);

    return attempt;
  }

  async getAssessmentAttemptByShareToken(shareToken: string): Promise<AssessmentAttempt | undefined> {
    return Array.from(this.assessmentAttempts.values()).find(a => a.shareToken === shareToken);
  }

  async createHackathonRegistration(registration: InsertHackathonRegistration): Promise<HackathonRegistration> {
    const id = nanoid();
    const newReg: HackathonRegistration = {
      ...registration,
      id,
      otpCode: null,
      otpExpiresAt: null,
      isVerified: false, // Default
      utmSource: registration.utmSource || null,
      utmMedium: registration.utmMedium || null,
      utmCampaign: registration.utmCampaign || null,
      createdAt: new Date()
    };
    this.hackathonRegistrations.set(id, newReg);
    return newReg;
  }

  async getHackathonRegistrationById(id: string): Promise<HackathonRegistration | undefined> {
    return this.hackathonRegistrations.get(id);
  }

  async getHackathonRegistrationByPhone(phone: string): Promise<HackathonRegistration | undefined> {
    return Array.from(this.hackathonRegistrations.values()).find(r => r.phone === phone);
  }

  async getHackathonRegistrationByEmail(email: string): Promise<HackathonRegistration | undefined> {
    return Array.from(this.hackathonRegistrations.values()).find(r => r.email === email);
  }

  async updateHackathonOtp(id: string, otpCode: string, expiresAt: Date): Promise<HackathonRegistration | undefined> {
    const reg = this.hackathonRegistrations.get(id);
    if (!reg) return undefined;
    reg.otpCode = otpCode;
    reg.otpExpiresAt = expiresAt;
    return reg;
  }

  async verifyHackathonRegistration(id: string): Promise<HackathonRegistration | undefined> {
    const reg = this.hackathonRegistrations.get(id);
    if (!reg) return undefined;
    reg.isVerified = true;
    reg.otpCode = null;
    reg.otpExpiresAt = null;
    return reg;
  }

  async createCvSubmission(submission: InsertCvSubmission): Promise<CvSubmission> {
    const id = nanoid();
    const newSub: CvSubmission = {
      ...submission,
      id,
      cvFilePath: submission.cvFilePath || null,
      cvFileName: submission.cvFileName || null,
      cvFileSize: submission.cvFileSize || null,
      cvMimeType: submission.cvMimeType || null,
      utmSource: submission.utmSource || null,
      utmMedium: submission.utmMedium || null,
      utmCampaign: submission.utmCampaign || null,
      createdAt: new Date()
    };
    this.cvSubmissions.set(id, newSub);
    return newSub;
  }

  async getAllCvSubmissions(): Promise<CvSubmission[]> {
    return Array.from(this.cvSubmissions.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getCvSubmissionStats(): Promise<{ total: number; byRole: Record<string, number>; today: number }> {
    const submissions = await this.getAllCvSubmissions();
    const total = submissions.length;
    const byRole: Record<string, number> = {};
    submissions.forEach(s => {
      byRole[s.targetRole] = (byRole[s.targetRole] || 0) + 1;
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = submissions.filter(s => {
      const fd = new Date(s.createdAt);
      fd.setHours(0, 0, 0, 0);
      return fd.getTime() === today.getTime();
    }).length;
    return { total, byRole, today: todayCount };
  }

  async updateUserOnboarding(userId: string, data: {
    currentStatus?: string;
    targetRole?: string;
    yearsExperience?: number;
    onboardingStatus?: string;
    personalizationQuality?: string;
  }): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    if (data.currentStatus !== undefined) user.currentStatus = data.currentStatus;
    if (data.targetRole !== undefined) user.targetRole = data.targetRole;
    if (data.yearsExperience !== undefined) user.yearsExperience = data.yearsExperience;
    if (data.onboardingStatus !== undefined) user.onboardingStatus = data.onboardingStatus;
    if (data.personalizationQuality !== undefined) user.personalizationQuality = data.personalizationQuality;

    user.updatedAt = new Date();
    return user;
  }

  async createAnalysisJob(job: InsertAnalysisJob): Promise<AnalysisJob> {
    const id = nanoid();
    const newJob: AnalysisJob = {
      ...job,
      id,
      completedAt: null,
      createdAt: new Date(),
      score: null,
      strengths: null,
      gaps: null,
      quickWins: null,
      notes: null,
      // Provide default values for optional fields if not present in job
      // checking InsertAnalysisJob type... it aligns with schema except id/createdAt
      // But wait, schema defined defaults
      needsJd: job.needsJd ?? false,
      needsTargetRole: job.needsTargetRole ?? false,
      cvFilePath: job.cvFilePath || null,
      cvFileName: job.cvFileName || null,
      cvText: job.cvText || null,
      jdText: job.jdText || null
    };
    this.analysisJobs.set(id, newJob);
    return newJob;
  }

  async getAnalysisJob(id: string): Promise<AnalysisJob | undefined> {
    return this.analysisJobs.get(id);
  }

  async getAnalysisJobsByUser(userId: string): Promise<AnalysisJob[]> {
    return Array.from(this.analysisJobs.values())
      .filter(j => j.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateAnalysisJobResults(id: string, results: {
    status: string;
    score?: number;
    strengths?: string[];
    gaps?: string[];
    quickWins?: string[];
    notes?: string;
    needsJd?: boolean;
    needsTargetRole?: boolean;
  }): Promise<AnalysisJob | undefined> {
    const job = this.analysisJobs.get(id);
    if (!job) return undefined;

    job.status = results.status;
    if (results.score !== undefined) job.score = results.score;
    if (results.strengths !== undefined) job.strengths = results.strengths;
    if (results.gaps !== undefined) job.gaps = results.gaps;
    if (results.quickWins !== undefined) job.quickWins = results.quickWins;
    if (results.notes !== undefined) job.notes = results.notes;
    if (results.needsJd !== undefined) job.needsJd = results.needsJd;
    if (results.needsTargetRole !== undefined) job.needsTargetRole = results.needsTargetRole;
    if (results.status === "complete") job.completedAt = new Date();

    return job;
  }
}

// export const storage = new DatabaseStorage();
export const storage = new MemStorage();
