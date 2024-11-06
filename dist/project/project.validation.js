"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidation = void 0;
const zod_1 = require("zod");
class ProjectValidation {
}
exports.ProjectValidation = ProjectValidation;
ProjectValidation.CREATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().min(1).max(255).optional(),
    technologies: zod_1.z.array(zod_1.z.string().min(1).max(255)),
    image: zod_1.z.object({
        fieldname: zod_1.z.string(),
        originalname: zod_1.z.string(),
        encoding: zod_1.z.string(),
        mimetype: zod_1.z.string().refine((mimetype) => mimetype.startsWith('image/'), {
            message: 'Only images file are allowed'
        }),
        size: zod_1.z.number(),
        buffer: zod_1.z.instanceof(Buffer, {
            message: 'Buffer is required'
        }),
        destination: zod_1.z.string().optional(),
        filename: zod_1.z.string().optional(),
        path: zod_1.z.string().optional(),
    })
});
ProjectValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.string().min(1).max(255),
    name: zod_1.z.string().min(1).max(255).optional(),
    description: zod_1.z.string().min(1).max(255).optional(),
    technologies: zod_1.z.array(zod_1.z.string().min(1).max(255)).optional(),
    image: zod_1.z.object({
        fieldname: zod_1.z.string(),
        originalname: zod_1.z.string(),
        encoding: zod_1.z.string(),
        mimetype: zod_1.z.string().refine((mimetype) => mimetype.startsWith('image/'), {
            message: 'Only images file are allowed'
        }),
        size: zod_1.z.number(),
        buffer: zod_1.z.instanceof(Buffer, {
            message: 'Buffer is required'
        }),
        destination: zod_1.z.string().optional(),
        filename: zod_1.z.string().optional(),
        path: zod_1.z.string().optional(),
    }).optional()
});
ProjectValidation.SEARCH = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    techs: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    page: zod_1.z.number().min(1).positive(),
    size: zod_1.z.number().min(1).max(100).positive()
});
//# sourceMappingURL=project.validation.js.map