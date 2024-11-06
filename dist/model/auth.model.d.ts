export declare class RegisterRequest {
    username: string;
    name: string;
    password: string;
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
export declare class LoginResponse {
    token: string;
}
export declare class DecodedUser {
    username: string;
    name: string;
    token: string;
}
