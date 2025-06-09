import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { CheckUsernameRequest, LoginRequest, LoginResponse, RegisterConfirmationRequest, RegisterRequest, RegisterResponse, UserResponse, UserUpdateRequest } from '../model/auth.model';
import { JwtService } from '../jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
export declare class AuthService {
    private validationService;
    private readonly logger;
    private prismaService;
    private jwtService;
    private mailService;
    constructor(validationService: ValidationService, logger: Logger, prismaService: PrismaService, jwtService: JwtService, mailService: MailService);
    checkUsername(request: CheckUsernameRequest): Promise<boolean>;
    generateCode(length?: number): Promise<string>;
    register(request: RegisterRequest): Promise<RegisterResponse>;
    sendConfirmationLink(username: string, uid: string): Promise<string>;
    confirmSignup(request: RegisterConfirmationRequest): Promise<LoginResponse>;
    login(request: LoginRequest): Promise<LoginResponse>;
    get(token: string): Promise<UserResponse>;
    update(token: string, request: UserUpdateRequest): Promise<UserResponse>;
}
