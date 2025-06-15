import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  CheckUsernameRequest,
  LoginRequest,
  LoginResponse,
  PasswordResetRequest,
  RegisterConfirmationRequest,
  RegisterRequest,
  RegisterResponse,
  UserForgotPasswordRequest,
  UserForgotPasswordResponse,
  UserMailRequest,
  UserResponse,
  UserUpdateRequest,
} from '../model/auth.model';
import { AuthValidation } from './auth.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { MailResponse } from 'src/model/mail.model';

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

    const checkRequest: CheckUsernameRequest = this.validationService.validate(
      AuthValidation.USERNAME_CHECK,
      request,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        username: checkRequest.username.toLowerCase(),
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

    const existingEmail = await this.prismaService.user.findUnique({
      where: { email: registerRequest.email },
    });

    if (existingEmail) {
      throw new HttpException('Email already exists', 400);
    }

    await this.checkUsername({ username: registerRequest.username });

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
      username: createdUser.user.username,
      link: `${appUrl}/api/v1/auth/confirm?username=${createdUser.user.username}&uid=${createdUser.user.id}&token=${createdUser.emailCode.code}`,
    });

    const token = await this.jwtService.generateToken(createdUser.user);

    return {
      token: token,
      isEmailSent: mailResponse.success,
    };
  }

  async resendAccountConfirmation(
    request: UserMailRequest,
    token: string,
  ): Promise<MailResponse> {
    this.logger.debug(
      `Resending account confirmation email for user ${JSON.stringify(request)}`,
    );

    const mailRequest: UserMailRequest = this.validationService.validate(
      AuthValidation.USER_MAIL,
      request,
    );

    const userData = await this.jwtService.verifyToken(token);
    console.log(
      `Token verified for user ${mailRequest.username} with UID ${mailRequest.uid}`,
    );
    if (
      userData.username.toLowerCase() !== mailRequest.username.toLowerCase()
    ) {
      throw new HttpException('Invalid token for this user', 400);
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        AND: [
          { username: mailRequest.username.toLowerCase() },
          { id: mailRequest.uid },
        ],
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

    const mailResponse = await this.mailService.resendAccountConfirmation({
      to: user.email,
      token: emailCode.code,
      username: user.username,
      link: `${appUrl}/api/v1/auth/confirm?username=${user.username}&uid=${user.id}&token=${emailCode.code}`,
    });

    return {
      success: mailResponse.success,
      message: mailResponse.message,
    };
  }

  async confirmSignup(
    request: RegisterConfirmationRequest,
  ): Promise<LoginResponse> {
    this.logger.debug(`Confirming signup for user ${JSON.stringify(request)}`);

    const confirmationRequest: RegisterConfirmationRequest =
      this.validationService.validate(
        AuthValidation.TOKEN_CONFIRMATION,
        request,
      );

    const user = await this.prismaService.user.findUnique({
      where: {
        username: confirmationRequest.username.toLowerCase(),
        id: confirmationRequest.uid,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    const emailCode = await this.prismaService.emailCode.findFirst({
      where: {
        code: confirmationRequest.code,
        user_id: user.id,
        is_used: false,
      },
    });
    if (!emailCode) {
      throw new HttpException('Token is invalid', 400);
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

    const token = await this.jwtService.generateToken(confirmedUser);

    return {
      token: token,
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

    const token = await this.jwtService.generateToken(user);

    if (!user.is_confirmed) {
      return {
        token: token,
        isConfirmed: user.is_confirmed,
      };
    }

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
      uid: user.id,
      email: user.email,
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
    if (updateRequest.uid !== decodedUser.userId) {
      throw new HttpException('Invalid user ID in token or request', 400);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: decodedUser.uid,
        username: decodedUser.username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    if (updateRequest.password) {
      console.log(
        `Updating password for user ${decodedUser.username} with UID ${user.id} and code ${updateRequest.code}`,
      );

      if (updateRequest.code === undefined) {
        throw new HttpException('Code is required for password reset', 400);
      }

      const checkMailCode = await this.prismaService.emailCode.findMany({
        where: {
          user_id: user.id,
          code: updateRequest.code,
          is_used: true,
        },
      });
      if (!checkMailCode) {
        throw new HttpException('Invalid token for password reset', 400);
      }

      updateRequest.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const updatedUser = await this.prismaService.user.update({
      where: {
        username: decodedUser.username,
        id: decodedUser.userId,
      },
      data: {
        name: updateRequest.name,
        password: updateRequest.password,
      },
    });

    return {
      uid: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      name: updatedUser.name,
    };
  }

  async sendPasswordReset(
    request: UserMailRequest,
    token: string,
  ): Promise<MailResponse> {
    this.logger.debug(
      `Sending password reset link for user ${request.username} with UID ${request.uid}`,
    );

    const mailRequest: UserMailRequest = this.validationService.validate(
      AuthValidation.USER_MAIL,
      request,
    );

    await this.jwtService.verifyToken(token);
    console.log(
      `Token verified for user ${mailRequest.username} with UID ${mailRequest.uid}`,
    );
    if (
      mailRequest.username.toLowerCase() !== mailRequest.username.toLowerCase()
    ) {
      throw new HttpException('Invalid token for this user', 400);
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        AND: [
          { username: mailRequest.username.toLowerCase() },
          { id: mailRequest.uid },
          {
            email: mailRequest.email
              ? mailRequest.email.toLowerCase()
              : undefined,
          },
        ],
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

    const mailResponse = await this.mailService.sendPasswordReset({
      to: user.email,
      token: emailCode.code,
      username: user.username,
      link: `${appUrl}/api/v1/auth/reset-password?username=${user.username}&uid=${user.id}&token=${emailCode.code}`,
    });

    return {
      success: mailResponse.success,
      message: mailResponse.message,
    };
  }

  async confirmResetPassword(
    request: PasswordResetRequest,
    token: string,
  ): Promise<boolean> {
    this.logger.debug(
      `Confirming password reset for user ${JSON.stringify(request)}`,
    );

    const resetRequest: PasswordResetRequest = this.validationService.validate(
      AuthValidation.TOKEN_CONFIRMATION,
      request,
    );

    await this.jwtService.verifyToken(token);

    const user = await this.prismaService.user.findUnique({
      where: {
        username: resetRequest.username.toLowerCase(),
        id: resetRequest.uid,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    const emailCode = await this.prismaService.emailCode.findFirst({
      where: {
        code: resetRequest.code,
        user_id: user.id,
        is_used: false,
      },
    });
    if (!emailCode) {
      throw new HttpException('Token is invalid', 400);
    }
    if (emailCode.is_used) {
      throw new HttpException('Token already used', 400);
    }
    if (emailCode.expired_at < new Date()) {
      throw new HttpException('Token expired', 400);
    }

    return true;
  }

  async sendEmailForgotPassword(
    request: UserForgotPasswordRequest,
  ): Promise<UserForgotPasswordResponse> {
    this.logger.debug(
      `Sending email for password reset for user ${JSON.stringify(request)}`,
    );

    const mailRequest: UserMailRequest = this.validationService.validate(
      AuthValidation.FORGOT_PASSWORD,
      request,
    );

    const user = await this.prismaService.user.findFirst({
      where: {
        email: mailRequest.email.toLowerCase(),
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

    const mailResponse = await this.mailService.sendPasswordReset({
      to: user.email,
      token: emailCode.code,
      username: user.username,
      link: `${appUrl}/api/v1/auth/reset-password?username=${user.username}&uid=${user.id}&token=${emailCode.code}`,
    });

    const token = await this.jwtService.generateToken(user);

    return {
      token: token,
      isEmailSent: mailResponse.success,
    };
  }

  async refreshJwtToken(token: string): Promise<LoginResponse> {
    this.logger.debug(`Refreshing JWT token`);

    const decodedUser =
      await this.jwtService.verifyTokenWithoutExpiration(token);

    const user = await this.prismaService.user.findUnique({
      where: {
        id: decodedUser.userId,
        username: decodedUser.username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 400);
    }

    const newToken = await this.jwtService.refreshToken(token, user);

    return {
      token: newToken,
      isConfirmed: user.is_confirmed,
    };
  }
}
