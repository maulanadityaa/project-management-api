import { Body, Controller, HttpStatus, Post, Put } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequest, LoginResponse, RegisterRequest, UserResponse, UserUpdateRequest } from "../model/auth.model";
import { CommonResponse } from "../model/common-response.model";
import { Auth } from "../common/auth.decorator";

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
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
  async update(
    @Auth() token: string,
    @Body() request: UserUpdateRequest
  ): Promise<CommonResponse<UserResponse>> {
    const result = await this.authService.update(token, request);

    return {
      statusCode: HttpStatus.OK,
      message: 'User updated',
      data: result,
    };
  }
}
