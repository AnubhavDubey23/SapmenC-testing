import { CronJob } from 'cron';
import * as EmailJobRepository from './email-job.repository';
import { EEmailJobStatus } from '../../data/EMAIL_JOBS_DATA';
import { TMarketingMailDTO } from '../mail/mail.dto';
import * as MailService from '../mail/mail.service';

// 10 seconds

const CRON_TIME = '*/5 * * * * *';

const handleEmailJobCron = async () => {
  try {
    const emailJobs: any = await EmailJobRepository.findAllEmailJobs({
      status: EEmailJobStatus.PENDING,
    });

    if (emailJobs.length === 0) {
      console.log('No email jobs found');
    } else {
      for (const emailJob of emailJobs) {
        const payload: TMarketingMailDTO = {
          templateId: emailJob.templateId,
          segmentIds: emailJob.segmentId,
          userId: emailJob.userId,
        };
        await MailService.sendMarketingMailInQueue(payload, []);
      }
    }
  } catch (err: any) {
    console.error(err);
  }
};
const cronJob = new CronJob(CRON_TIME, handleEmailJobCron);

cronJob.start();
