import { ObjectId } from 'mongoose';
import * as ContactRepository from './contact.repository';
import { logActivity } from '../activity-log/activity-log.service';
import {
  ActionType,
  ActivityStatus,
  ResourceType,
} from '../activity-log/activity-log.utils';
import { logger } from '../../classes/Logger';

import UserRepository from '../user/user.repository';
import { CREDITS_PER_ACTION } from '../../consts/rate';


export const createContact = async (
  contact: any,
  userId: string | ObjectId
) => {
  try {
    // 1. Calculate required credits (assuming 1 contact per action)
    const requiredCredits = CREDITS_PER_ACTION;

    // 2. Fetch user and check credits
    const user = await UserRepository.findUserById(userId as string);
    if (!user) throw new Error('User not found');
    if (user.credits < requiredCredits) {
      throw new Error(
        `Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits}`
      );
    }

    // 3. Deduct credits
    const updatedUser = await UserRepository.decrementCredits(userId as string, requiredCredits);
    if (!updatedUser) throw new Error('Failed to update user credits');

    // 4. Create contact
    const newContact = await ContactRepository.createContact(contact, userId);

    await logActivity({
      user: userId as ObjectId,
      actionType: ActionType.CREATE,
      resourceType: ResourceType.CONTACT,
      resourceId: newContact._id as ObjectId,
      status: ActivityStatus.SUCCESS,
    });

    logger.info('Contact created', { userId, contactId: newContact._id });

    return newContact;
  } catch (err: any) {
    logger.error(`Failed to create contact: ${err.message}`, {
      origin: 'services/contact',
    });

    await logActivity({
      user: userId as ObjectId,
      actionType: ActionType.CREATE,
      resourceType: ResourceType.CONTACT,
      status: ActivityStatus.FAILURE,
    });

    return err;
  }
};

export const getAllContacts = async (
  userId: string | ObjectId,
  segmentId: string | ObjectId
) => {
  try {
    const contacts = await ContactRepository.findAllContacts(userId, segmentId);

    logger.info('Fetched all contacts', { userId, segmentId });

    return contacts;
  } catch (err: any) {
    logger.error(`${err.message}`, { origin: 'services/contact' });
    return err;
  }
};

export const getContactById = async (id: string | ObjectId) => {
  try {
    const contact = await ContactRepository.findContactById(id);

    logger.info('Fetched contact', { contactId: contact?._id });

    return contact;
  } catch (err: any) {
    logger.error(`Failed to get contact with id-${id}: ${err.message}`, {
      origin: 'services/contact',
    });
    throw new Error(err);
  }
};

export const updateContact = async (
  id: string,
  contact: any,
  userId: string | ObjectId
) => {
  try {
    const updatedContact = await ContactRepository.updateContact(id, contact);

    await logActivity({
      user: userId as ObjectId,
      actionType: ActionType.UPDATE,
      resourceType: ResourceType.CONTACT,
      status: ActivityStatus.SUCCESS,
    });

    logger.info('Updated contact', { userId, contactId: contact._id });

    return updatedContact;
  } catch (err: any) {
    logger.error(`Failed to update contact with id-${id}: ${err.message}`, {
      origin: 'services/contact',
    });

    await logActivity({
      user: userId as ObjectId,
      actionType: ActionType.UPDATE,
      resourceType: ResourceType.CONTACT,
      status: ActivityStatus.FAILURE,
    });

    throw new Error(err);
  }
};

export const deleteContact = async (id: string, userId: string | ObjectId) => {
  try {
    const contact = await ContactRepository.deleteContact(id);

    await logActivity({
      user: userId as ObjectId,
      actionType: ActionType.DELETE,
      resourceType: ResourceType.CONTACT,
      status: ActivityStatus.SUCCESS,
    });

    logger.info('Deleted contact', { userId, contactId: contact._id });

    return contact;
  } catch (err: any) {
    logger.error(`Failed to delete contact with id-${id}: ${err.message}`, {
      origin: 'services/contact',
    });

    await logActivity({
      user: userId as ObjectId,
      actionType: ActionType.DELETE,
      resourceType: ResourceType.CONTACT,
      status: ActivityStatus.FAILURE,
    });

    throw new Error(err);
  }
};
