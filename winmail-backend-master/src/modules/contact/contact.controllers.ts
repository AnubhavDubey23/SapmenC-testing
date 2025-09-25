import { Response } from 'express';
import * as ContactService from './contact.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const createContact = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const contact = await ContactService.createContact(req.body, req.user.id);

    if (!contact) {
      throw new Error('Contact not created');
    }

    res.status(201).json({
      status: true,
      message: 'Contact created successfully!',
      data: contact,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getAllContacts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id: userId } = req.user;
    const contacts = await ContactService.getAllContacts(
      userId,
      req.params.segmentId
    );
    res.status(200).json({
      status: true,
      message: 'All contacts fetched successfully!',
      data: contacts,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getContactById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const contact = await ContactService.getContactById(req.params.id);
    res.status(200).json({
      status: true,
      message: 'Contact fetched successfully!',
      data: contact,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateContact = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const contact = await ContactService.updateContact(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(200).json({
      status: true,
      message: 'Contact updated successfully!',
      data: contact,
    });
  } catch (err: any) {
    res.status(400).json({
      status: false,
      message: err.message,
      data: null,
    });
  }
};

export const deleteContact = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const contact = await ContactService.deleteContact(
      req.params.id,
      req.user.id
    );
    res.status(200).json({
      status: true,
      message: 'Contact deleted successfully!',
      data: contact,
    });
  } catch (err: any) {
    res.status(400).json({
      status: false,
      message: err.message,
      data: null,
    });
  }
};
