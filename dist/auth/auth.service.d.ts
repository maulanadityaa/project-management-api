import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { LoginRequest, LoginResponse, RegisterRequest, UserResponse, UserUpdateRequest } from '../model/auth.model';
import { JwtService } from '../jwt/jwt.service';
export declare class AuthService {
    private validationService;
    private readonly logger;
    private prismaService;
    private jwtService;
    constructor(validationService: ValidationService, logger: Logger, prismaService: PrismaService, jwtService: JwtService);
    register(request: RegisterRequest): Promise<UserResponse>;
    login(request: LoginRequest): Promise<LoginResponse>;
    update(token: string, request: UserUpdateRequest): Promise<UserResponse>;
}
