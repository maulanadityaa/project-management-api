import { z, ZodType } from 'zod';

export class MailValidation {
  static readonly SEND: ZodType = z.object({
    to: z.string().email(),
    subject: z.string().min(1).max(255),
    text: z.string().min(1).max(1000),
    html: z.string().min(1).max(1000).optional(),
  });

  static readonly SIGNUP_CONFIRMATION: ZodType = z.object({
    to: z.string().email(),
    token: z.string(),
    username: z.string().min(1).max(255),
    link: z.string().url(),
    subject: z.string().min(1).max(255).optional(),
    text: z.string().min(1).max(1000).optional(),
    html: z.string().min(1).max(1000).optional(),
  });
}
