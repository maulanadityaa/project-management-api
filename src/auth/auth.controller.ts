import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
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
import { CommonResponse } from '../model/common-response.model';
import { Auth } from '../common/auth.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { MailResponse } from 'src/model/mail.model';
import { boolean } from 'zod';
import { User } from '@prisma/client';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if username is available' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Username is available',
    type: Boolean,
  })
  @ApiBody({ type: CheckUsernameRequest })
  async checkUsername(
    @Body() request: CheckUsernameRequest,
  ): Promise<CommonResponse<boolean>> {
    const result = await this.authService.checkUsername(request);

    return {
      statusCode: HttpStatus.OK,
      message: 'Username is available',
      data: result,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered',
    type: RegisterResponse,
  })
  @ApiBody({ type: RegisterRequest })
  async register(
    @Body() request: RegisterRequest,
  ): Promise<CommonResponse<RegisterResponse>> {
    const result = await this.authService.register(request);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered',
      data: result,
    };
  }

  @Get('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm user registration' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User registration confirmed',
    type: UserResponse,
  })
  async confirm(
    @Query('code') code: string,
    @Query('username') username: string,
    @Query('uid') uid: string,
  ): Promise<CommonResponse<LoginResponse>> {
    const request: RegisterConfirmationRequest = {
      code,
      username,
      uid,
    };

    const result = await this.authService.confirmSignup(request);

    return {
      statusCode: HttpStatus.OK,
      message: 'User registration confirmed',
      data: result,
    };
  }

  @Post('send-confirmation-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send confirmation email',
    description:
      'This endpoint requires a valid access token for authorization.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Confirmation email sent',
  })
  @ApiBody({ type: UserMailRequest })
  @ApiBearerAuth()
  async sendConfirmationEmail(
    @Body() request: UserMailRequest,
    @Auth() token: string,
  ): Promise<CommonResponse<MailResponse>> {
    const result = await this.authService.resendAccountConfirmation(
      request,
      token,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Confirmation email sent',
      data: result,
    };
  }

  @Post('send-password-reset-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send password reset email',
    description:
      'This endpoint requires a valid access token for authorization.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset email sent',
  })
  @ApiBody({ type: UserMailRequest })
  @ApiBearerAuth()
  async sendPasswordResetEmail(
    @Body() request: UserMailRequest,
    @Auth() token: string,
  ): Promise<CommonResponse<MailResponse>> {
    const result = await this.authService.sendPasswordReset(request, token);

    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset email sent',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login to the system' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: LoginResponse,
  })
  @ApiBody({ type: LoginRequest })
  async login(
    @Body() request: LoginRequest,
  ): Promise<CommonResponse<LoginResponse>> {
    const result = await this.authService.login(request);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: result,
    };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current user information',
    description:
      'This endpoint requires a valid access token for authorization.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user information',
    type: UserResponse,
  })
  @ApiBearerAuth()
  async me(@Auth() token: string): Promise<CommonResponse<UserResponse>> {
    const result = await this.authService.get(token);

    return {
      statusCode: HttpStatus.OK,
      message: 'Current user information',
      data: result,
    };
  }

  @Post('confirm-token-reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm token for password reset',
    description:
      'This endpoint requires a valid access token for authorization.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token confirmed for password reset',
    type: boolean,
  })
  @ApiBody({ type: PasswordResetRequest })
  @ApiBearerAuth()
  async confirmTokenResetPassword(
    @Body() request: PasswordResetRequest,
    @Auth() token: string,
  ): Promise<CommonResponse<boolean>> {
    const result = await this.authService.confirmResetPassword(request, token);

    return {
      statusCode: HttpStatus.OK,
      message: 'Code confirmed for password reset',
      data: result,
    };
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user information',
    description:
      'This endpoint requires a valid access token for authorization.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated',
    type: UserResponse,
  })
  @ApiConsumes('application/json')
  @ApiBody({ type: UserUpdateRequest })
  @ApiBearerAuth()
  async update(
    @Auth() token: string,
    @Body() request: UserUpdateRequest,
  ): Promise<CommonResponse<UserResponse>> {
    const result = await this.authService.update(token, request);

    return {
      statusCode: HttpStatus.OK,
      message: 'User updated',
      data: result,
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'This endpoint allows users to request a password reset email.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset email sent',
    type: UserForgotPasswordResponse,
  })
  @ApiBody({ type: UserForgotPasswordRequest })
  async forgotPassword(
    @Body() request: UserForgotPasswordRequest,
  ): Promise<CommonResponse<UserForgotPasswordResponse>> {
    const result = await this.authService.sendEmailForgotPassword(request);

    return {
      statusCode: HttpStatus.OK,
      message: 'Password reset email sent',
      data: result,
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'This endpoint allows users to refresh their access token using a valid refresh token.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Access token refreshed',
    type: LoginResponse,
  })
  @ApiBearerAuth()
  async refreshToken(
    @Auth() token: string,
  ): Promise<CommonResponse<LoginResponse>> {
    const result = await this.authService.refreshJwtToken(token);

    return {
      statusCode: HttpStatus.OK,
      message: 'Access token refreshed',
      data: result,
    };
  }
}
