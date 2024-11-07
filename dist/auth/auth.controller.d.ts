import { AuthService } from "./auth.service";
import { LoginRequest, LoginResponse, RegisterRequest, UserResponse, UserUpdateRequest } from "../model/auth.model";
import { CommonResponse } from "../model/common-response.model";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(request: RegisterRequest): Promise<CommonResponse<UserResponse>>;
    login(request: LoginRequest): Promise<CommonResponse<LoginResponse>>;
    update(token: string, request: UserUpdateRequest): Promise<CommonResponse<UserResponse>>;
}
