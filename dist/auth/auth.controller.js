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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_model_1 = require("../model/auth.model");
const auth_decorator_1 = require("../common/auth.decorator");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async checkUsername(request) {
        const result = await this.authService.checkUsername(request);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Username is available',
            data: result,
        };
    }
    async register(request) {
        const result = await this.authService.register(request);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'User registered',
            data: result,
        };
    }
    async confirm(token, username, uid) {
        const request = {
            token,
            username,
            uid,
        };
        const result = await this.authService.confirmSignup(request);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'User registration confirmed',
            data: result,
        };
    }
    async sendConfirmationEmail(request) {
        const result = await this.authService.sendConfirmationLink(request.username, request.uid);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Confirmation email sent',
            data: result,
        };
    }
    async login(request) {
        const result = await this.authService.login(request);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Login successful',
            data: result,
        };
    }
    async me(token) {
        const result = await this.authService.get(token);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Current user information',
            data: result,
        };
    }
    async update(token, request) {
        const result = await this.authService.update(token, request);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'User updated',
            data: result,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('check-username'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Check if username is available' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Username is available',
        type: Boolean,
    }),
    (0, swagger_1.ApiBody)({ type: auth_model_1.CheckUsernameRequest }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_model_1.CheckUsernameRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkUsername", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'User registered',
        type: auth_model_1.UserResponse,
    }),
    (0, swagger_1.ApiBody)({ type: auth_model_1.RegisterRequest }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_model_1.RegisterRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('confirm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm user registration' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User registration confirmed',
        type: auth_model_1.UserResponse,
    }),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Query)('username')),
    __param(2, (0, common_1.Query)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)('send-confirmation-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Send confirmation email' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Confirmation email sent',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendConfirmationEmail", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Login to the system' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Login successful',
        type: auth_model_1.LoginResponse,
    }),
    (0, swagger_1.ApiBody)({ type: auth_model_1.LoginRequest }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_model_1.LoginRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current user information',
        description: 'This endpoint requires a valid access token for authorization.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Current user information',
        type: auth_model_1.UserResponse,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, auth_decorator_1.Auth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Put)('update'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user information',
        description: 'This endpoint requires a valid access token for authorization.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User updated',
        type: auth_model_1.UserResponse,
    }),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBody)({ type: auth_model_1.UserUpdateRequest }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, auth_decorator_1.Auth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_model_1.UserUpdateRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "update", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('/api/v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map