import { AuthService } from './auth.service';
import { CheckUsernameRequest, LoginRequest, LoginResponse, PasswordResetRequest, RegisterRequest, RegisterResponse, UserForgotPasswordRequest, UserForgotPasswordResponse, UserMailRequest, UserResponse, UserUpdateRequest } from '../model/auth.model';
import { CommonResponse } from '../model/common-response.model';
import { MailResponse } from 'src/model/mail.model';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    checkUsername(request: CheckUsernameRequest): Promise<CommonResponse<boolean>>;
    register(request: RegisterRequest): Promise<CommonResponse<RegisterResponse>>;
    confirm(code: string, username: string, uid: string): Promise<CommonResponse<LoginResponse>>;
    sendConfirmationEmail(request: UserMailRequest, token: string): Promise<CommonResponse<MailResponse>>;
    sendPasswordResetEmail(request: UserMailRequest, token: string): Promise<CommonResponse<MailResponse>>;
    login(request: LoginRequest): Promise<CommonResponse<LoginResponse>>;
    me(token: string): Promise<CommonResponse<UserResponse>>;
    confirmTokenResetPassword(request: PasswordResetRequest, token: string): Promise<CommonResponse<boolean>>;
    update(token: string, request: UserUpdateRequest): Promise<CommonResponse<UserResponse>>;
    forgotPassword(request: UserForgotPasswordRequest): Promise<CommonResponse<UserForgotPasswordResponse>>;
    refreshToken(token: string): Promise<CommonResponse<LoginResponse>>;
}
