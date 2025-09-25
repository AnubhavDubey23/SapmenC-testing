import emailLogsModel from '../email-logs/email-logs.model';
import {
  renderToStaticMarkup,
  TReaderDocument,
} from '@usewaypoint/email-builder';
import { TNodeMailerConfig } from './mail-transporters/dynamic-transporter';
import userModel from '../user/user.model';

export type TEmailsList = {
  email: string;
  name: string;
}[];

export const sendSingleEmail = async (
  userId: string,
  segmentId: string,
  templateId: string,
  emailList: TEmailsList,
  emailTemplate: any,
  subject: string
) => {
  const pixel_id = Math.random().toString();
  const trackingPixelUrl = `https://api.mailerone.in/api/v1/mails/tracking-pixel?recipient_email=${encodeURIComponent(emailList[0].email)}&template_id=${templateId}&segment_id=${segmentId}&pixel_id=${pixel_id}`;
  const email_log = await emailLogsModel.create({
    pixel_id: pixel_id,
    templateId: templateId,
    segmentId: segmentId,
    open_count: 0,
    recipient_email: emailList[0].email,
    recipient_name: emailList[0].name,
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
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
};
