import { Document, ObjectId } from 'mongoose';
import emailJobModel from './email-job.model';
import { CreateEmailJobDTO } from './email-job.dto';
import { EEmailJobStatus } from '../../data/EMAIL_JOBS_DATA';

export const createEmailJob = async (payload: CreateEmailJobDTO) => {
  try {
    const newEmailJob = await emailJobModel.create({
      ...payload,
      status: EEmailJobStatus.PENDING,
    });
    return newEmailJob;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const findAllEmailJobs = async (filter: {
  status?: EEmailJobStatus;
}) => {
  try {
    const emailJobs: (Document<unknown, {}, CreateEmailJobDTO> &
      CreateEmailJobDTO &
      Required<{
        _id: unknown;
      }>)[] = await emailJobModel.find(filter).sort({ createdAt: -1 });
    return emailJobs;
  } catch (err) {
    console.log(err);
    return err;
  }
};
