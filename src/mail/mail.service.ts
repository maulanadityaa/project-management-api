import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from 'src/common/validation.service';
import { MailResponse, SignupConfirmationRequest } from 'src/model/mail.model';
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
        subject: mailRequest.subject,
        template: 'signup-email-confirmation',
        context: {
          name: mailRequest.username,
          confirmationLink: mailRequest.link,
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
}
