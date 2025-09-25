import Mail from 'nodemailer/lib/mailer';
import emailLogsModel from '../email-logs/email-logs.model';
import {
  renderToStaticMarkup,
  TReaderDocument,
} from '@usewaypoint/email-builder';
import TemplateService from '../template/template.service';
import {
  handleCreateDynamicTransporter,
  TNodeMailerConfig,
} from './mail-transporters/dynamic-transporter';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EPlanIds } from '../../data/PLANS_DATA';
import { handleCreateFreePlanTransporter } from './mail-transporters/free-plan-transporter';
import userModel from '../user/user.model';
import { TAttachments } from '../../types/attachments.types';
import { BACKEND_BASE_URL } from '../../consts/defaults';

export type TEmailsList = {
  email: string;
  name: string;
}[];

export const sendBatchEmails = async (
  userId: string,
  segmentId: string,
  templateId: string,
  emailList: TEmailsList,
  emailTemplate: any,
  subject: string,
  attachments?: TAttachments,
  batchSize: number = 25
) => {
  for (let i = 0; i < emailList.length; i += batchSize) {
    const batch = emailList.slice(i, i + batchSize);
    const emailPromises = batch.map(async ({ email, name }) => {
      const pixel_id = Math.random().toString();
      const trackingPixelUrl = `${BACKEND_BASE_URL}/mails/tracking-pixel?recipient_email=${encodeURIComponent(email)}&template_id=${templateId}&segment_id=${segmentId}&pixel_id=${pixel_id}`;
      const email_log = await emailLogsModel.create({
        pixel_id: pixel_id,
        templateId: templateId,
        segmentId: segmentId,
        open_count: 0,
        recipient_email: email,
        recipient_name: name,
        tracking_pixel_url: trackingPixelUrl,
      });
      const htmlBody = renderToStaticMarkup(emailTemplate as TReaderDocument, {
        rootBlockId: 'root',
      });
      const htmlContent = htmlBody.replace(
        '</body>',
        `<img src="${trackingPixelUrl}" alt="tracking-pixel" style="display: none;" /></body>`
      );
      try {
        const user = await userModel.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        const config = user.nodemailer_config as TNodeMailerConfig;
        let mailOptions: Mail.Options = {
          from: {
            name: config.display_name,
            address:
              user.subscription?.plan === EPlanIds.FREE
                ? 'user@mailerone.in'
                : config.auth.user,
          },
          to: email,
          subject: subject,
          html: htmlContent,
          headers: {
            References: `<${email_log._id}>`,
          },
          attachments: [],
        };

        if (config.reply_to) {
          mailOptions = { ...mailOptions, replyTo: config.reply_to };
        }

        if (attachments) {
          if (Array.isArray(attachments)) {
            for (const attachment of attachments) {
              mailOptions.attachments?.push({
                filename: attachment.originalname,
                content: attachment.buffer,
              });
            }
          }
        }

        let transporter = null;
        if (user.subscription.plan === EPlanIds.FREE) {
          transporter = handleCreateFreePlanTransporter();
        } else {
          transporter = handleCreateDynamicTransporter(config);
        }
        const info: SMTPTransport.SentMessageInfo =
          await transporter.sendMail(mailOptions);
        if (info.accepted.length > 0) {
          await emailLogsModel.findByIdAndUpdate(email_log._id, {
            bounce: false,
          });
        }
        if (info.rejected.length > 0) {
          await emailLogsModel.findByIdAndUpdate(email_log._id, {
            bounce: true,
          });
        }
      } catch (error) {
        await emailLogsModel.findByIdAndUpdate(email_log._id, {
          bounce: true,
        });
        console.error(`Error sending to ${email}: `, error);
      }
    });

    // Wait for the current batch to complete before proceeding to the next one
    await Promise.all(emailPromises);
    await TemplateService.updateTemplate(
      templateId,
      {
        is_triggered: true,
      },
      userId as string
    );
  }
};
