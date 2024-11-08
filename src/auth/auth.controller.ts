import { Body, Controller, HttpCode, HttpStatus, Post, Put } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequest, LoginResponse, RegisterRequest, UserResponse, UserUpdateRequest } from "../model/auth.model";
import { CommonResponse } from "../model/common-response.model";
import { Auth } from "../common/auth.decorator";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered', type: UserResponse })
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login to the system' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: LoginResponse })
  @ApiBody({ type: LoginRequest })
  async login(
    @Body() request: LoginRequest
  ): Promise<CommonResponse<LoginResponse>> {
    const result = await this.authService.login(request);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: result,
    };
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated', type: UserResponse })
  @ApiConsumes('application/json')
  @ApiBody({ type: UserUpdateRequest })
  @ApiBearerAuth()
  async update(
    @Auth() token: string,
    @Body() request: UserUpdateRequest
  ): Promise<CommonResponse<UserResponse>> {
    console.log(token);
    const result = await this.authService.update(token, request);

    return {
      statusCode: HttpStatus.OK,
      message: 'User updated',
      data: result,
    };
  }
}
