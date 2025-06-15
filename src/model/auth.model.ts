import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckUsernameRequest {
  @ApiProperty({ example: 'test_username', description: 'Username' })
  username: string;
}

export class RegisterRequest {
  @ApiProperty({ example: 'test_username', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'email@example.com', description: 'Email' })
  email: string;

  @ApiProperty({ example: 'test_name', description: 'Name' })
  name: string;

  @ApiProperty({ example: 'test_password', description: 'Password' })
  password: string;
}

export class RegisterConfirmationRequest {
  @ApiProperty({ example: 'validCode', description: 'Code' })
  code: string;

  @ApiProperty({ example: 'test_username', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'ValidUUIDv4', description: 'User ID' })
  uid: string;
}

export class LoginRequest {
  @ApiProperty({ example: 'test_username', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'test_password', description: 'Password' })
  password: string;
}

export class PasswordResetRequest {
  @ApiProperty({ example: 'validCode', description: 'Code' })
  code: string;

  @ApiProperty({ example: 'test_username', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'ValidUUIDv4', description: 'User ID' })
  uid: string;
}

export class UserUpdateRequest {
  @ApiProperty({ example: 'ValidUUIDv4', description: 'User ID' })
  uid: string;

  @ApiPropertyOptional({ example: 'test_name', description: 'Name (optional)' })
  name?: string;

  @ApiPropertyOptional({
    example: 'test_password',
    description: 'Password (optional)',
  })
  password?: string;

  @ApiPropertyOptional({
    example: 'code',
    description: 'Password reset code (optional -- for password reset only)',
  })
  code?: string;
}

export class UserMailRequest {
  @ApiProperty({ example: 'username', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'ValidUUIDv4', description: 'User ID' })
  uid: string;

  @ApiPropertyOptional({
    example: 'example@email.com',
    description: 'Email (optional -- for send reset password only)',
  })
  email?: string;
}

export class UserForgotPasswordRequest {
  @ApiProperty({ example: 'example@email.com', description: 'Email' })
  email: string;
}

export class UserResponse {
  @ApiProperty({ example: 'test_username', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'test_name', description: 'Name' })
  name: string;

  @ApiProperty({ example: 'ValidUUIDv4', description: 'User ID' })
  uid: string;

  @ApiProperty({ example: 'example@mail.com', description: 'Email' })
  email: string;
}

export class UserForgotPasswordResponse {
  @ApiProperty({ example: 'validJwtToken', description: 'Token' })
  token: string;

  @ApiProperty({ example: true, description: 'Is Email Sent' })
  isEmailSent: boolean;
}

export class RegisterResponse {
  @ApiProperty({ example: 'validJwtToken', description: 'Token' })
  token: string;

  @ApiProperty({ example: true, description: 'Is Email Sent' })
  isEmailSent: boolean;
}

export class LoginResponse {
  @ApiProperty({ example: 'validJwtToken', description: 'Token' })
  token: string;

  @ApiProperty({ example: true, description: 'Is User Confirmed' })
  isConfirmed?: boolean;
}

export class DecodedUser {
  username: string;
  name: string;
  token: string;
}
