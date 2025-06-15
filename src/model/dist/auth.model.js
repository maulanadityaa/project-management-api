"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DecodedUser = exports.LoginResponse = exports.RegisterResponse = exports.UserForgotPasswordResponse = exports.UserResponse = exports.UserForgotPasswordRequest = exports.UserMailRequest = exports.UserUpdateRequest = exports.PasswordResetRequest = exports.LoginRequest = exports.RegisterConfirmationRequest = exports.RegisterRequest = exports.CheckUsernameRequest = void 0;
var swagger_1 = require("@nestjs/swagger");
var CheckUsernameRequest = /** @class */ (function () {
    function CheckUsernameRequest() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'test_username', description: 'Username' })
    ], CheckUsernameRequest.prototype, "username");
    return CheckUsernameRequest;
}());
exports.CheckUsernameRequest = CheckUsernameRequest;
var RegisterRequest = /** @class */ (function () {
    function RegisterRequest() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'test_username', description: 'Username' })
    ], RegisterRequest.prototype, "username");
    __decorate([
        swagger_1.ApiProperty({ example: 'email@example.com', description: 'Email' })
    ], RegisterRequest.prototype, "email");
    __decorate([
        swagger_1.ApiProperty({ example: 'test_name', description: 'Name' })
    ], RegisterRequest.prototype, "name");
    __decorate([
        swagger_1.ApiProperty({ example: 'test_password', description: 'Password' })
    ], RegisterRequest.prototype, "password");
    return RegisterRequest;
}());
exports.RegisterRequest = RegisterRequest;
var RegisterConfirmationRequest = /** @class */ (function () {
    function RegisterConfirmationRequest() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'validCode', description: 'Code' })
    ], RegisterConfirmationRequest.prototype, "code");
    __decorate([
        swagger_1.ApiProperty({ example: 'test_username', description: 'Username' })
    ], RegisterConfirmationRequest.prototype, "username");
    __decorate([
        swagger_1.ApiProperty({ example: 'ValidUUIDv4', description: 'User ID' })
    ], RegisterConfirmationRequest.prototype, "uid");
    return RegisterConfirmationRequest;
}());
exports.RegisterConfirmationRequest = RegisterConfirmationRequest;
var LoginRequest = /** @class */ (function () {
    function LoginRequest() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'test_username', description: 'Username' })
    ], LoginRequest.prototype, "username");
    __decorate([
        swagger_1.ApiProperty({ example: 'test_password', description: 'Password' })
    ], LoginRequest.prototype, "password");
    return LoginRequest;
}());
exports.LoginRequest = LoginRequest;
var PasswordResetRequest = /** @class */ (function () {
    function PasswordResetRequest() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'validCode', description: 'Code' })
    ], PasswordResetRequest.prototype, "code");
    __decorate([
        swagger_1.ApiProperty({ example: 'test_username', description: 'Username' })
    ], PasswordResetRequest.prototype, "username");
    __decorate([
        swagger_1.ApiProperty({ example: 'ValidUUIDv4', description: 'User ID' })
    ], PasswordResetRequest.prototype, "uid");
    return PasswordResetRequest;
}());
exports.PasswordResetRequest = PasswordResetRequest;
var UserUpdateRequest = /** @class */ (function () {
    function UserUpdateRequest() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'ValidUUIDv4', description: 'User ID' })
    ], UserUpdateRequest.prototype, "uid");
    __decorate([
        swagger_1.ApiPropertyOptional({ example: 'test_name', description: 'Name (optional)' })
    ], UserUpdateRequest.prototype, "name");
    __decorate([
        swagger_1.ApiPropertyOptional({
            example: 'test_password',
            description: 'Password (optional)'
        })
    ], UserUpdateRequest.prototype, "password");
    __decorate([
        swagger_1.ApiPropertyOptional({
            example: 'code',
            description: 'Password reset code (optional -- for password reset only)'
        })
    ], UserUpdateRequest.prototype, "code");
    return UserUpdateRequest;
}());
exports.UserUpdateRequest = UserUpdateRequest;
var UserMailRequest = /** @class */ (function () {
    function UserMailRequest() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'username', description: 'Username' })
    ], UserMailRequest.prototype, "username");
    __decorate([
        swagger_1.ApiProperty({ example: 'ValidUUIDv4', description: 'User ID' })
    ], UserMailRequest.prototype, "uid");
    __decorate([
        swagger_1.ApiPropertyOptional({
            example: 'example@email.com',
            description: 'Email (optional -- for send reset password only)'
        })
    ], UserMailRequest.prototype, "email");
    return UserMailRequest;
}());
exports.UserMailRequest = UserMailRequest;
var UserForgotPasswordRequest = /** @class */ (function () {
    function UserForgotPasswordRequest() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'example@email.com', description: 'Email' })
    ], UserForgotPasswordRequest.prototype, "email");
    return UserForgotPasswordRequest;
}());
exports.UserForgotPasswordRequest = UserForgotPasswordRequest;
var UserResponse = /** @class */ (function () {
    function UserResponse() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'test_username', description: 'Username' })
    ], UserResponse.prototype, "username");
    __decorate([
        swagger_1.ApiProperty({ example: 'test_name', description: 'Name' })
    ], UserResponse.prototype, "name");
    __decorate([
        swagger_1.ApiProperty({ example: 'ValidUUIDv4', description: 'User ID' })
    ], UserResponse.prototype, "uid");
    __decorate([
        swagger_1.ApiProperty({ example: 'example@mail.com', description: 'Email' })
    ], UserResponse.prototype, "email");
    return UserResponse;
}());
exports.UserResponse = UserResponse;
var UserForgotPasswordResponse = /** @class */ (function () {
    function UserForgotPasswordResponse() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'validJwtToken', description: 'Token' })
    ], UserForgotPasswordResponse.prototype, "token");
    __decorate([
        swagger_1.ApiProperty({ example: true, description: 'Is Email Sent' })
    ], UserForgotPasswordResponse.prototype, "isEmailSent");
    return UserForgotPasswordResponse;
}());
exports.UserForgotPasswordResponse = UserForgotPasswordResponse;
var RegisterResponse = /** @class */ (function () {
    function RegisterResponse() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'validJwtToken', description: 'Token' })
    ], RegisterResponse.prototype, "token");
    __decorate([
        swagger_1.ApiProperty({ example: true, description: 'Is Email Sent' })
    ], RegisterResponse.prototype, "isEmailSent");
    return RegisterResponse;
}());
exports.RegisterResponse = RegisterResponse;
var LoginResponse = /** @class */ (function () {
    function LoginResponse() {
    }
    __decorate([
        swagger_1.ApiProperty({ example: 'validJwtToken', description: 'Token' })
    ], LoginResponse.prototype, "token");
    __decorate([
        swagger_1.ApiProperty({ example: true, description: 'Is User Confirmed' })
    ], LoginResponse.prototype, "isConfirmed");
    return LoginResponse;
}());
exports.LoginResponse = LoginResponse;
var DecodedUser = /** @class */ (function () {
    function DecodedUser() {
    }
    return DecodedUser;
}());
exports.DecodedUser = DecodedUser;
