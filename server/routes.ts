import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { storage } from "./storage";
import { insertUserSchema, insertChallengeSchema } from "@shared/schema";
import { registrationSchema } from "@shared/validation";
import { emailService } from "./emailService";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Authentication middleware
interface AuthenticatedRequest extends Request {
  user: { id: number; email: string; username: string };
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    (req as AuthenticatedRequest).user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Применяем более строгую валидацию
      const validationResult = registrationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({ 
          message: "Ошибка валидации",
          errors: errors
        });
      }

      const { username, email, password } = validationResult.data;
      
      // Проверяем никнейм до проверки email (с учетом регистра)
      const normalizedUsername = username.toLowerCase();
      const usernameIsTaken = await storage.usernameExists(username);
      
      if (usernameIsTaken) {
        const suggestedUsername = normalizedUsername + Math.floor(1000 + Math.random() * 9000);
        return res.status(400).json({ 
          message: "Этот никнейм уже занят. Попробуйте другой, например: " + suggestedUsername,
          field: "username",
          suggestedUsername: suggestedUsername
        });
      }
      
      // Дополнительная проверка для безопасности
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ 
          message: "Этот никнейм недоступен",
          field: "username"
        });
      }

      // Затем проверяем email
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          message: "Пользователь с таким email уже существует",
          field: "email"
        });
      }

      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        avatar: null,
        role: "user",
        points: 0,
        level: 1,
      });

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.put("/api/auth/profile", authenticateToken, async (req: any, res: Response) => {
    try {
      const updates = req.body;
      delete updates.id;
      delete updates.password;

      const user = await storage.updateUser(req.user.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Chat assistant route (replacing Supabase Edge Function)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;

      // Simple bot responses for cybersecurity context
      const responses = [
        "Отличный вопрос! В кибербезопасности очень важно начинать с основ. Я рекомендую изучить наш раздел по веб-уязвимостям. Там вы найдете материалы для начинающих. Также попробуйте решить несколько простых CTF-заданий для практики.",
        "Для начинающих в CTF рекомендую начать с простых задач в разделе Web. Там вы найдете задания для новичков с подробными объяснениями. Постепенно переходите к более сложным заданиям по мере получения опыта.",
        "Криптография - увлекательное направление! Вы можете найти материалы в нашей базе знаний и практические задания на платформе CTF. Начните с изучения основных алгоритмов шифрования, таких как AES и RSA.",
        "Обязательно ознакомьтесь с нашими лабораторными работами для практики. Теория важна, но практика — ключ к успеху в кибербезопасности. У нас есть виртуальные лаборатории для безопасного тестирования различных уязвимостей.",
        "В нашем сообществе много опытных специалистов. Не стесняйтесь задавать вопросы и делиться своим опытом! Также регулярно проводятся мероприятия и вебинары, где вы можете получить новые знания и установить полезные контакты."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      res.json({ 
        botResponse: randomResponse,
        success: true 
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        botResponse: "Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.",
        success: false 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
