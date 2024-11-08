"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecodedUser = exports.LoginResponse = exports.UserResponse = exports.UserUpdateRequest = exports.LoginRequest = exports.RegisterRequest = void 0;
const swagger_1 = require("@nestjs/swagger");
class RegisterRequest {
}
exports.RegisterRequest = RegisterRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test_username', description: 'Username' }),
    __metadata("design:type", String)
], RegisterRequest.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test_name', description: 'Name' }),
    __metadata("design:type", String)
], RegisterRequest.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test_password', description: 'Password' }),
    __metadata("design:type", String)
], RegisterRequest.prototype, "password", void 0);
class LoginRequest {
}
exports.LoginRequest = LoginRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test_username', description: 'Username' }),
    __metadata("design:type", String)
], LoginRequest.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test_password', description: 'Password' }),
    __metadata("design:type", String)
], LoginRequest.prototype, "password", void 0);
class UserUpdateRequest {
}
exports.UserUpdateRequest = UserUpdateRequest;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'test_name', description: 'Name (optional)' }),
    __metadata("design:type", String)
], UserUpdateRequest.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'test_password',
        description: 'Password (optional)',
    }),
    __metadata("design:type", String)
], UserUpdateRequest.prototype, "password", void 0);
class UserResponse {
}
exports.UserResponse = UserResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test_username', description: 'Username' }),
    __metadata("design:type", String)
], UserResponse.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test_name', description: 'Name' }),
    __metadata("design:type", String)
], UserResponse.prototype, "name", void 0);
class LoginResponse {
}
exports.LoginResponse = LoginResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'validJwtToken', description: 'Token' }),
    __metadata("design:type", String)
], LoginResponse.prototype, "token", void 0);
class DecodedUser {
}
exports.DecodedUser = DecodedUser;
//# sourceMappingURL=auth.model.js.map