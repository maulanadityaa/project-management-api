export declare class CheckUsernameRequest {
    username: string;
}
export declare class RegisterRequest {
    username: string;
    email: string;
    name: string;
    password: string;
}
export declare class RegisterConfirmationRequest {
    code: string;
    username: string;
    uid: string;
}
export declare class LoginRequest {
    username: string;
    password: string;
}
export declare class PasswordResetRequest {
    code: string;
    username: string;
    uid: string;
}
export declare class UserUpdateRequest {
    uid: string;
    name?: string;
    password?: string;
    code?: string;
}
export declare class UserMailRequest {
    username: string;
    uid: string;
    email?: string;
}
export declare class UserForgotPasswordRequest {
    email: string;
}
export declare class UserResponse {
    username: string;
    name: string;
    uid: string;
    email: string;
}
export declare class UserForgotPasswordResponse {
    token: string;
    isEmailSent: boolean;
}
export declare class RegisterResponse {
    token: string;
    isEmailSent: boolean;
}
export declare class LoginResponse {
    token: string;
    isConfirmed?: boolean;
}
export declare class DecodedUser {
    username: string;
    name: string;
    token: string;
}
