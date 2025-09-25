import { ObjectId } from 'mongoose';
import emailLogsModel from './email-logs.model';
import { TCreateEmailLogDTO } from './email-logs.dto';

export const createEmailLog = async (body: TCreateEmailLogDTO) => {
  try {
    const emailLog = await emailLogsModel.create(body);
    return emailLog;
  } catch (err) {
    return err;
  }
};

export const getEmailLogsByTemplateId = async (
  templateId: string | ObjectId
) => {
  try {
    const emailLogs = await emailLogsModel.find({ templateId: templateId });
    const openedEmails = emailLogs.filter(
      (emailLog) => emailLog.open_count > 0
    );
    const unopenedEmails = emailLogs.filter(
      (emailLog) => emailLog.open_count === 0
    );
    const bouncedEmails = emailLogs.filter(
      (emailLog) => emailLog.bounce === true
    );
    const receivedEmails = emailLogs.length - bouncedEmails.length;

    return {
      totalEmails: emailLogs.length,
      openedEmails: openedEmails.length,
      unopenedEmails: unopenedEmails.length,
      bouncedEmails: bouncedEmails.length,
      receivedEmails: receivedEmails,
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
