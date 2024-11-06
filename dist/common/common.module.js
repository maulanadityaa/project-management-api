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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston = __importStar(require("winston"));
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("./prisma.service");
const validation_service_1 = require("./validation.service");
const error_filter_1 = require("./error.filter");
const core_1 = require("@nestjs/core");
const auth_middleware_1 = require("./auth.middleware");
const jwt_module_1 = require("../jwt/jwt.module");
const cloudinary_service_1 = require("./cloudinary.service");
const cloudinary_provider_1 = require("./cloudinary.provider");
let CommonModule = class CommonModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes({
            path: '/api/v1/users/update',
            method: common_1.RequestMethod.PUT,
        }, {
            path: '/api/v1/technologies',
            method: common_1.RequestMethod.POST,
        }, {
            path: '/api/v1/technologies',
            method: common_1.RequestMethod.PUT,
        }, {
            path: '/api/v1/technologies/*',
            method: common_1.RequestMethod.DELETE,
        }, {
            path: '/api/v1/projects',
            method: common_1.RequestMethod.POST,
        }, {
            path: '/api/v1/projects',
            method: common_1.RequestMethod.PUT,
        });
    }
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            nest_winston_1.WinstonModule.forRoot({
                level: 'debug',
                format: winston.format.json(),
                transports: [new winston.transports.Console()],
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            jwt_module_1.JwtAuthModule,
        ],
        providers: [prisma_service_1.PrismaService, validation_service_1.ValidationService, cloudinary_provider_1.CloudinaryProvider, cloudinary_service_1.CloudinaryService, {
                provide: core_1.APP_FILTER,
                useClass: error_filter_1.ErrorFilter,
            }],
        exports: [prisma_service_1.PrismaService, validation_service_1.ValidationService, cloudinary_provider_1.CloudinaryProvider, cloudinary_service_1.CloudinaryService],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map