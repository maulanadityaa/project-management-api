export declare class MailRequest {
    to: string;
    subject: string;
    text: string;
    html?: string;
}
export declare class SignupConfirmationRequest {
    to: string;
    token: string;
    username: string;
    link: string;
}
export declare class PasswordResetRequest {
    to: string;
    token: string;
    username: string;
    link: string;
}
export declare class MailResponse {
    success: boolean;
    message: string;
}
