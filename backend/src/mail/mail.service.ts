import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'musicschool.ukma@gmail.com',
        pass: 'rjyc qldh grmw mllr',
      },
    });
  }

  async sendGradeNotification(to: string, subjectName: string, gradeValue: number) {
    try {
      await this.transporter.sendMail({
        from: '"Music School" <musicschool.ukma@gmail.com>',
        to,
        subject: `New grade in ${subjectName}`,
        text: `You have received a new grade in ${subjectName}: ${gradeValue}`,
        html: `<p>You have received a new grade in <b>${subjectName}</b>: <b>${gradeValue}</b>.</p>`,
      });

      this.logger.log(`Email sent to ${to} about new grade in ${subjectName}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
    }
  }
}
