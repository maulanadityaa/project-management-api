import { ZodType } from 'zod';
export declare class AuthValidation {
    static readonly REGISTER: ZodType;
    static readonly LOGIN: ZodType;
    static readonly UPDATE: ZodType;
    static readonly USER_MAIL: ZodType;
    static readonly TOKEN_CONFIRMATION: ZodType;
    static readonly PASSWORD_RESET: ZodType;
    static readonly USERNAME_CHECK: ZodType;
    static readonly FORGOT_PASSWORD: ZodType;
}
