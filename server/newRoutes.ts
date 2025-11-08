import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { storage } from "./storage";
import { insertUserSchema, insertChallengeSchema } from "@shared/schema";
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
  // NEW AUTHENTICATION SYSTEM WITH EMAIL VERIFICATION
  
  // Step 1: Register user (creates unverified account)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = insertUserSchema.parse(req.body);
      
      // Check if username is taken
      console.log('Checking username:', username);
      const usernameExists = await storage.usernameExists(username);
      console.log('Username exists:', usernameExists);
      
      if (usernameExists) {
        // Generate suggested usernames
        const baseSuggestions = [
          `${username}${Math.floor(1000 + Math.random() * 9000)}`,
          `${username}${new Date().getFullYear()}`,
          `${username}_${Math.floor(100 + Math.random() * 900)}`
        ];
        
        // Фильтруем предложения, проверяя, что они не существуют
        const suggestedUsernames = [];
        for (const suggestion of baseSuggestions) {
          const exists = await storage.usernameExists(suggestion);
          if (!exists) {
            suggestedUsernames.push(suggestion);
          }
        }
        
        // Если не нашли уникальные варианты, генерируем новые
        if (suggestedUsernames.length === 0) {
          for (let i = 0; i < 3; i++) {
            const randomSuggestion = `${username}_${Math.random().toString(36).substring(2, 8)}`;
            suggestedUsernames.push(randomSuggestion);
          }
        }
        
        return res.status(400).json({
          message: "Это имя пользователя уже занято",
          field: "username",
          suggestedUsernames
        });
      }

      // Check if user email already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Пользователь с таким email уже существует" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Generate verification code
      const verificationCode = emailService.generateVerificationCode();
      
      // Create user (unverified)
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        emailVerified: false,
        verificationCode
      });
      
      // Send verification email to the provided email address
      await emailService.sendVerificationEmail(email, verificationCode);
      
      res.status(201).json({
        message: "Регистрация прошла успешно! На указанный email отправлен код подтверждения.",
        userId: user.id,
        email: user.email,
        verificationRequired: true
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные для регистрации" });
      }
      res.status(500).json({ message: "Ошибка при создании пользователя" });
    }
  });

  // Step 2: Verify email with code
  app.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { email, code } = req.body;
      
      // Find user by verification code
      const user = await storage.getUserByVerificationCode(code);
      if (!user || user.email !== email) {
        return res.status(400).json({ message: "Неверный код подтверждения" });
      }
      
      // Verify user email
      await storage.verifyUserEmail(user.id);
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      res.json({
        message: "Email успешно подтвержден! Добро пожаловать в CyberWhale!",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          points: user.points,
          level: user.level,
          emailVerified: true
        },
        token
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Ошибка при подтверждении email" });
    }
  });

  // Step 3: Login (only for verified users)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Неверный email или пароль" });
      }
      
      // Check if email is verified
      if (!user.emailVerified) {
        return res.status(401).json({ 
          message: "Email не подтвержден. Пожалуйста, подтвердите ваш email.",
          emailVerificationRequired: true,
          email: user.email
        });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Неверный email или пароль" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      res.json({
        message: "Вход выполнен успешно",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          points: user.points,
          level: user.level,
          emailVerified: user.emailVerified
        },
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Ошибка при входе в систему" });
    }
  });

  // Resend verification code
  app.post("/api/auth/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
      
      if (user.emailVerified) {
        return res.status(400).json({ message: "Email уже подтвержден" });
      }
      
      // Generate new verification code
      const verificationCode = emailService.generateVerificationCode();
      await storage.setVerificationCode(user.id, verificationCode);
      
      // Send verification email
      await emailService.sendVerificationEmail(email, verificationCode);
      
      res.json({
        message: "Код подтверждения отправлен повторно на указанный email."
      });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ message: "Ошибка при повторной отправке кода" });
    }
  });

  // Password reset request
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists
        return res.json({ message: "Если пользователь существует, код восстановления был отправлен на email" });
      }
      
      // Generate reset code
      const resetCode = emailService.generateVerificationCode();
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 15); // 15 minutes
      
      await storage.setResetPasswordCode(email, resetCode, expires);
      await emailService.sendPasswordResetEmail(email, resetCode);
      
      res.json({
        message: "Код восстановления пароля отправлен на указанный email."
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Ошибка при восстановлении пароля" });
    }
  });

  // Reset password with code
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      
      const user = await storage.getUserByResetCode(code);
      if (!user || user.email !== email) {
        return res.status(400).json({ message: "Неверный или истекший код восстановления" });
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password and clear reset code
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordExpires: null
      });
      
      res.json({ message: "Пароль успешно изменен" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Ошибка при сбросе пароля" });
    }
  });

  // Get current user (protected)
  app.get("/api/auth/me", authenticateToken, async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        points: user.points,
        level: user.level,
        emailVerified: user.emailVerified
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Ошибка при получении данных пользователя" });
    }
  });

  // Update profile (protected)
  app.put("/api/auth/profile", authenticateToken, async (req: any, res: Response) => {
    try {
      const updates = req.body;
      
      // Don't allow updating sensitive fields
      delete updates.password;
      delete updates.emailVerified;
      delete updates.verificationCode;
      delete updates.resetPasswordCode;
      delete updates.resetPasswordExpires;
      
      const updatedUser = await storage.updateUser(req.user.id, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }
      
      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        points: updatedUser.points,
        level: updatedUser.level,
        emailVerified: updatedUser.emailVerified
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Ошибка при обновлении профиля" });
    }
  });

  // ADMIN ROUTES FOR CHALLENGE MANAGEMENT
  
  // Get all challenges (public)
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Get challenges error:", error);
      res.status(500).json({ message: "Ошибка при получении заданий" });
    }
  });

  // Get single challenge (public)
  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.getChallenge(id);
      
      if (!challenge) {
        return res.status(404).json({ message: "Задание не найдено" });
      }
      
      res.json(challenge);
    } catch (error) {
      console.error("Get challenge error:", error);
      res.status(500).json({ message: "Ошибка при получении задания" });
    }
  });

  // Create challenge (admin only)
  app.post("/api/admin/challenges", authenticateToken, async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Доступ запрещен" });
      }

      const challengeData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(challengeData);
      
      res.status(201).json({
        message: "Задание создано успешно",
        challenge
      });
    } catch (error) {
      console.error("Create challenge error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Неверные данные задания" });
      }
      res.status(500).json({ message: "Ошибка при создании задания" });
    }
  });

  // Update challenge (admin only)
  app.put("/api/admin/challenges/:id", authenticateToken, async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Доступ запрещен" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const challenge = await storage.updateChallenge(id, updates);
      
      if (!challenge) {
        return res.status(404).json({ message: "Задание не найдено" });
      }
      
      res.json({
        message: "Задание обновлено успешно",
        challenge
      });
    } catch (error) {
      console.error("Update challenge error:", error);
      res.status(500).json({ message: "Ошибка при обновлении задания" });
    }
  });

  // Delete challenge (admin only)
  app.delete("/api/admin/challenges/:id", authenticateToken, async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Доступ запрещен" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteChallenge(id);
      
      res.json({ message: "Задание удалено успешно" });
    } catch (error) {
      console.error("Delete challenge error:", error);
      res.status(500).json({ message: "Ошибка при удалении задания" });
    }
  });

  // Admin password verification
  app.post("/api/admin/verify-password", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = "301062Ki"; // This should be in environment variables
      
      if (password === adminPassword) {
        res.json({ success: true, message: "Доступ к админ панели разрешен" });
      } else {
        res.status(401).json({ success: false, message: "Неверный пароль" });
      }
    } catch (error) {
      console.error("Admin verification error:", error);
      res.status(500).json({ message: "Ошибка при проверке пароля" });
    }
  });

  // Chat assistant route (replacing Supabase Edge Function)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;

      const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

      // If Hugging Face API key is available, use AI
      if (HUGGING_FACE_API_KEY) {
        try {
          const MODEL_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
          
          const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              inputs: message,
              parameters: {
                max_length: 100,
                temperature: 0.7,
                top_p: 0.9,
                do_sample: true,
              }
            })
          });

          const result = await response.json();
          
          if (!result.error && Array.isArray(result) && result.length > 0) {
            const botResponse = result[0].generated_text || "Извините, я не смог сгенерировать ответ. Пожалуйста, попробуйте еще раз.";
            return res.json({ 
              botResponse,
              success: true 
            });
          }
        } catch (aiError) {
          console.error("Hugging Face API error:", aiError);
          // Fall through to fallback responses
        }
      }

      // Fallback responses for cybersecurity context
      const responses = [
        "Отличный вопрос! В кибербезопасности очень важно начинать с основ. Я рекомендую изучить наш раздел по веб-уязвимостям. Там вы найдете материалы для начинающих. Также попробуйте решить несколько простых CTF-заданий для практики.",
        "Для начинающих в CTF рекомендую начать с простых задач в разделе Web. Там вы найдете задания для новичков с подробными объяснениями. Постепенно переходите к более сложным заданиям по мере получения опыта.",
        "Криптография - увлекательное направление! Вы можете найти материалы в нашей базе знаний и практические задания на платформе CTF. Начните с изучения основных алгоритмов шифрования, таких как AES и RSA.",
        "CyberWhale предоставляет профессиональные услуги по аудиту безопасности, пентестам и мониторингу. Мы также создаём кастомные ИИ-аватары для автоматизации задач ИБ. Заинтересованы? Свяжитесь с нами!",
        "Наши услуги включают внешние и внутренние аудиты систем, консалтинг по политикам ИБ, пентесты и инцидент-респонс. Мы работаем с малым бизнесом и государственными организациями.",
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

  // DEV‑ONLY: send a test email and view recent emails (only when NODE_ENV=development)
  if (process.env.NODE_ENV === 'development') {
    // Send a test email: { to, subject, text, html }
    app.post('/api/dev/send-test-email', async (req, res) => {
      try {
        const { to, subject, text, html } = req.body;
        if (!to) return res.status(400).json({ message: 'Field "to" is required' });

        const ok = await emailService.sendEmail({
          to,
          subject: subject || 'Test email from CyberWhale',
          text: text || 'This is a test email sent from dev endpoint.',
          html
        });

        if (ok) return res.json({ success: true, message: 'Email sent (check logs or preview URL)' });
        return res.status(500).json({ success: false, message: 'Failed to send email' });
      } catch (e) {
        console.error('Dev send-test-email error:', e);
        res.status(500).json({ success: false, message: 'Internal error' });
      }
    });

    // Get recent sent emails (from in-memory buffer)
    app.get('/api/dev/emails', (req, res) => {
      try {
        const limit = parseInt(String(req.query.limit || '20')) || 20;
        const data = emailService.getLastSent(limit);
        res.json({ emails: data });
      } catch (e) {
        console.error('Dev get emails error:', e);
        res.status(500).json({ message: 'Internal error' });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}