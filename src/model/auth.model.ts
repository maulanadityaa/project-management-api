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
  @ApiProperty({ example: 'validToken', description: 'Token' })
  token: string;

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

export class UserUpdateRequest {
  @ApiPropertyOptional({ example: 'test_name', description: 'Name (optional)' })
  name?: string;

  @ApiPropertyOptional({
    example: 'test_password',
    description: 'Password (optional)',
  })
  password?: string;
}

export class UserResponse {
  @ApiProperty({ example: 'test_username', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'test_name', description: 'Name' })
  name: string;
}

export class RegisterResponse {
  @ApiProperty({ example: 'test_username', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'test_name', description: 'Name' })
  name: string;

  @ApiProperty({ example: true, description: 'Is Email Sent' })
  isEmailSent: boolean;
}

export class LoginResponse {
  @ApiProperty({ example: 'validJwtToken', description: 'Token' })
  token: string;
}

export class DecodedUser {
  username: string;
  name: string;
  token: string;
}
