"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
class AuthValidation {
}
exports.AuthValidation = AuthValidation;
AuthValidation.REGISTER = zod_1.z.object({
    username: zod_1.z.string().min(1).max(255),
    email: zod_1.z.string().email().min(1).max(255),
    password: zod_1.z.string().min(1).max(255),
    name: zod_1.z.string().min(1).max(255),
});
AuthValidation.LOGIN = zod_1.z.object({
    username: zod_1.z.string().min(1).max(255),
    password: zod_1.z.string().min(1).max(255),
});
AuthValidation.UPDATE = zod_1.z.object({
    uid: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(255).optional(),
    password: zod_1.z.string().min(1).max(255).optional(),
    code: zod_1.z.string().min(8).max(8).optional(),
});
AuthValidation.USER_MAIL = zod_1.z.object({
    username: zod_1.z.string().min(1).max(255),
    uid: zod_1.z.string().uuid(),
    email: zod_1.z.string().email().min(1).max(255),
});
AuthValidation.TOKEN_CONFIRMATION = zod_1.z.object({
    code: zod_1.z.string().min(1).max(255),
    username: zod_1.z.string().min(1).max(255),
    uid: zod_1.z.string().uuid(),
});
AuthValidation.PASSWORD_RESET = zod_1.z.object({
    code: zod_1.z.string().min(1).max(255),
    username: zod_1.z.string().min(1).max(255),
    uid: zod_1.z.string().uuid(),
});
AuthValidation.USERNAME_CHECK = zod_1.z.object({
    username: zod_1.z.string().min(1).max(255),
});
AuthValidation.FORGOT_PASSWORD = zod_1.z.object({
    email: zod_1.z.string().email().min(1).max(255),
});
//# sourceMappingURL=auth.validation.js.map