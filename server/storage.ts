import { eq, and, gt } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import { users, challenges, type User, type InsertUser, type Challenge, type InsertChallenge } from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  usernameExists(username: string): Promise<boolean>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  verifyUserEmail(userId: number): Promise<void>;
  setVerificationCode(userId: number, code: string): Promise<void>;
  getUserByVerificationCode(code: string): Promise<User | undefined>;
  setResetPasswordCode(email: string, code: string, expires: Date): Promise<void>;
  getUserByResetCode(code: string): Promise<User | undefined>;
  
  // Challenge management
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: number, updates: Partial<Challenge>): Promise<Challenge | undefined>;
  deleteChallenge(id: number): Promise<void>;
}

// File-based storage for development. Stores data in server/data/db.json
const DB_PATH = path.resolve(process.cwd(), "server", "data", "db.json");

async function ensureDbFile() {
  try {
    await fs.access(DB_PATH);
  } catch (e) {
    const initial = { users: [], challenges: [] };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
  }
}

async function readDbFile() {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as { users: any[]; challenges: any[] };
}

async function writeDbFile(data: { users: any[]; challenges: any[] }) {
  await fs.writeFile(DB_PATH + ".tmp", JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(DB_PATH + ".tmp", DB_PATH);
}

export class FileStorage implements IStorage {
  // Helper to map user objects, ensure defaults
  private normalizeUser(u: any) {
    return {
      id: u.id,
      username: u.username,
      email: u.email,
      password: u.password,
      avatar: u.avatar ?? null,
      role: u.role ?? "user",
      points: u.points ?? 0,
      level: u.level ?? 1,
      emailVerified: !!u.emailVerified,
      verificationCode: u.verificationCode ?? null,
      resetPasswordCode: u.resetPasswordCode ?? null,
      resetPasswordExpires: u.resetPasswordExpires ? new Date(u.resetPasswordExpires) : null,
      createdAt: u.createdAt ?? new Date().toISOString(),
      updatedAt: u.updatedAt ?? new Date().toISOString(),
    } as User;
  }

  async getUser(id: number): Promise<User | undefined> {
    const db = await readDbFile();
    const u = db.users.find((x) => x.id === id);
    return u ? this.normalizeUser(u) : undefined;
  }

  async usernameExists(username: string): Promise<boolean> {
    const db = await readDbFile();
    try {
      // Проверяем, есть ли пользователи в базе
      if (!db.users || !Array.isArray(db.users)) {
        return false;
      }
      
      // Проверяем, есть ли пользователь с таким именем (без учета регистра)
      return db.users.some((x) => x.username && x.username.toLowerCase() === username.toLowerCase());
    } catch (error) {
      console.error('Error checking username existence:', error);
      return false;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await readDbFile();
    const u = db.users.find((x) => x.username.toLowerCase() === username.toLowerCase());
    return u ? this.normalizeUser(u) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const db = await readDbFile();
    const u = db.users.find((x) => x.email === email);
    return u ? this.normalizeUser(u) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await readDbFile();
    const id = db.users.length ? (Math.max(...db.users.map((x) => x.id || 0)) + 1) : 1;
    const now = new Date().toISOString();
    const user: any = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      avatar: insertUser.avatar ?? null,
      role: insertUser.role ?? "user",
      points: insertUser.points ?? 0,
      level: insertUser.level ?? 1,
      emailVerified: insertUser.emailVerified ?? false,
      verificationCode: insertUser.verificationCode ?? null,
  resetPasswordCode: null,
  resetPasswordExpires: null,
      createdAt: now,
      updatedAt: now,
    };
    db.users.push(user);
    await writeDbFile(db);
    return this.normalizeUser(user);
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const db = await readDbFile();
    const idx = db.users.findIndex((x) => x.id === id);
    if (idx === -1) return undefined;
    const existing = db.users[idx];
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    db.users[idx] = updated as any;
    await writeDbFile(db);
    return this.normalizeUser(updated);
  }

  async verifyUserEmail(userId: number): Promise<void> {
    await this.updateUser(userId, { emailVerified: true, verificationCode: null } as any);
  }

  async setVerificationCode(userId: number, code: string): Promise<void> {
    await this.updateUser(userId, { verificationCode: code } as any);
  }

  async getUserByVerificationCode(code: string): Promise<User | undefined> {
    const db = await readDbFile();
    const u = db.users.find((x) => x.verificationCode === code);
    return u ? this.normalizeUser(u) : undefined;
  }

  async setResetPasswordCode(email: string, code: string, expires: Date): Promise<void> {
    const db = await readDbFile();
    const idx = db.users.findIndex((x) => x.email === email);
    if (idx === -1) return;
    db.users[idx].resetPasswordCode = code;
    db.users[idx].resetPasswordExpires = expires.toISOString();
    await writeDbFile(db);
  }

  async getUserByResetCode(code: string): Promise<User | undefined> {
    const db = await readDbFile();
    const now = new Date();
    const u = db.users.find((x) => x.resetPasswordCode === code && x.resetPasswordExpires && new Date(x.resetPasswordExpires) > now);
    return u ? this.normalizeUser(u) : undefined;
  }

  // Challenge management
  async getAllChallenges(): Promise<Challenge[]> {
    const db = await readDbFile();
    return db.challenges.filter((c) => c.isActive !== false) as Challenge[];
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    const db = await readDbFile();
    const c = db.challenges.find((x) => x.id === id);
    return c as Challenge | undefined;
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const db = await readDbFile();
    const id = db.challenges.length ? (Math.max(...db.challenges.map((x) => x.id || 0)) + 1) : 1;
    const now = new Date().toISOString();
    const ch: any = { id, ...challenge, isActive: challenge.isActive ?? true, createdAt: now, updatedAt: now };
    db.challenges.push(ch);
    await writeDbFile(db);
    return ch as Challenge;
  }

  async updateChallenge(id: number, updates: Partial<Challenge>): Promise<Challenge | undefined> {
    const db = await readDbFile();
    const idx = db.challenges.findIndex((x) => x.id === id);
    if (idx === -1) return undefined;
    const updated = { ...db.challenges[idx], ...updates, updatedAt: new Date().toISOString() };
    db.challenges[idx] = updated as any;
    await writeDbFile(db);
    return updated as Challenge;
  }

  async deleteChallenge(id: number): Promise<void> {
    const db = await readDbFile();
    const idx = db.challenges.findIndex((x) => x.id === id);
    if (idx === -1) return;
    db.challenges[idx].isActive = false;
    await writeDbFile(db);
  }
}

export const storage = new FileStorage();
