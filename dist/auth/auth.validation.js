"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
class AuthValidation {
}
exports.AuthValidation = AuthValidation;
AuthValidation.REGISTER = zod_1.z.object({
    username: zod_1.z.string().min(1).max(255),
    password: zod_1.z.string().min(1).max(255),
    name: zod_1.z.string().min(1).max(255),
});
AuthValidation.LOGIN = zod_1.z.object({
    username: zod_1.z.string().min(1).max(255),
    password: zod_1.z.string().min(1).max(255),
});
AuthValidation.UPDATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255).optional(),
    password: zod_1.z.string().min(1).max(255).optional(),
});
//# sourceMappingURL=auth.validation.js.map