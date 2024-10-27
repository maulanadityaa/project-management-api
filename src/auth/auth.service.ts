import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
  UserUpdateRequest,
} from '../model/auth.model';
import { AuthValidation } from './auth.validation';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(request: RegisterRequest): Promise<UserResponse> {
    this.logger.debug(`Registering user ${JSON.stringify(request)}`);

    const registerRequest: RegisterRequest = this.validationService.validate(
      AuthValidation.REGISTER,
      request,
    );

    registerRequest.username = registerRequest.username.toLowerCase();

    const existingUser = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (existingUser !== 0) {
      throw new HttpException('Username already registered', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
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
      throw new HttpException('Invalid username or password', 400);
    }
    const passwordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new HttpException('Invalid username or password', 400);
    }

    const token = await this.jwtService.generateToken(user);

    return {
      token: token,
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
    console.log(decodedUser);

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
