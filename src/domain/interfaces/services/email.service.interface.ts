export const EMAIL_SERVICE = 'EMAIL_SERVICE';

export interface IEmailService {
  sendVerificationCode(email: string, code: string): Promise<void>;
}
