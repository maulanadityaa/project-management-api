"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var auth_model_1 = require("../model/auth.model");
var auth_decorator_1 = require("../common/auth.decorator");
var swagger_1 = require("@nestjs/swagger");
var AuthController = /** @class */ (function () {
    function AuthController(authService) {
        this.authService = authService;
    }
    AuthController.prototype.checkUsername = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.checkUsername(request)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: common_1.HttpStatus.OK,
                                message: 'Username is available',
                                data: result
                            }];
                }
            });
        });
    };
    AuthController.prototype.register = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.register(request)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: common_1.HttpStatus.CREATED,
                                message: 'User registered',
                                data: result
                            }];
                }
            });
        });
    };
    AuthController.prototype.confirm = function (token, username, uid) {
        return __awaiter(this, void 0, Promise, function () {
            var request, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = {
                            token: token,
                            username: username,
                            uid: uid
                        };
                        return [4 /*yield*/, this.authService.confirmSignup(request)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: common_1.HttpStatus.OK,
                                message: 'User registration confirmed',
                                data: result
                            }];
                }
            });
        });
    };
    AuthController.prototype.sendConfirmationEmail = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.sendConfirmationLink(request.username, request.uid)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: common_1.HttpStatus.OK,
                                message: 'Confirmation email sent',
                                data: result
                            }];
                }
            });
        });
    };
    AuthController.prototype.login = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.login(request)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: common_1.HttpStatus.OK,
                                message: 'Login successful',
                                data: result
                            }];
                }
            });
        });
    };
    AuthController.prototype.me = function (token) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.get(token)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: common_1.HttpStatus.OK,
                                message: 'Current user information',
                                data: result
                            }];
                }
            });
        });
    };
    AuthController.prototype.update = function (token, request) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.update(token, request)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                statusCode: common_1.HttpStatus.OK,
                                message: 'User updated',
                                data: result
                            }];
                }
            });
        });
    };
    __decorate([
        common_1.Post('check-username'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({ summary: 'Check if username is available' }),
        swagger_1.ApiResponse({
            status: common_1.HttpStatus.OK,
            description: 'Username is available',
            type: Boolean
        }),
        swagger_1.ApiBody({ type: auth_model_1.CheckUsernameRequest }),
        __param(0, common_1.Body())
    ], AuthController.prototype, "checkUsername");
    __decorate([
        common_1.Post('register'),
        swagger_1.ApiOperation({ summary: 'Register a new user' }),
        swagger_1.ApiResponse({
            status: common_1.HttpStatus.CREATED,
            description: 'User registered',
            type: auth_model_1.UserResponse
        }),
        swagger_1.ApiBody({ type: auth_model_1.RegisterRequest }),
        __param(0, common_1.Body())
    ], AuthController.prototype, "register");
    __decorate([
        common_1.Get('confirm'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({ summary: 'Confirm user registration' }),
        swagger_1.ApiResponse({
            status: common_1.HttpStatus.OK,
            description: 'User registration confirmed',
            type: auth_model_1.UserResponse
        }),
        __param(0, common_1.Query('token')),
        __param(1, common_1.Query('username')),
        __param(2, common_1.Query('uid'))
    ], AuthController.prototype, "confirm");
    __decorate([
        common_1.Post('send-confirmation-email'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({ summary: 'Send confirmation email' }),
        swagger_1.ApiResponse({
            status: common_1.HttpStatus.OK,
            description: 'Confirmation email sent'
        }),
        __param(0, common_1.Body())
    ], AuthController.prototype, "sendConfirmationEmail");
    __decorate([
        common_1.Post('login'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({ summary: 'Login to the system' }),
        swagger_1.ApiResponse({
            status: common_1.HttpStatus.OK,
            description: 'Login successful',
            type: auth_model_1.LoginResponse
        }),
        swagger_1.ApiBody({ type: auth_model_1.LoginRequest }),
        __param(0, common_1.Body())
    ], AuthController.prototype, "login");
    __decorate([
        common_1.Get('me'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({
            summary: 'Get current user information',
            description: 'This endpoint requires a valid access token for authorization.'
        }),
        swagger_1.ApiResponse({
            status: common_1.HttpStatus.OK,
            description: 'Current user information',
            type: auth_model_1.UserResponse
        }),
        swagger_1.ApiBearerAuth(),
        __param(0, auth_decorator_1.Auth())
    ], AuthController.prototype, "me");
    __decorate([
        common_1.Put('update'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        swagger_1.ApiOperation({
            summary: 'Update user information',
            description: 'This endpoint requires a valid access token for authorization.'
        }),
        swagger_1.ApiResponse({
            status: common_1.HttpStatus.OK,
            description: 'User updated',
            type: auth_model_1.UserResponse
        }),
        swagger_1.ApiConsumes('application/json'),
        swagger_1.ApiBody({ type: auth_model_1.UserUpdateRequest }),
        swagger_1.ApiBearerAuth(),
        __param(0, auth_decorator_1.Auth()),
        __param(1, common_1.Body())
    ], AuthController.prototype, "update");
    AuthController = __decorate([
        common_1.Controller('/api/v1/auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
