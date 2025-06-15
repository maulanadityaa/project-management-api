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
exports.MailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const validation_service_1 = require("../common/validation.service");
const winston_1 = require("winston");
const mail_validation_1 = require("./mail.validation");
const prisma_service_1 = require("../common/prisma.service");
let MailService = class MailService {
    constructor(mailerService, validationService, prismaService, logger) {
        this.mailerService = mailerService;
        this.validationService = validationService;
        this.prismaService = prismaService;
        this.logger = logger;
    }
    async sendSignupConfirmation(request) {
        this.logger.debug(`Sending signup confirmation email to ${request.to}`);
        try {
            const mailRequest = this.validationService.validate(mail_validation_1.MailValidation.SIGNUP_CONFIRMATION, request);
            await this.mailerService.sendMail({
                to: mailRequest.to,
                subject: 'Please confirm your email address',
                template: 'signup-email-confirmation',
                context: {
                    name: mailRequest.username,
                    token: mailRequest.token,
                    year: new Date().getFullYear(),
                },
            });
            this.logger.info(`Signup confirmation email sent successfully to ${mailRequest.to}`);
            return {
                success: true,
                message: `Signup confirmation email sent to ${mailRequest.to}`,
            };
        }
        catch (error) {
            this.logger.error(`Error sending signup confirmation email: ${error.message}`, error);
            await this.prismaService.emailCode.deleteMany({
                where: { user: { email: request.to } },
            });
            await this.prismaService.user.delete({
                where: { email: request.to },
            });
            throw new common_1.HttpException('Failed to send signup confirmation email', 500);
        }
    }
    async resendAccountConfirmation(request) {
        this.logger.debug(`Resending account confirmation email to ${request.to}`);
        try {
            const mailRequest = this.validationService.validate(mail_validation_1.MailValidation.SIGNUP_CONFIRMATION, request);
            await this.mailerService.sendMail({
                to: mailRequest.to,
                subject: 'Please confirm your email address',
                template: 'resend-account-confirmation',
                context: {
                    name: mailRequest.username,
                    token: mailRequest.token,
                    year: new Date().getFullYear(),
                },
            });
            this.logger.info(`Account confirmation email resent successfully to ${mailRequest.to}`);
            return {
                success: true,
                message: `Account confirmation email resent to ${mailRequest.to}`,
            };
        }
        catch (error) {
            this.logger.error(`Error resending account confirmation email: ${error.message}`, error);
            await this.prismaService.emailCode.deleteMany({
                where: { user: { email: request.to } },
            });
            throw new common_1.HttpException('Failed to resend account confirmation email', 500);
        }
    }
    async sendPasswordReset(request) {
        this.logger.debug(`Sending password reset email to ${request.to}`);
        try {
            const mailRequest = this.validationService.validate(mail_validation_1.MailValidation.PASSWORD_RESET, request);
            await this.mailerService.sendMail({
                to: mailRequest.to,
                subject: 'Password Reset Request',
                template: 'password-reset',
                context: {
                    name: mailRequest.username,
                    token: mailRequest.token,
                    year: new Date().getFullYear(),
                },
            });
            this.logger.info(`Password reset email sent successfully to ${mailRequest.to}`);
            return {
                success: true,
                message: `Password reset email sent to ${mailRequest.to}`,
            };
        }
        catch (error) {
            this.logger.error(`Error sending password reset email: ${error.message}`, error);
            await this.prismaService.emailCode.deleteMany({
                where: { user: { email: request.to } },
            });
            throw new common_1.HttpException('Failed to send password reset email', 500);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        validation_service_1.ValidationService,
        prisma_service_1.PrismaService,
        winston_1.Logger])
], MailService);
//# sourceMappingURL=mail.service.js.map