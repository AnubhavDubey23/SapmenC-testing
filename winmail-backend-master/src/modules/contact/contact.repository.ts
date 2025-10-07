import { Document, ObjectId } from 'mongoose';
// import SegmentRepository from '../segment/segment.repository';
import contactModel, { IContact } from './contact.model';
import userModel from '../user/user.model';

// export const createContact = async (
//   body: any,
//   userId: string | ObjectId
// ): Promise<IContact> => {
//   try {
//     const newContact: Document<unknown, {}, IContact> &
//       IContact &
//       Required<{
//         _id: unknown;
//       }> = await contactModel.create({
//       ...body,
//       created_by: userId,
//     });

//     if (!newContact) {
//       throw new Error('Contact not created');
//     }

//     const segment = await SegmentRepository.findSegmentById(
//       body.assigned_segment
//     );

//     if (!segment) {
//       throw new Error('Segment not found');
//     }

//     segment.recipients.push(newContact._id);

//     await segment.save();

//     const user = await userModel.findById(userId);
//     if (!user) {
//       throw new Error('User not found');
//     }
//     user.total_imported_contacts_count += 1;
//     await user.save();

//     return newContact;
//   } catch (err) {
//     console.log(err);
//     if (err instanceof Error) {
//       throw err;
//     }
//     throw new Error('Failed to create contact');
//   }
// };

export const createContact = async (
  body: any,
  userId: string | ObjectId
): Promise<IContact> => {
  try {
    // Create the contact document
    const newContact: Document<unknown, {}, IContact> &
      IContact &
      Required<{ _id: unknown }> = await contactModel.create({
      ...body,
      created_by: userId,
    });

    // Add contact to segment's recipients array
    if (body.assigned_segment) {
      const SegmentModel = require('../segment/segment.model').default;
      await SegmentModel.findByIdAndUpdate(
        body.assigned_segment,
        { 
          $addToSet: { recipients: newContact._id },
          $set: { updated_by: userId }
        }
      );
    }

    // increment user stats (kept as-is)
    const user = await userModel.findById(userId);
    if (!user) throw new Error('User not found');
    user.total_imported_contacts_count += 1;
    await user.save();

    return newContact;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) throw err;
    throw new Error('Failed to create contact');
  }
};


export const findAllContacts = async (
  userId: string | ObjectId,
  segmentId: string | ObjectId
) => {
  try {
    const contacts = await contactModel.find({
      created_by: userId,
      assigned_segment: segmentId,
    });
    return contacts;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to find contacts');
  }
};

export const findContactById = async (id: string | ObjectId) => {
  try {
    const contact = await contactModel
      .findById(id)
      .populate('createdBy')
      .populate('updatedBy');
    return contact;
  } catch (err: any) {
    console.log(err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to find contact');
  }
};

export const updateContact = async (
  id: string,
  contact: any
): Promise<IContact> => {
  try {
    const updatedContact = await contactModel.findByIdAndUpdate(id, contact, {
      new: true,
    });

    return updatedContact as IContact;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to update contact');
  }
};

export const deleteContact = async (id: string): Promise<IContact> => {
  try {
    // Get contact info before deletion
    const contact = await contactModel.findById(id);
    if (!contact) {
      throw new Error('Contact not found');
    }

    // Remove contact from segment's recipients array
    if (contact.assigned_segment) {
      const SegmentModel = require('../segment/segment.model').default;
      await SegmentModel.findByIdAndUpdate(
        contact.assigned_segment,
        { 
          $pull: { recipients: contact._id }
        }
      );
    }

    // Delete the contact
    const deletedContact = await contactModel.findByIdAndDelete(id);
    return deletedContact as IContact;
  } catch (err: any) {
    console.log(err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to delete contact');
  }
};

// export const findByEmail = async (email: string, userId: string | ObjectId) => {
//   try {
//     const contact = await contactModel.findOne({
//       email: email,
//       created_by: userId,
//     });
//     return contact as IContact;
//   } catch (err) {
//     console.log(err);
//     if (err instanceof Error) {
//       throw err;
//     }
//     throw new Error('Failed to find contact by email');
//   }
// };

export const findByEmailInsegment = async (
  email: string,
  segmentId: string | ObjectId
) => {
  try {
    const contact = await contactModel.findOne({ email, assigned_segment: segmentId });
    return contact as IContact | null;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) throw err;
    throw new Error('Failed to find contact by email in segment');
  }
};


export const bulkUpsertByEmailsInsegment = async (
  recipients: { email: string; name?: string }[],
  segmentId: string | ObjectId,
  userId: string | ObjectId
): Promise<{ ids: ObjectId[]; stats: { total: number; uniqueValid: number; invalid: number } }> => {
  const total = recipients.length;

  if (total === 0) {
    return { ids: [], stats: { total, uniqueValid: 0, invalid: 0 } };
  }

  // Validate emails and filter out invalid ones
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validRecipients = recipients.filter(r => r.email && isValidEmail(r.email));
  const invalid = total - validRecipients.length;

  // Build operations with valid recipients only
  const ops = validRecipients.map(({ email, name }) => ({
    updateOne: {
      filter: { email, assigned_segment: segmentId },
      update: {
        $set: {
          name,
        },
        $setOnInsert: {
          email: email.toLowerCase().trim(),
          assigned_segment: segmentId,
          created_by: userId,
        },
      },
      upsert: true,
    },
  }));

  // Perform bulk write
  await contactModel.bulkWrite(ops, { ordered: false });

  // Fetch back _ids
  const docs = await contactModel.find(
    { assigned_segment: segmentId, email: { $in: validRecipients.map(r => r.email.toLowerCase().trim()) } },
    { _id: 1 }
  ).lean();

  return {
    ids: docs.map(d => d._id as ObjectId),
    stats: { total, uniqueValid: validRecipients.length, invalid },
  };
};
