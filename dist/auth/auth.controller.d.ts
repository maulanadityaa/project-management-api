import { AuthService } from './auth.service';
import { CheckUsernameRequest, LoginRequest, LoginResponse, RegisterRequest, UserResponse, UserUpdateRequest } from '../model/auth.model';
import { CommonResponse } from '../model/common-response.model';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    checkUsername(request: CheckUsernameRequest): Promise<CommonResponse<boolean>>;
    register(request: RegisterRequest): Promise<CommonResponse<UserResponse>>;
    confirm(token: string, username: string, uid: string): Promise<CommonResponse<LoginResponse>>;
    sendConfirmationEmail(request: {
        username: string;
        uid: string;
    }): Promise<CommonResponse<string>>;
    login(request: LoginRequest): Promise<CommonResponse<LoginResponse>>;
    me(token: string): Promise<CommonResponse<UserResponse>>;
    update(token: string, request: UserUpdateRequest): Promise<CommonResponse<UserResponse>>;
}
