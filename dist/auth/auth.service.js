"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const validation_service_1 = require("../common/validation.service");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const prisma_service_1 = require("../common/prisma.service");
const auth_validation_1 = require("./auth.validation");
const bcrypt = __importStar(require("bcrypt"));
const jwt_service_1 = require("../jwt/jwt.service");
let AuthService = class AuthService {
    constructor(validationService, logger, prismaService, jwtService) {
        this.validationService = validationService;
        this.logger = logger;
        this.prismaService = prismaService;
        this.jwtService = jwtService;
    }
    async register(request) {
        this.logger.debug(`Registering user ${JSON.stringify(request)}`);
        const registerRequest = this.validationService.validate(auth_validation_1.AuthValidation.REGISTER, request);
        registerRequest.username = registerRequest.username.toLowerCase();
        const existingUser = await this.prismaService.user.count({
            where: {
                username: registerRequest.username,
            },
        });
        if (existingUser !== 0) {
            throw new common_1.HttpException('Username already registered', 400);
        }
        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
        const user = await this.prismaService.user.create({
            data: registerRequest,
        });
        return {
            username: user.username,
            name: user.name,
        };
    }
    async login(request) {
        this.logger.debug(`Logging in user ${JSON.stringify(request)}`);
        const loginRequest = this.validationService.validate(auth_validation_1.AuthValidation.LOGIN, request);
        loginRequest.username = loginRequest.username.toLowerCase();
        const user = await this.prismaService.user.findUnique({
            where: {
                username: loginRequest.username,
            },
        });
        if (!user) {
            throw new common_1.HttpException('Invalid username or password', 400);
        }
        const passwordMatch = await bcrypt.compare(loginRequest.password, user.password);
        if (!passwordMatch) {
            throw new common_1.HttpException('Invalid username or password', 400);
        }
        const token = await this.jwtService.generateToken(user);
        return {
            token: token,
        };
    }
    async update(token, request) {
        this.logger.debug(`Updating user ${JSON.stringify(request)}`);
        const updateRequest = this.validationService.validate(auth_validation_1.AuthValidation.UPDATE, request);
        const decodedUser = await this.jwtService.verifyToken(token);
        console.log(decodedUser);
        const user = await this.prismaService.user.findUnique({
            where: {
                username: decodedUser.username,
            },
        });
        if (!user) {
            throw new common_1.HttpException('User not found', 400);
        }
        if (updateRequest.password) {
            updateRequest.password = await bcrypt.hash(updateRequest.password, 10);
        }
        const updatedUser = await this.prismaService.user.update({
            where: {
                username: decodedUser.username,
            },
            data: updateRequest,
        });
        return {
            username: updatedUser.username,
            name: updatedUser.name,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [validation_service_1.ValidationService,
        winston_1.Logger,
        prisma_service_1.PrismaService,
        jwt_service_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map