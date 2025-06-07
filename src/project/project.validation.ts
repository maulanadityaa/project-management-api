import { z, ZodType } from 'zod';

export class ProjectValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(255).optional(),
    link: z
      .string()
      .url()
      .refine(
        (url) => {
          const domainMatch = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
          if (!domainMatch) return false;
          const domain = domainMatch[1];
          return /\.\w{2,}$/.test(domain);
        },
        {
          message: "URL must have a valid domain with a TLD (e.g., '.com')",
        },
      ),
    technologies: z.array(z.string().min(1).max(255)),
    image: z.object({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string().refine((mimetype) => mimetype.startsWith('image/'), {
        message: 'Only images file are allowed',
      }),
      size: z.number(),
      buffer: z.instanceof(Buffer, {
        message: 'Buffer is required',
      }),
      destination: z.string().optional(),
      filename: z.string().optional(),
      path: z.string().optional(),
    }),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string().min(1).max(255),
    name: z.string().min(1).max(255).optional(),
    description: z.string().min(1).max(255).optional(),
    link: z
      .string()
      .url()
      .refine(
        (url) => {
          const domainMatch = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
          if (!domainMatch) return false;
          const domain = domainMatch[1];
          return /\.\w{2,}$/.test(domain);
        },
        {
          message: "URL must have a valid domain with a TLD (e.g., '.com')",
        },
      )
      .optional(),
    technologies: z.array(z.string().min(1).max(255)).optional(),
    image: z
      .object({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z
          .string()
          .refine((mimetype) => mimetype.startsWith('image/'), {
            message: 'Only images file are allowed',
          }),
        size: z.number(),
        buffer: z.instanceof(Buffer, {
          message: 'Buffer is required',
        }),
        destination: z.string().optional(),
        filename: z.string().optional(),
        path: z.string().optional(),
      })
      .optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().min(1).optional(),
    techs: z.array(z.string().min(1)).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
