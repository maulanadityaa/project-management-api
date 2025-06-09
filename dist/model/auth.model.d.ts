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
    token: string;
    username: string;
    uid: string;
}
export declare class LoginRequest {
    username: string;
    password: string;
}
export declare class UserUpdateRequest {
    name?: string;
    password?: string;
}
export declare class UserResponse {
    username: string;
    name: string;
}
export declare class RegisterResponse {
    uid: string;
    username: string;
    email: string;
    name: string;
    isEmailSent: boolean;
}
export declare class LoginResponse {
    token: string;
}
export declare class DecodedUser {
    username: string;
    name: string;
    token: string;
}
