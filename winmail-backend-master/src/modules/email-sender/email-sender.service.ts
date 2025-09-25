import { TMarketingMailDTO } from '../mail/mail.dto';
import * as EmailJobRepository from '../email-job/email-job.repository';
import { logger } from '../../classes/Logger';


interface IEmailSenderService {
  sendEmail(payload: TMarketingMailDTO):Promise<any>;
}

class EmailSenderService implements IEmailSenderService {
  private static instance: EmailSenderService;

  static getInstance(): EmailSenderService {
    if (!EmailSenderService.instance) {
      EmailSenderService.instance = new EmailSenderService();
      Object.freeze(EmailSenderService.instance);
    }
    return EmailSenderService.instance;
  }
  async sendEmail(payload: TMarketingMailDTO): Promise<any> {
    try {
      // save this email job in the database
      const emailJob = await EmailJobRepository.createEmailJob({
        templateId: payload.templateId as string,
        segmentId: payload.segmentIds as string,
        userId: payload.userId as string,
      });

      if (emailJob) {
        return emailJob;
      } else {
        throw new Error('Error in creating email job');
      }
    } catch (err: any) {
      logger.error(`Failed to send email: ${err.message}`, {
        origin: 'services/email-sender',
      });
      throw new Error(err.message);
    }
  };
}

export default EmailSenderService.getInstance();

