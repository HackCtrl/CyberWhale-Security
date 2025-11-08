// EmailService using Unisender (transactional send) with fallbacks to Ethereal/console in dev
// Reworked to use Unisender API as primary provider.

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class EmailService {
  private static instance: EmailService;
  private verificationCodes: Map<string, { code: string; expires: Date }> = new Map();
  private lastSent: Array<any> = [];

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private transporter: any;

  constructor() {
    console.log('EmailService: configuring Gmail SMTP transport');
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    const nodemailerMod = await import('nodemailer');
    const nodemailer = nodemailerMod.default || nodemailerMod;
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'kirill.ivanov08061@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD // Пароль приложения из Gmail
      }
    });
  }

  // Generate 6-digit verification code
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendViaGmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }

      const info = await this.transporter.sendMail({
        from: `"CyberWhale" <${process.env.GMAIL_USER || 'cyberwhaleoffical@gmail.com'}>`,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
      });

      console.log('Email sent via Gmail:', info.messageId);
      
      // Store attempt info for debugging
      this.lastSent.unshift({ 
        provider: 'gmail',
        to: emailData.to,
        subject: emailData.subject,
        timestamp: new Date().toISOString(),
        messageId: info.messageId
      });
      if (this.lastSent.length > 100) this.lastSent.pop();
      
      return true;
    } catch (e) {
      console.error('Gmail send error:', e);
      this.lastSent.unshift({ 
        provider: 'gmail',
        to: emailData.to,
        subject: emailData.subject,
        timestamp: new Date().toISOString(),
        error: String(e)
      });
      if (this.lastSent.length > 100) this.lastSent.pop();
      return false;
    }
  }


  async sendEmail(emailData: EmailData): Promise<boolean> {
    // Try sending via Gmail
    const sent = await this.sendViaGmail(emailData);
    if (sent) return true;

    // Development fallback: use Ethereal if Gmail fails
    if (process.env.NODE_ENV === 'development') {
      try {
        const nodemailerMod = await import('nodemailer');
        const nodemailer = nodemailerMod.default || nodemailerMod;
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        const info = await transporter.sendMail({
          from: process.env.GMAIL_USER || 'kirill.ivanov08061@gmail.com',
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.text,
          html: emailData.html,
        });
        const url = nodemailer.getTestMessageUrl(info as any);
        console.log('Ethereal preview URL:', url);
        this.lastSent.unshift({ 
          provider: 'ethereal', 
          to: emailData.to, 
          subject: emailData.subject, 
          timestamp: new Date().toISOString(), 
          previewUrl: url 
        });
        if (this.lastSent.length > 100) this.lastSent.pop();
        return true;
      } catch (e) {
        console.error('Ethereal send fallback failed:', e);
      }
    }

    // 3) Final fallback: log to console
    const fallbackRecord = { provider: 'fallback', to: emailData.to, subject: emailData.subject, timestamp: new Date().toISOString(), text: emailData.text };
    this.lastSent.unshift(fallbackRecord);
    if (this.lastSent.length > 100) this.lastSent.pop();
    console.log('\n=== EMAIL (console fallback) ===');
    console.log(`To: ${emailData.to}`);
    console.log(`Subject: ${emailData.subject}`);
    console.log(emailData.text);
    console.log('===============================\n');
    return true;
  }

  // Return recent send attempts (dev helper)
  getLastSent(limit = 20) {
    return this.lastSent.slice(0, limit);
  }

  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    const emailData: EmailData = {
      to: email,
      subject: 'CyberWhale - Подтверждение регистрации',
      text: `Ваш код подтверждения: ${code}\n\nВведите этот код на сайте для завершения регистрации.\n\nКод действителен 15 минут.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">CyberWhale - Подтверждение регистрации</h2>
          <p>Добро пожаловать в CyberWhale!</p>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #2d3748;">Ваш код подтверждения:</h3>
            <div style="font-size: 32px; font-weight: bold; color: #3182ce; letter-spacing: 8px;">${code}</div>
          </div>
          <p>Введите этот код на сайте для завершения регистрации.</p>
          <p style="color: #718096; font-size: 14px;">Код действителен 15 минут.</p>
        </div>
      `,
    };

    return await this.sendEmail(emailData);
  }

  async sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
    const emailData: EmailData = {
      to: email,
      subject: 'CyberWhale - Восстановление пароля',
      text: `Код для восстановления пароля: ${code}\n\nВведите этот код на сайте для сброса пароля.\n\nКод действителен 15 минут.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">CyberWhale - Восстановление пароля</h2>
          <p>Вы запросили восстановление пароля.</p>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #2d3748;">Код для восстановления:</h3>
            <div style="font-size: 32px; font-weight: bold; color: #e53e3e; letter-spacing: 8px;">${code}</div>
          </div>
          <p>Введите этот код на сайте для сброса пароля.</p>
          <p style="color: #718096; font-size: 14px;">Код действителен 15 минут.</p>
        </div>
      `,
    };

    return await this.sendEmail(emailData);
  }

  // Store verification code temporarily (in production, use Redis or similar)
  storeVerificationCode(email: string, code: string): void {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15); // 15 minutes expiry
    this.verificationCodes.set(email, { code, expires });
  }

  // Verify code
  verifyCode(email: string, inputCode: string): boolean {
    const stored = this.verificationCodes.get(email);
    if (!stored) return false;

    if (new Date() > stored.expires) {
      this.verificationCodes.delete(email);
      return false;
    }

    if (stored.code === inputCode) {
      this.verificationCodes.delete(email);
      return true;
    }

    return false;
  }
}

export const emailService = EmailService.getInstance();