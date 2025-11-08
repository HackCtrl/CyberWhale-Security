import { z } from "zod";

export const usernameSchema = z.string()
  .min(3, "Никнейм должен содержать минимум 3 символа")
  .max(20, "Никнейм не может быть длиннее 20 символов")
  .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, "Никнейм должен начинаться с буквы и может содержать только буквы, цифры, тире и подчеркивания")
  .transform(s => s.toLowerCase()) // Приводим к нижнему регистру для единообразия
  .refine(
    username => !/^(admin|root|system|moderator|administrator|support)$/i.test(username),
    "Этот никнейм зарезервирован системой"
  );

export const registrationSchema = z.object({
  username: usernameSchema,
  email: z.string().email("Некорректный email адрес"),
  password: z.string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "Пароль должен содержать хотя бы одну заглавную букву, цифру и специальный символ"),
});