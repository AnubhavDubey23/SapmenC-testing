import { Request, Response } from 'express';
import * as MailService from './mail.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { TMarketingMailDTO } from './mail.dto';
import emailLogsModel from '../email-logs/email-logs.model';
import EmailSenderService from '../email-sender/email-sender.service';

export const sendMarketingMail = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const formData = req.body;

    const attachments = req.files;
    const payload: TMarketingMailDTO = JSON.parse(formData.jsonData);
    payload.userId = req.user.id;

    const mail = await MailService.sendMarketingMail(payload, attachments);
    res.status(201).json({
      status: true,
      message: 'Mail sent successfully',
      data: mail,
    });
  } catch (err: any) {
    switch (err.message) {
      case 'DISPLAY_NAME_NOT_FOUND':
        res.status(400).json({
          status: false,
          message: 'Display name not found',
        });
        break;
      case 'No segments found':
        res.status(400).json({
          status: false,
          message: 'No segments found',
        });
        break;
      case 'Segment not found':
        res.status(404).json({
          status: false,
          message: 'Segment not found',
        });
        break;
      case 'No recipients found':
        res.status(404).json({
          status: false,
          message: 'No recipients found',
        });
        break;
      case 'TEMPLATE_ALREADY_TRIGGERED':
        res.status(400).json({
          status: false,
          message: 'Template already triggered',
        });
        break;
      default:
        res.status(400).json(err);
    }
  }
};

export const trackOpenStatus = async (req: Request, res: Response) => {
  try {
    const { pixel_id, recipient_email, template_id, segment_id } = req.query;

    // find email log by pixel_id and update
    const email_log = await emailLogsModel.findOneAndUpdate(
      {
        pixel_id: pixel_id,
        recipient_email: recipient_email,
        templateId: template_id,
        segmentId: segment_id,
      },
      {
        $inc: { open_count: 1 },
      }
    );

    // Respond with a transparent 1x1 pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64'
    );
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
    });
    res.end(pixel);

    if (!email_log) {
      logger.warn(`No email log found for pixel_id: ${pixel_id}, recipient: ${recipient_email}`);
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

export const sendMailsInQueue = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const payload: TMarketingMailDTO = req.body;
    payload.userId = req.user.id;
    const emailJob = await EmailSenderService.sendEmail(payload);
    res.status(201).json({
      status: true,
      message: 'Email job created successfully',
      data: emailJob,
    });
  } catch (err: any) {
    res.status(500).json({
      status: false,
      message: err.message,
      data: null,
    });
  }
};
