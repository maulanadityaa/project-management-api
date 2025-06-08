import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  CheckUsernameRequest,
  LoginRequest,
  LoginResponse,
  RegisterConfirmationRequest,
  RegisterRequest,
  RegisterResponse,
  UserResponse,
  UserUpdateRequest,
} from '../model/auth.model';
import { AuthValidation } from './auth.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async checkUsername(request: CheckUsernameRequest): Promise<boolean> {
    this.logger.debug(`Checking if username ${request.username} is available`);

    const user = await this.prismaService.user.findUnique({
      where: {
        username: request.username.toLowerCase(),
      },
    });

    if (user) {
      throw new HttpException('Username already exists', 400);
    }

    return true;
  }

  async generateCode(length = 8): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    this.logger.debug(`Registering user ${JSON.stringify(request)}`);

    const registerRequest: RegisterRequest = this.validationService.validate(
      AuthValidation.REGISTER,
      request,
    );

    registerRequest.username = registerRequest.username.toLowerCase();

    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registerRequest.email },
    });

    if (existingUser) {
      throw new HttpException('Email already in use', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const createdUser = await this.prismaService.$transaction(
      async (prisma) => {
        const user = await prisma.user.create({
          data: registerRequest,
        });

        const emailCode = await prisma.emailCode.create({
          data: {
            code: await this.generateCode(),
            expired_at: new Date(Date.now() + 5 * 60 * 1000),
            user: {
              connect: { id: user.id },
            },
          },
        });

        return { user, emailCode };
      },
    );
    if (!createdUser) {
      throw new HttpException('Failed to create user', 500);
    }

    let appUrl = process.env.APP_LOCAL_URL;
    if (process.env.NODE_ENV === 'production') {
      appUrl = process.env.APP_PROD_URL;
    }

    const mailResponse = await this.mailService.sendSignupConfirmation({
      to: registerRequest.email,
      token: createdUser.emailCode.code,
      subject: 'Signup Confirmation',
      username: createdUser.user.username,
      link: `${appUrl}/api/v1/auth/confirm?username=${createdUser.user.username}&uid=${createdUser.user.id}&token=${createdUser.emailCode.code}`,
    });

    return {
      username: createdUser.user.username,
      name: createdUser.user.name,
      isEmailSent: mailResponse.success,
    };
  }

  async sendConfirmationLink(username: string, uid: string): Promise<string> {
    this.logger.debug(
      `Sending confirmation link for user ${username} with UID ${uid}`,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        username: username.toLowerCase(),
        id: uid,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    const emailCode = await this.prismaService.emailCode.create({
      data: {
        code: await this.generateCode(),
        expired_at: new Date(Date.now() + 5 * 60 * 1000),
        user: {
          connect: { id: user.id },
        },
      },
    });

    let appUrl = process.env.APP_LOCAL_URL;
    if (process.env.NODE_ENV === 'production') {
      appUrl = process.env.APP_PROD_URL;
    }

    const mailResponse = await this.mailService.sendSignupConfirmation({
      to: user.email,
      token: emailCode.code,
      subject: 'Signup Confirmation',
      username: user.username,
      link: `${appUrl}/api/v1/auth/confirm?username=${user.username}&uid=${user.id}&token=${emailCode.code}`,
    });

    return `${appUrl}/api/v1/auth/confirm?username=${user.username}&uid=${user.id}&token=${emailCode.code}`;
  }

  async confirmSignup(
    request: RegisterConfirmationRequest,
  ): Promise<UserResponse> {
    this.logger.debug(`Confirming signup for user ${JSON.stringify(request)}`);

    const user = await this.prismaService.user.findUnique({
      where: {
        username: request.username.toLowerCase(),
        id: request.uid,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    const emailCode = await this.prismaService.emailCode.findFirst({
      where: {
        code: request.token,
        user_id: user.id,
      },
    });
    if (!emailCode) {
      throw new HttpException('Invalid confirmation token', 400);
    }
    if (emailCode.is_used) {
      throw new HttpException('Token already used', 400);
    }
    if (emailCode.expired_at < new Date()) {
      throw new HttpException('Token expired', 400);
    }

    const confirmedUser = await this.prismaService.$transaction(
      async (prisma) => {
        const userToConfirm = await prisma.user.update({
          where: { id: user.id },
          data: { is_confirmed: true },
        });

        await this.prismaService.emailCode.update({
          where: { id: emailCode.id },
          data: { is_used: true },
        });

        return userToConfirm;
      },
    );
    if (!confirmedUser) {
      throw new HttpException('Failed to confirm user', 500);
    }

    return {
      username: confirmedUser.username,
      name: confirmedUser.name,
    };
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    this.logger.debug(`Logging in user ${JSON.stringify(request)}`);

    const loginRequest: LoginRequest = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    );

    loginRequest.username = loginRequest.username.toLowerCase();

    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });
    if (!user) {
      throw new HttpException('Invalid username or password', 401);
    }
    const passwordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new HttpException('Invalid username or password', 401);
    }

    if (!user.is_confirmed) {
      throw new HttpException('User is not confirmed', 403);
    }

    const token = await this.jwtService.generateToken(user);

    return {
      token: token,
    };
  }

  async get(token: string): Promise<UserResponse> {
    this.logger.debug(`Getting user info from token`);

    const decodedUser = await this.jwtService.verifyToken(token);

    const user = await this.prismaService.user.findUnique({
      where: {
        username: decodedUser.username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    return {
      username: user.username,
      name: user.name,
    };
  }

  async update(
    token: string,
    request: UserUpdateRequest,
  ): Promise<UserResponse> {
    this.logger.debug(`Updating user ${JSON.stringify(request)}`);

    const updateRequest: UserUpdateRequest = this.validationService.validate(
      AuthValidation.UPDATE,
      request,
    );

    const decodedUser = await this.jwtService.verifyToken(token);

    const user = await this.prismaService.user.findUnique({
      where: {
        username: decodedUser.username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    if (updateRequest.password) {
      updateRequest.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const updatedUser = await this.prismaService.user.update({
      where: {
        username: decodedUser.username,
      },
      data: updateRequest,
    });

    return {
      username: updatedUser.username,
      name: updatedUser.name,
    };
  }
}
