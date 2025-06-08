export class MailRequest {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class SignupConfirmationRequest {
  to: string;
  token: string;
  username: string;
  link: string;
  subject?: string;
  text?: string;
  html?: string;
}

export class MailResponse {
  success: boolean;
  message: string;
}
