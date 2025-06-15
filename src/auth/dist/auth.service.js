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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var nest_winston_1 = require("nest-winston");
var auth_validation_1 = require("./auth.validation");
var bcrypt = require("bcrypt");
var AuthService = /** @class */ (function () {
    function AuthService(validationService, logger, prismaService, jwtService, mailService) {
        this.validationService = validationService;
        this.logger = logger;
        this.prismaService = prismaService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    AuthService.prototype.checkUsername = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var checkRequest, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Checking if username " + request.username + " is available");
                        checkRequest = this.validationService.validate(auth_validation_1.AuthValidation.USERNAME_CHECK, request);
                        return [4 /*yield*/, this.prismaService.user.findUnique({
                                where: {
                                    username: checkRequest.username.toLowerCase()
                                }
                            })];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            throw new common_1.HttpException('Username already exists', 400);
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    AuthService.prototype.generateCode = function (length) {
        if (length === void 0) { length = 8; }
        return __awaiter(this, void 0, Promise, function () {
            var chars, result, i;
            return __generator(this, function (_a) {
                chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                result = '';
                for (i = 0; i < length; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return [2 /*return*/, result];
            });
        });
    };
    AuthService.prototype.register = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var registerRequest, existingEmail, _a, createdUser, appUrl, mailResponse, token;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.debug("Registering user " + JSON.stringify(request));
                        registerRequest = this.validationService.validate(auth_validation_1.AuthValidation.REGISTER, request);
                        registerRequest.username = registerRequest.username.toLowerCase();
                        return [4 /*yield*/, this.prismaService.user.findUnique({
                                where: { email: registerRequest.email }
                            })];
                    case 1:
                        existingEmail = _b.sent();
                        if (existingEmail) {
                            throw new common_1.HttpException('Email already exists', 400);
                        }
                        return [4 /*yield*/, this.checkUsername({ username: registerRequest.username })];
                    case 2:
                        _b.sent();
                        _a = registerRequest;
                        return [4 /*yield*/, bcrypt.hash(registerRequest.password, 10)];
                    case 3:
                        _a.password = _b.sent();
                        return [4 /*yield*/, this.prismaService.$transaction(function (prisma) { return __awaiter(_this, void 0, void 0, function () {
                                var user, emailCode, _a, _b, _c, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0: return [4 /*yield*/, prisma.user.create({
                                                data: registerRequest
                                            })];
                                        case 1:
                                            user = _e.sent();
                                            _b = (_a = prisma.emailCode).create;
                                            _c = {};
                                            _d = {};
                                            return [4 /*yield*/, this.generateCode()];
                                        case 2: return [4 /*yield*/, _b.apply(_a, [(_c.data = (_d.code = _e.sent(),
                                                    _d.expired_at = new Date(Date.now() + 5 * 60 * 1000),
                                                    _d.user = {
                                                        connect: { id: user.id }
                                                    },
                                                    _d),
                                                    _c)])];
                                        case 3:
                                            emailCode = _e.sent();
                                            return [2 /*return*/, { user: user, emailCode: emailCode }];
                                    }
                                });
                            }); })];
                    case 4:
                        createdUser = _b.sent();
                        if (!createdUser) {
                            throw new common_1.HttpException('Failed to create user', 500);
                        }
                        appUrl = process.env.APP_LOCAL_URL;
                        if (process.env.NODE_ENV === 'production') {
                            appUrl = process.env.APP_PROD_URL;
                        }
                        return [4 /*yield*/, this.mailService.sendSignupConfirmation({
                                to: registerRequest.email,
                                token: createdUser.emailCode.code,
                                username: createdUser.user.username,
                                link: appUrl + "/api/v1/auth/confirm?username=" + createdUser.user.username + "&uid=" + createdUser.user.id + "&token=" + createdUser.emailCode.code
                            })];
                    case 5:
                        mailResponse = _b.sent();
                        return [4 /*yield*/, this.jwtService.generateToken(createdUser.user)];
                    case 6:
                        token = _b.sent();
                        return [2 /*return*/, {
                                token: token,
                                isEmailSent: mailResponse.success
                            }];
                }
            });
        });
    };
    AuthService.prototype.resendAccountConfirmation = function (request, token) {
        return __awaiter(this, void 0, Promise, function () {
            var mailRequest, userData, user, emailCode, _a, _b, _c, _d, appUrl, mailResponse;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this.logger.debug("Resending account confirmation email for user " + JSON.stringify(request));
                        mailRequest = this.validationService.validate(auth_validation_1.AuthValidation.USER_MAIL, request);
                        return [4 /*yield*/, this.jwtService.verifyToken(token)];
                    case 1:
                        userData = _e.sent();
                        console.log("Token verified for user " + mailRequest.username + " with UID " + mailRequest.uid);
                        if (userData.username.toLowerCase() !== mailRequest.username.toLowerCase()) {
                            throw new common_1.HttpException('Invalid token for this user', 400);
                        }
                        return [4 /*yield*/, this.prismaService.user.findFirst({
                                where: {
                                    AND: [
                                        { username: mailRequest.username.toLowerCase() },
                                        { id: mailRequest.uid },
                                    ]
                                }
                            })];
                    case 2:
                        user = _e.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 400);
                        }
                        _b = (_a = this.prismaService.emailCode).create;
                        _c = {};
                        _d = {};
                        return [4 /*yield*/, this.generateCode()];
                    case 3: return [4 /*yield*/, _b.apply(_a, [(_c.data = (_d.code = _e.sent(),
                                _d.expired_at = new Date(Date.now() + 5 * 60 * 1000),
                                _d.user = {
                                    connect: { id: user.id }
                                },
                                _d),
                                _c)])];
                    case 4:
                        emailCode = _e.sent();
                        appUrl = process.env.APP_LOCAL_URL;
                        if (process.env.NODE_ENV === 'production') {
                            appUrl = process.env.APP_PROD_URL;
                        }
                        return [4 /*yield*/, this.mailService.resendAccountConfirmation({
                                to: user.email,
                                token: emailCode.code,
                                username: user.username,
                                link: appUrl + "/api/v1/auth/confirm?username=" + user.username + "&uid=" + user.id + "&token=" + emailCode.code
                            })];
                    case 5:
                        mailResponse = _e.sent();
                        return [2 /*return*/, {
                                success: mailResponse.success,
                                message: mailResponse.message
                            }];
                }
            });
        });
    };
    AuthService.prototype.confirmSignup = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var confirmationRequest, user, emailCode, confirmedUser, token;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Confirming signup for user " + JSON.stringify(request));
                        confirmationRequest = this.validationService.validate(auth_validation_1.AuthValidation.TOKEN_CONFIRMATION, request);
                        return [4 /*yield*/, this.prismaService.user.findUnique({
                                where: {
                                    username: confirmationRequest.username.toLowerCase(),
                                    id: confirmationRequest.uid
                                }
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 400);
                        }
                        return [4 /*yield*/, this.prismaService.emailCode.findFirst({
                                where: {
                                    code: confirmationRequest.code,
                                    user_id: user.id,
                                    is_used: false
                                }
                            })];
                    case 2:
                        emailCode = _a.sent();
                        if (!emailCode) {
                            throw new common_1.HttpException('Token is invalid', 400);
                        }
                        if (emailCode.is_used) {
                            throw new common_1.HttpException('Token already used', 400);
                        }
                        if (emailCode.expired_at < new Date()) {
                            throw new common_1.HttpException('Token expired', 400);
                        }
                        return [4 /*yield*/, this.prismaService.$transaction(function (prisma) { return __awaiter(_this, void 0, void 0, function () {
                                var userToConfirm;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, prisma.user.update({
                                                where: { id: user.id },
                                                data: { is_confirmed: true }
                                            })];
                                        case 1:
                                            userToConfirm = _a.sent();
                                            return [4 /*yield*/, this.prismaService.emailCode.update({
                                                    where: { id: emailCode.id },
                                                    data: { is_used: true }
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/, userToConfirm];
                                    }
                                });
                            }); })];
                    case 3:
                        confirmedUser = _a.sent();
                        if (!confirmedUser) {
                            throw new common_1.HttpException('Failed to confirm user', 500);
                        }
                        return [4 /*yield*/, this.jwtService.generateToken(confirmedUser)];
                    case 4:
                        token = _a.sent();
                        return [2 /*return*/, {
                                token: token
                            }];
                }
            });
        });
    };
    AuthService.prototype.login = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var loginRequest, user, passwordMatch, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Logging in user " + JSON.stringify(request));
                        loginRequest = this.validationService.validate(auth_validation_1.AuthValidation.LOGIN, request);
                        loginRequest.username = loginRequest.username.toLowerCase();
                        return [4 /*yield*/, this.prismaService.user.findUnique({
                                where: {
                                    username: loginRequest.username
                                }
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException('Invalid username or password', 401);
                        }
                        return [4 /*yield*/, bcrypt.compare(loginRequest.password, user.password)];
                    case 2:
                        passwordMatch = _a.sent();
                        if (!passwordMatch) {
                            throw new common_1.HttpException('Invalid username or password', 401);
                        }
                        return [4 /*yield*/, this.jwtService.generateToken(user)];
                    case 3:
                        token = _a.sent();
                        if (!user.is_confirmed) {
                            return [2 /*return*/, {
                                    token: token,
                                    isConfirmed: user.is_confirmed
                                }];
                        }
                        return [2 /*return*/, {
                                token: token
                            }];
                }
            });
        });
    };
    AuthService.prototype.get = function (token) {
        return __awaiter(this, void 0, Promise, function () {
            var decodedUser, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Getting user info from token");
                        return [4 /*yield*/, this.jwtService.verifyToken(token)];
                    case 1:
                        decodedUser = _a.sent();
                        return [4 /*yield*/, this.prismaService.user.findUnique({
                                where: {
                                    username: decodedUser.username
                                }
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 400);
                        }
                        return [2 /*return*/, {
                                uid: user.id,
                                email: user.email,
                                username: user.username,
                                name: user.name
                            }];
                }
            });
        });
    };
    AuthService.prototype.update = function (token, request) {
        return __awaiter(this, void 0, Promise, function () {
            var updateRequest, decodedUser, user, checkMailCode, _a, updatedUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.logger.debug("Updating user " + JSON.stringify(request));
                        updateRequest = this.validationService.validate(auth_validation_1.AuthValidation.UPDATE, request);
                        return [4 /*yield*/, this.jwtService.verifyToken(token)];
                    case 1:
                        decodedUser = _b.sent();
                        if (updateRequest.uid !== decodedUser.userId) {
                            throw new common_1.HttpException('Invalid user ID in token or request', 400);
                        }
                        return [4 /*yield*/, this.prismaService.user.findUnique({
                                where: {
                                    id: decodedUser.uid,
                                    username: decodedUser.username
                                }
                            })];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 400);
                        }
                        if (!updateRequest.password) return [3 /*break*/, 5];
                        console.log("Updating password for user " + decodedUser.username + " with UID " + user.id + " and code " + updateRequest.code);
                        if (updateRequest.code === undefined) {
                            throw new common_1.HttpException('Code is required for password reset', 400);
                        }
                        return [4 /*yield*/, this.prismaService.emailCode.findMany({
                                where: {
                                    user_id: user.id,
                                    code: updateRequest.code,
                                    is_used: true
                                }
                            })];
                    case 3:
                        checkMailCode = _b.sent();
                        if (!checkMailCode) {
                            throw new common_1.HttpException('Invalid token for password reset', 400);
                        }
                        _a = updateRequest;
                        return [4 /*yield*/, bcrypt.hash(updateRequest.password, 10)];
                    case 4:
                        _a.password = _b.sent();
                        _b.label = 5;
                    case 5: return [4 /*yield*/, this.prismaService.user.update({
                            where: {
                                username: decodedUser.username,
                                id: decodedUser.userId
                            },
                            data: {
                                name: updateRequest.name,
                                password: updateRequest.password
                            }
                        })];
                    case 6:
                        updatedUser = _b.sent();
                        return [2 /*return*/, {
                                uid: updatedUser.id,
                                email: updatedUser.email,
                                username: updatedUser.username,
                                name: updatedUser.name
                            }];
                }
            });
        });
    };
    AuthService.prototype.sendPasswordReset = function (request, token) {
        return __awaiter(this, void 0, Promise, function () {
            var mailRequest, user, emailCode, _a, _b, _c, _d, appUrl, mailResponse;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this.logger.debug("Sending password reset link for user " + request.username + " with UID " + request.uid);
                        mailRequest = this.validationService.validate(auth_validation_1.AuthValidation.USER_MAIL, request);
                        return [4 /*yield*/, this.jwtService.verifyToken(token)];
                    case 1:
                        _e.sent();
                        console.log("Token verified for user " + mailRequest.username + " with UID " + mailRequest.uid);
                        if (mailRequest.username.toLowerCase() !== mailRequest.username.toLowerCase()) {
                            throw new common_1.HttpException('Invalid token for this user', 400);
                        }
                        return [4 /*yield*/, this.prismaService.user.findFirst({
                                where: {
                                    AND: [
                                        { username: mailRequest.username.toLowerCase() },
                                        { id: mailRequest.uid },
                                        {
                                            email: mailRequest.email
                                                ? mailRequest.email.toLowerCase()
                                                : undefined
                                        },
                                    ]
                                }
                            })];
                    case 2:
                        user = _e.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 400);
                        }
                        _b = (_a = this.prismaService.emailCode).create;
                        _c = {};
                        _d = {};
                        return [4 /*yield*/, this.generateCode()];
                    case 3: return [4 /*yield*/, _b.apply(_a, [(_c.data = (_d.code = _e.sent(),
                                _d.expired_at = new Date(Date.now() + 5 * 60 * 1000),
                                _d.user = {
                                    connect: { id: user.id }
                                },
                                _d),
                                _c)])];
                    case 4:
                        emailCode = _e.sent();
                        appUrl = process.env.APP_LOCAL_URL;
                        if (process.env.NODE_ENV === 'production') {
                            appUrl = process.env.APP_PROD_URL;
                        }
                        return [4 /*yield*/, this.mailService.sendPasswordReset({
                                to: user.email,
                                token: emailCode.code,
                                username: user.username,
                                link: appUrl + "/api/v1/auth/reset-password?username=" + user.username + "&uid=" + user.id + "&token=" + emailCode.code
                            })];
                    case 5:
                        mailResponse = _e.sent();
                        return [2 /*return*/, {
                                success: mailResponse.success,
                                message: mailResponse.message
                            }];
                }
            });
        });
    };
    AuthService.prototype.confirmResetPassword = function (request, token) {
        return __awaiter(this, void 0, Promise, function () {
            var resetRequest, user, emailCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Confirming password reset for user " + JSON.stringify(request));
                        resetRequest = this.validationService.validate(auth_validation_1.AuthValidation.TOKEN_CONFIRMATION, request);
                        return [4 /*yield*/, this.jwtService.verifyToken(token)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.prismaService.user.findUnique({
                                where: {
                                    username: resetRequest.username.toLowerCase(),
                                    id: resetRequest.uid
                                }
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 400);
                        }
                        return [4 /*yield*/, this.prismaService.emailCode.findFirst({
                                where: {
                                    code: resetRequest.code,
                                    user_id: user.id,
                                    is_used: false
                                }
                            })];
                    case 3:
                        emailCode = _a.sent();
                        if (!emailCode) {
                            throw new common_1.HttpException('Token is invalid', 400);
                        }
                        if (emailCode.is_used) {
                            throw new common_1.HttpException('Token already used', 400);
                        }
                        if (emailCode.expired_at < new Date()) {
                            throw new common_1.HttpException('Token expired', 400);
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    AuthService.prototype.sendEmailForgotPassword = function (request) {
        return __awaiter(this, void 0, Promise, function () {
            var mailRequest, user, emailCode, _a, _b, _c, _d, appUrl, mailResponse, token;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        this.logger.debug("Sending email for password reset for user " + JSON.stringify(request));
                        mailRequest = this.validationService.validate(auth_validation_1.AuthValidation.FORGOT_PASSWORD, request);
                        return [4 /*yield*/, this.prismaService.user.findFirst({
                                where: {
                                    email: mailRequest.email.toLowerCase()
                                }
                            })];
                    case 1:
                        user = _e.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 400);
                        }
                        _b = (_a = this.prismaService.emailCode).create;
                        _c = {};
                        _d = {};
                        return [4 /*yield*/, this.generateCode()];
                    case 2: return [4 /*yield*/, _b.apply(_a, [(_c.data = (_d.code = _e.sent(),
                                _d.expired_at = new Date(Date.now() + 5 * 60 * 1000),
                                _d.user = {
                                    connect: { id: user.id }
                                },
                                _d),
                                _c)])];
                    case 3:
                        emailCode = _e.sent();
                        appUrl = process.env.APP_LOCAL_URL;
                        if (process.env.NODE_ENV === 'production') {
                            appUrl = process.env.APP_PROD_URL;
                        }
                        return [4 /*yield*/, this.mailService.sendPasswordReset({
                                to: user.email,
                                token: emailCode.code,
                                username: user.username,
                                link: appUrl + "/api/v1/auth/reset-password?username=" + user.username + "&uid=" + user.id + "&token=" + emailCode.code
                            })];
                    case 4:
                        mailResponse = _e.sent();
                        return [4 /*yield*/, this.jwtService.generateToken(user)];
                    case 5:
                        token = _e.sent();
                        return [2 /*return*/, {
                                token: token,
                                isEmailSent: mailResponse.success
                            }];
                }
            });
        });
    };
    AuthService.prototype.refreshJwtToken = function (token) {
        return __awaiter(this, void 0, Promise, function () {
            var decodedUser, user, newToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("Refreshing JWT token");
                        return [4 /*yield*/, this.jwtService.verifyTokenWithoutExpiration(token)];
                    case 1:
                        decodedUser = _a.sent();
                        return [4 /*yield*/, this.prismaService.user.findUnique({
                                where: {
                                    id: decodedUser.userId,
                                    username: decodedUser.username
                                }
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.HttpException('User not found', 400);
                        }
                        return [4 /*yield*/, this.jwtService.refreshToken(token, user)];
                    case 3:
                        newToken = _a.sent();
                        return [2 /*return*/, {
                                token: newToken,
                                isConfirmed: user.is_confirmed
                            }];
                }
            });
        });
    };
    AuthService = __decorate([
        common_1.Injectable(),
        __param(1, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
