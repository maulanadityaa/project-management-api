import e from 'express';
import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
    password: z.string().min(1).max(255),
    name: z.string().min(1).max(255),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
  });

  static readonly UPDATE: ZodType = z.object({
    uid: z.string().uuid(),
    name: z.string().min(1).max(255).optional(),
    password: z.string().min(1).max(255).optional(),
    code: z.string().min(8).max(8).optional(),
  });

  static readonly USER_MAIL: ZodType = z.object({
    username: z.string().min(1).max(255),
    uid: z.string().uuid(),
    email: z.string().email().min(1).max(255),
  });

  static readonly TOKEN_CONFIRMATION: ZodType = z.object({
    code: z.string().min(1).max(255),
    username: z.string().min(1).max(255),
    uid: z.string().uuid(),
  });

  static readonly PASSWORD_RESET: ZodType = z.object({
    code: z.string().min(1).max(255),
    username: z.string().min(1).max(255),
    uid: z.string().uuid(),
  });

  static readonly USERNAME_CHECK: ZodType = z.object({
    username: z.string().min(1).max(255),
  });

  static readonly FORGOT_PASSWORD: ZodType = z.object({
    email: z.string().email().min(1).max(255),
  });
}
