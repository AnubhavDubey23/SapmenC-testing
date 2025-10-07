// import { ObjectId } from 'mongoose';
import { ObjectId, Types } from 'mongoose';

import * as ContactRepository from '../contact/contact.repository';

import { UpdateSegmentDTO } from './segment.dto';
import SegmentModel, { ISegment } from './segment.model';

import UserRepository from '../user/user.repository';
import { CREDITS_PER_ACTION } from '../../consts/rate';

interface ISegmentRepository {
  createSegment(segment: any, userId: string | ObjectId): Promise<ISegment>;
  findAllSegments(userId: string | ObjectId): Promise<ISegment[]>;
}

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

class SegmentRepository implements ISegmentRepository {
  private static instance: SegmentRepository;

  public static getInstance() {
    if (!SegmentRepository.instance) {
      SegmentRepository.instance = new SegmentRepository();
      Object.freeze(SegmentRepository.instance);
    }

    return SegmentRepository.instance;
  }

  public async createSegment(
    segment: any,
    userId: string | ObjectId
  ): Promise<ISegment> {
    try {
      const newSegment = await SegmentModel.create({
        ...segment,
        created_by: userId,
      });

      return newSegment;
    } catch (err) {
      throw err;
    }
  }

  public async findAllSegments(userId: string | ObjectId): Promise<ISegment[]> {
    try {
      return await SegmentModel.find({
        created_by: userId,
      })
        .populate('recipients')
        .sort({ createdAt: -1 });
    } catch (err) {
      throw err;
    }
  }

  public async findSegmentById(
    id: string | ObjectId
  ): Promise<ISegment | null> {
    try {
      const segment = await SegmentModel.findById(id)
        .populate('recipients')
        .populate('created_by', 'name email')
        .populate('updated_by', 'name email');

      return segment;
    } catch (err) {
      throw err;
    }
  }

  // public async updateSegment(
  //   id: string,
  //   body: UpdateSegmentDTO,
  //   userId: string | ObjectId
  // ): Promise<ISegment | null> {
  //   try {
  //     if (body.recipients) {
  //       // Handle the case when recipients array is empty
  //       if (body.recipients.length === 0) {
  //         const segment = await SegmentModel.findByIdAndUpdate(
  //           id,
  //           {
  //             ...body,
  //             updated_by: userId,
  //           },
  //           { new: true }
  //         );

  //         return segment;
  //       }

  //       // Handle recipients separately in a more optimized way
  //       const { recipients } = body;

  //       const segment = await SegmentModel.findById(id);

  //       if (segment) {
  //         const prevRecipients = segment.recipients;

  //         // Process and add new recipients
  //         console.log('Recipients to add:', recipients);
  //         console.log('Previous Recipients:', prevRecipients);
  //         for (const recipient of recipients) {
  //           // Check if the recipient already exists in the contacts collection
  //           let contact = await ContactRepository.findByEmail(recipient.email,userId);

  //           if (!contact) {
  //             // If contact doesn't exist, create a new one
  //             let body = {
  //               ...recipient,
  //               created_by: userId,
  //               assigned_segment: id,
  //             };
  //             contact = await ContactRepository.createContact(body, userId);
  //           }

  //           // Ensure the contact is unique within the segment
  //           if (!prevRecipients.includes(contact.email)) {
  //             prevRecipients.push(contact.email);
  //           }

  //           // if (!prevRecipients.some(id => id.equals(contact._id))) {
  //           //   prevRecipients.push(contact._id);
  //           // }

  //         }

  //         segment.recipients = prevRecipients;
  //         segment.updated_by = userId;

  //         await segment.save();
  //         await segment.populate('recipients');
  //         return segment;
  //       }
  //     }

  //     // If recipients are not being updated or handled separately, update the
  //     // segment normally
  //     const segment = await SegmentModel.findByIdAndUpdate(
  //       id,
  //       {
  //         ...body,
  //         updated_by: userId,
  //       },
  //       { new: true }
  //     ).populate('recipients');

  //     return segment;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  public async updateSegment(
    id: string,
    body: UpdateSegmentDTO,
    userId: string | ObjectId
  ): Promise<ISegment | null> {
    try {
      // If recipients provided, handle as a bulk upsert + single $addToSet
      if (body.recipients) {
        const user = await UserRepository.findUserById(userId as string);
        if (!user) throw new Error('User not found');
        if (user.credits < CREDITS_PER_ACTION) {
          throw new Error(
            `Insufficient credits. Minimum required: ${CREDITS_PER_ACTION}, Available: ${user.credits}`
          );
        }
        if (body.recipients.length === 0) {
          const seg = await SegmentModel.findByIdAndUpdate(
            id,
            { ...body, updated_by: userId },
            { new: true }
          ).populate('recipients');
          return seg;
        }

        const requiredCredits = body.recipients.length * CREDITS_PER_ACTION;
        if (user.credits < requiredCredits) {
          throw new Error(
            `Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits}`
          );
        }

        // Deduct credits
        const updatedUser = await UserRepository.decrementCredits(userId as string, requiredCredits);
        if (!updatedUser) throw new Error('Failed to update user credits');

        const setFields: any = {
          updated_by: userId,
          ...(body.name ? { name: body.name } : {}),
          ...(body.description ? { description: body.description } : {}),
          ...(typeof body.is_active === 'boolean' ? { is_active: body.is_active } : {}),
        };

        const segmentId: string | ObjectId = id;

        const { ids, stats } = await ContactRepository.bulkUpsertByEmailsInsegment(
          body.recipients,
          segmentId,
          userId
        );

        // Log the import statistics
        if (stats.invalid > 0) {
          console.warn(`${stats.invalid} invalid contacts were skipped during import`);
        }

        await SegmentModel.updateOne(
          { _id: segmentId },
          { 
            $addToSet: { recipients: { $each: ids } },  // <-- prevents duplicates
            $set: setFields
          }
        );

        const updated = await SegmentModel.findById(segmentId).populate('recipients');

        return updated;
      }

      const segment = await SegmentModel.findByIdAndUpdate(
        id,
        { ...body, updated_by: userId },
        { new: true }
      ).populate('recipients');

      return segment;
    } catch (err) {
      throw err;
    }
  }


  public async deleteSegment(id: string): Promise<ISegment | null> {
    try {
      return await SegmentModel.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }
}

export default SegmentRepository.getInstance();
