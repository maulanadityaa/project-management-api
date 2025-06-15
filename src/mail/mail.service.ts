import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from 'src/common/validation.service';
import {
  MailResponse,
  PasswordResetRequest,
  SignupConfirmationRequest,
} from 'src/model/mail.model';
import { Logger } from 'winston';
import { MailValidation } from './mail.validation';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendSignupConfirmation(
    request: SignupConfirmationRequest,
  ): Promise<MailResponse> {
    this.logger.debug(`Sending signup confirmation email to ${request.to}`);

    try {
      const mailRequest: SignupConfirmationRequest =
        this.validationService.validate(
          MailValidation.SIGNUP_CONFIRMATION,
          request,
        );

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

      this.logger.info(
        `Signup confirmation email sent successfully to ${mailRequest.to}`,
      );

      return {
        success: true,
        message: `Signup confirmation email sent to ${mailRequest.to}`,
      };
    } catch (error) {
      this.logger.error(
        `Error sending signup confirmation email: ${error.message}`,
        error,
      );
      await this.prismaService.emailCode.deleteMany({
        where: { user: { email: request.to } },
      });
      await this.prismaService.user.delete({
        where: { email: request.to },
      });
      throw new HttpException('Failed to send signup confirmation email', 500);
    }
  }

  async resendAccountConfirmation(
    request: SignupConfirmationRequest,
  ): Promise<MailResponse> {
    this.logger.debug(`Resending account confirmation email to ${request.to}`);

    try {
      const mailRequest: SignupConfirmationRequest =
        this.validationService.validate(
          MailValidation.SIGNUP_CONFIRMATION,
          request,
        );

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

      this.logger.info(
        `Account confirmation email resent successfully to ${mailRequest.to}`,
      );

      return {
        success: true,
        message: `Account confirmation email resent to ${mailRequest.to}`,
      };
    } catch (error) {
      this.logger.error(
        `Error resending account confirmation email: ${error.message}`,
        error,
      );
      await this.prismaService.emailCode.deleteMany({
        where: { user: { email: request.to } },
      });
      throw new HttpException(
        'Failed to resend account confirmation email',
        500,
      );
    }
  }

  async sendPasswordReset(
    request: PasswordResetRequest,
  ): Promise<MailResponse> {
    this.logger.debug(`Sending password reset email to ${request.to}`);

    try {
      const mailRequest: PasswordResetRequest = this.validationService.validate(
        MailValidation.PASSWORD_RESET,
        request,
      );

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

      this.logger.info(
        `Password reset email sent successfully to ${mailRequest.to}`,
      );

      return {
        success: true,
        message: `Password reset email sent to ${mailRequest.to}`,
      };
    } catch (error) {
      this.logger.error(
        `Error sending password reset email: ${error.message}`,
        error,
      );
      await this.prismaService.emailCode.deleteMany({
        where: { user: { email: request.to } },
      });
      throw new HttpException('Failed to send password reset email', 500);
    }
  }
}
