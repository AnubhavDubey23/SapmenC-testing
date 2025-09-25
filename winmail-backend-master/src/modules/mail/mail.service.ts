import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { TMarketingMailDTO } from './mail.dto';
import TemplateRepository from '../template/template.repository';
import SegmentRepository from '../segment/segment.repository';
import { sendBatchEmails } from './bulk-mail-sender';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { TNodeMailerConfig } from './mail-transporters/dynamic-transporter';
import { handleCreateSystemNotificationsTransporter } from './mail-transporters/notification-mail-transporter';
import userModel from '../user/user.model';
import { TAttachments } from '../../types/attachments.types';
import Mail from 'nodemailer/lib/mailer';
import { CREDITS_PER_ACTION } from '../../consts/rate';
import { EMAIL_USER } from '../../consts/defaults';
import { logActivity } from '../activity-log/activity-log.service';
import {
  ActionType,
  ActivityStatus,
  ResourceType,
} from '../activity-log/activity-log.utils';
import { ObjectId } from 'mongoose';
import { logger } from '../../classes/Logger';

dotenv.config();

export const sendWelcomeMail = async (email: string, name: string) => {
  try {
    const templatePath = path.join(
      __dirname,
      '../../email-templates/welcome-mail.html'
    );
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders with actual values
    htmlContent = htmlContent.replace('{{name}}', name);

    const mailOptions: Mail.Options = {
      from: {
        name: 'MailerOne',
        address: EMAIL_USER,
      },
      to: email,
      subject: 'Account Created',
      html: htmlContent,
    };

    try {
      const transporter = handleCreateSystemNotificationsTransporter();
      await transporter.sendMail(mailOptions);

      logger.info('Email sent successfully');
    } catch (error: any) {
      logger.error(`'Error sending email', ${error.message}`, {
        origin: 'services/mail',
      });
    }
  } catch (error: any) {
    logger.error(`'Error sending email', ${error.message}`, {
      origin: 'services/mail',
    });
  }
};

export const sendForgotPasswordMail = async (email: string, otp: string) => {
  try {
    const templatePath = path.join(
      __dirname,
      '../../email-templates/forgot-password.html'
    );
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders with actual values
    htmlContent = htmlContent.replace('{{otp}}', otp);

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: htmlContent,
    };

    try {
      const transporter = handleCreateSystemNotificationsTransporter();
      await transporter.sendMail(mailOptions);

      logger.info('Email sent successfully');

    } catch (error: any) {
      logger.error(`'Error sending email', ${error.message}`, {
        origin: 'services/mail',
      });
    }
  } catch (error: any) {
    logger.error(`${error.message}`, { origin: 'services/mail' });
  }
};

export const sendMarketingMail = async (
  { templateId, segmentIds, userId }: TMarketingMailDTO,
  attachments: TAttachments
) => {
  try {
    // Get email template from the database
    const template = await TemplateRepository.findTemplateById(
      templateId,
      userId
    );

    if (!template) {
      throw new Error('Template not found');
    }

    if (template.is_triggered) {
      throw new Error('TEMPLATE_ALREADY_TRIGGERED');
    }
    const { email_data, subject } = template;

    if (segmentIds.length === 0) {
      throw new Error('No segments found');
    }

    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const config = user.nodemailer_config as TNodeMailerConfig;
    if (!config.display_name) {
      throw new Error('DISPLAY_NAME_NOT_FOUND');
    }

    // Calculate total recipients
    const segmentIdsArray = segmentIds.includes(',')
      ? segmentIds.split(',')
      : [segmentIds];
    let totalRecipients = 0;
    const segmentsWithRecipients = [];

    // First pass: count recipients and validate segments
    for (const segmentId of segmentIdsArray) {
      const segment = await SegmentRepository.findSegmentById(segmentId);
      if (!segment) throw new Error(`Segment not found: ${segmentId}`);
      if (!segment.recipients?.length)
        throw new Error(`No recipients found in segment: ${segmentId}`);

      totalRecipients += segment.recipients.length;
      segmentsWithRecipients.push({ segmentId, recipients: segment.recipients });
    }

    const requiredCredits = totalRecipients * CREDITS_PER_ACTION;

    // Validate if user has enough credits
    if (user.credits < requiredCredits) {
      throw new Error(
        `Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits}`
      );
    }

    // Deduct credits before sending emails
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $inc: { credits: -requiredCredits } },
      { new: true }
    );

    if (!updatedUser) throw new Error('Failed to update user credits');

    // Send batch mails for all segments present

    for (const { segmentId, recipients } of segmentsWithRecipients) {
      await sendBatchEmails(
        userId as string,
        segmentId,
        templateId as string,
        recipients,
        email_data,
        subject ?? 'New Subject',
        attachments
      );
    }

    const segmentIdsWithRecipients = Array.from(
      new Set(segmentsWithRecipients.map((segment) => segment.segmentId))
    );

    await TemplateRepository.updateTemplate(
      templateId as string,
      { segments_used: segmentIdsWithRecipients },
      userId
    );

    await logActivity({
      user: userId as ObjectId,
      actionType: ActionType.TRIGGER,
      resourceType: ResourceType.TEMPLATE,
      resourceId: templateId as ObjectId,
      status: ActivityStatus.SUCCESS,
    });

    logger.info('Marketing email sent successfully');
  } catch (error: any) {
    logger.error(`err.${error.message}`, { origin: 'services/mail' });

    await logActivity({
      user: userId as ObjectId,
      actionType: ActionType.TRIGGER,
      resourceType: ResourceType.TEMPLATE,
      resourceId: templateId as ObjectId,
      status: ActivityStatus.FAILURE,
    });

    throw new Error(error.message);
  }
};

export const sendMarketingMailInQueue = async (
  { templateId, segmentIds, userId }: TMarketingMailDTO,
  attachments: TAttachments
) => {
  try {
    // Get email template from the database
    const template = await TemplateRepository.findTemplateById(
      templateId,
      userId
    );

    if (!template) {
      throw new Error('Template not found');
    }

    // check if template is already triggered
    if (template.is_triggered) {
      throw new Error('TEMPLATE_ALREADY_TRIGGERED');
    }

    // check if segmentIds is empty
    if (segmentIds.length === 0) {
      throw new Error('No segments found');
    }

    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const config = user.nodemailer_config as TNodeMailerConfig;
    if (!config.display_name) {
      throw new Error('DISPLAY_NAME_NOT_FOUND');
    }

    let segmentIdsArray: string[] = [];
    if (segmentIds.indexOf(',') === -1) {
      segmentIdsArray.push(segmentIds);
    } else {
      segmentIdsArray = segmentIds.split(',');
    }

    for (const segmentId of segmentIdsArray) {
      const segment = await SegmentRepository.findSegmentById(segmentId);
      if (!segment) {
        throw new Error('Segment not found');
      }

      const { recipients } = segment;

      if (recipients.length > 0) {
        await sendBatchEmails(
          userId as string,
          segmentId,
          templateId as string,
          recipients,
          template.email_data,
          template.subject!,
          attachments
        );
      }
    }
  } catch (error: any) {
    logger.error(`Failed to send marketing mails in queue: ${error.message}`, {
      origin: 'services/mail',
    });
    throw new Error(error.message);
  }
};

export const sendEmailVerificationMail = async (email: string, otp: string) => {
  try {
    const templatePath = path.join(
      __dirname,
      '../../email-templates/email-verification.html'
    );
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders with actual values
    htmlContent = htmlContent.replace('{{otp}}', otp);

    const mailOptions = {
      from: {
        name: 'Mailer One',
        address: EMAIL_USER,
      },
      to: email,
      subject: 'Verify Email',
      html: htmlContent,
    };

    try {
      const transporter = handleCreateSystemNotificationsTransporter();
      const emailRes: SMTPTransport.SentMessageInfo =
        await transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        email_response: emailRes.response,
      });
    } catch (error: any) {
      logger.error(
        `'Error sending email-verification email', ${error.message}`,
        { origin: 'services/mail' }
      );
    }
  } catch (error: any) {
    logger.error(`'Error sending email', ${error.message}`, {
      origin: 'services/mail',
    });
  }
};
