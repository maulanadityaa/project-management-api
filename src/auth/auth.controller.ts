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
  RegisterConfirmationRequest,
  RegisterRequest,
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
    type: UserResponse,
  })
  @ApiBody({ type: RegisterRequest })
  async register(
    @Body() request: RegisterRequest,
  ): Promise<CommonResponse<UserResponse>> {
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
    @Query('token') token: string,
    @Query('username') username: string,
    @Query('uid') uid: string,
  ): Promise<CommonResponse<LoginResponse>> {
    const request: RegisterConfirmationRequest = {
      token,
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
  @ApiOperation({ summary: 'Send confirmation email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Confirmation email sent',
  })
  async sendConfirmationEmail(
    @Body() request: { username: string; uid: string },
  ): Promise<CommonResponse<string>> {
    const result = await this.authService.sendConfirmationLink(
      request.username,
      request.uid,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Confirmation email sent',
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
}
