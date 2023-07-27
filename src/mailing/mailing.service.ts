import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { SendMailDto } from './dto/sendMail.dto';

@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  public async sendMail(sendMailDto: SendMailDto) {
    await this.setTransport();
    this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: sendMailDto.to, // list of receivers
        from: this.configService.get('GMAIL_EMAIL'), // sender address
        subject: 'Ed Tech Verification Code', // Subject line
        template: 'action',
        context: {
          // Data to be sent to template engine..
          code: sendMailDto.code,
        },
      })
      .then((success) => {
        console.log(success);
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('GMAIL_CLIENT_ID'),
      this.configService.get('GMAIL_CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log(err);
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('GMAIL_EMAIL'),
        clientId: this.configService.get('GMAIL_CLIENT_ID'),
        clientSecret: this.configService.get('GMAIL_CLIENT_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }
}
// wrtbdkumldviszif
