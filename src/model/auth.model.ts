export class RegisterRequest {
  username: string;
  name: string;
  password: string;
}

export class LoginRequest {
  username: string;
  password: string;
}

export class UserUpdateRequest {
  name?: string;
  password?: string;
}

export class UserResponse {
  username: string;
  name: string;
}

export class LoginResponse {
  token: string;
}

export class DecodedUser {
  username: string;
  name: string;
  token: string;
}