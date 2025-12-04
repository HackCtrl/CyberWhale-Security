import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DB_DIR, 'tracker.sqlite');

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
}

let db: Database.Database | null = null;

export function initDb() {
  ensureDir();
  if (db) return db;
  db = new Database(DB_FILE);

  // Create tables if they do not exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      epic TEXT,
      priority TEXT,
      status TEXT,
      percent_complete INTEGER,
      estimate_days INTEGER,
      assignee TEXT,
      reporter TEXT,
      tags TEXT,
      git_branch TEXT,
      related_pr TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      task_id INTEGER,
      author TEXT,
      summary TEXT,
      checklist TEXT,
      evidence_links TEXT,
      attachments TEXT,
      time_spent_hours REAL,
      metrics TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY,
      task_id INTEGER,
      filename TEXT,
      path TEXT,
      size INTEGER,
      created_at TEXT
    );
  `);

  return db;
}

export function getTasks(filters: any = {}) {
  initDb();
  let sql = 'SELECT * FROM tasks';
  const clauses: string[] = [];
  const params: any[] = [];
  if (filters.status) { clauses.push('status = ?'); params.push(filters.status); }
  if (filters.assignee) { clauses.push('assignee = ?'); params.push(filters.assignee); }
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  const stmt = db!.prepare(sql);
  return stmt.all(...params).map(row => ({ ...row, tags: row.tags ? JSON.parse(row.tags) : [] }));
}

export function createTask(payload: any) {
  initDb();
  const stmt = db!.prepare(`INSERT INTO tasks (title,description,epic,priority,status,percent_complete,estimate_days,assignee,reporter,tags,git_branch,related_pr,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  const now = new Date().toISOString();
  const tags = Array.isArray(payload.tags) ? JSON.stringify(payload.tags) : '[]';
  const info = stmt.run(
    payload.title || 'New task',
    payload.description || '',
    payload.epic || '',
    payload.priority || 'medium',
    payload.status || 'backlog',
    payload.percent_complete || 0,
    payload.estimate_days || 0,
    payload.assignee || null,
    payload.reporter || null,
    tags,
    payload.git_branch || null,
    payload.related_pr || null,
    now,
    now
  );
  const id = info.lastInsertRowid as number;
  return getTask(String(id));
}

export function getTask(id: string) {
  initDb();
  const stmt = db!.prepare('SELECT * FROM tasks WHERE id = ?');
  const row = stmt.get(Number(id));
  if (!row) return null;
  return { ...row, tags: row.tags ? JSON.parse(row.tags) : [] };
}

export function updateTask(id: string, updates: any) {
  initDb();
  const existing = getTask(id);
  if (!existing) return null;
  const merged = { ...existing, ...updates, updated_at: new Date().toISOString() };
  const stmt = db!.prepare(`UPDATE tasks SET title = ?, description = ?, epic = ?, priority = ?, status = ?, percent_complete = ?, estimate_days = ?, assignee = ?, reporter = ?, tags = ?, git_branch = ?, related_pr = ?, updated_at = ? WHERE id = ?`);
  const tags = Array.isArray(merged.tags) ? JSON.stringify(merged.tags) : JSON.stringify([]);
  stmt.run(
    merged.title,
    merged.description,
    merged.epic,
    merged.priority,
    merged.status,
    merged.percent_complete || 0,
    merged.estimate_days || 0,
    merged.assignee || null,
    merged.reporter || null,
    tags,
    merged.git_branch || null,
    merged.related_pr || null,
    merged.updated_at,
    Number(id)
  );
  return getTask(id);
}

import { nanoid } from 'nanoid';

export function createReport(taskId: string, payload: any) {
  initDb();
  const id = nanoid(10);
  const now = new Date().toISOString();
  const stmt = db!.prepare(`INSERT INTO reports (id, task_id, author, summary, checklist, evidence_links, attachments, time_spent_hours, metrics, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)`);
  const checklist = Array.isArray(payload.checklist) ? JSON.stringify(payload.checklist) : '[]';
  const evidence = Array.isArray(payload.evidence_links) ? JSON.stringify(payload.evidence_links) : '[]';
  const attachments = Array.isArray(payload.attachments) ? JSON.stringify(payload.attachments) : '[]';
  stmt.run(id, Number(taskId), payload.author || null, payload.summary || '', checklist, evidence, attachments, payload.time_spent_hours || 0, JSON.stringify(payload.metrics || {}), now);

  // update task status to review
  updateTask(taskId, { status: 'review' });
  return { id, task_id: taskId, ...payload, created_at: now };
}

export function addAttachment(taskId: string, att: { id: string; filename: string; path: string; size: number }) {
  initDb();
  const now = new Date().toISOString();
  const stmt = db!.prepare(`INSERT INTO attachments (id, task_id, filename, path, size, created_at) VALUES (?,?,?,?,?,?)`);
  stmt.run(att.id, Number(taskId), att.filename, att.path, att.size, now);
  return { ...att, created_at: now };
}

export function getAttachments(taskId: string) {
  initDb();
  const stmt = db!.prepare('SELECT * FROM attachments WHERE task_id = ?');
  return stmt.all(Number(taskId));
}
