import { MailerService } from '@nestjs-modules/mailer';
import { ValidationService } from 'src/common/validation.service';
import { MailResponse, PasswordResetRequest, SignupConfirmationRequest } from 'src/model/mail.model';
import { Logger } from 'winston';
import { PrismaService } from 'src/common/prisma.service';
export declare class MailService {
    private readonly mailerService;
    private readonly validationService;
    private prismaService;
    private readonly logger;
    constructor(mailerService: MailerService, validationService: ValidationService, prismaService: PrismaService, logger: Logger);
    sendSignupConfirmation(request: SignupConfirmationRequest): Promise<MailResponse>;
    resendAccountConfirmation(request: SignupConfirmationRequest): Promise<MailResponse>;
    sendPasswordReset(request: PasswordResetRequest): Promise<MailResponse>;
}
