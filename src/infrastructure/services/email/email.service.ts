import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailService } from '@domain/interfaces/services/email.service.interface';

@Injectable()
export class EmailServiceImpl implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const emailHost = this.configService.get<string>('EMAIL_HOST');
    const emailPort = this.configService.get<number>('EMAIL_PORT');
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASS');

    if (emailHost && emailPort && emailUser && emailPass) {
      this.transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: false,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    if (!this.transporter) {
      console.warn('Email service não configurado. Código de verificação:', code);
      return;
    }

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM') || 'noreply@cartola.com',
      to: email,
      subject: 'Código de Verificação - Cartola Championship',
      html: `
        <h2>Código de Verificação</h2>
        <p>Seu código de verificação é: <strong>${code}</strong></p>
        <p>Este código expira em 15 minutos.</p>
        <p>Se você não solicitou este código, ignore este email.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
