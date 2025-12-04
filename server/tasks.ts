import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { nanoid } from 'nanoid';
import * as db from './trackerDb';

const router = express.Router();

const STORAGE_DIR = path.resolve(process.cwd(), 'storage', 'tasks');
fs.mkdirSync(STORAGE_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id = String(req.params.id || 'unknown');
    const dir = path.join(STORAGE_DIR, id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, safe);
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB limit

// List tasks with optional filters
router.get('/', (req: Request, res: Response) => {
  const q = req.query;
  const tasks = db.getTasks({ status: q.status, assignee: q.assignee });
  res.json(tasks);
});

// Create task
router.post('/', (req: Request, res: Response) => {
  const body = req.body;
  const task = db.createTask(body);
  res.status(201).json(task);
});

// Get task
router.get('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const t = db.getTask(id);
  if (!t) return res.status(404).json({ message: 'Task not found' });
  res.json(t);
});

// Update task
router.put('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const body = req.body;
  const updated = db.updateTask(id, body);
  if (!updated) return res.status(404).json({ message: 'Task not found' });
  res.json(updated);
});

// Create report for task (report must include evidence_links or attachments)
router.post('/:id/report', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const body = req.body;
  const task = db.getTask(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const summary = body.summary || '';
  const evidence_links = Array.isArray(body.evidence_links) ? body.evidence_links : (body.evidence_links ? [body.evidence_links] : []);
  const attachments = Array.isArray(body.attachments) ? body.attachments : [];
  if (!summary || (evidence_links.length === 0 && attachments.length === 0)) {
    return res.status(400).json({ message: 'Report must include summary and at least one evidence link or attachment' });
  }

  const report = db.createReport(id, {
    author: body.author || null,
    summary,
    checklist: Array.isArray(body.checklist) ? body.checklist : [],
    evidence_links,
    attachments,
    time_spent_hours: body.time_spent_hours || 0,
    metrics: body.metrics || {}
  });

  res.status(201).json(report);
});

// Upload attachment via multipart/form-data field 'file'
router.post('/:id/attachments', upload.single('file'), (req: Request, res: Response) => {
  const id = String(req.params.id);
  const task = db.getTask(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const meta = {
    id: nanoid(10),
    filename: req.file.filename,
    path: `/storage/tasks/${id}/${req.file.filename}`,
    size: req.file.size
  };
  db.addAttachment(id, meta);
  res.status(201).json(meta);
});

// Get attachments for a task
router.get('/:id/attachments', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const task = db.getTask(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const atts = db.getAttachments(id) || [];
  res.json(atts);
});

export default router;
