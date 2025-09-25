import { ObjectId } from 'mongoose';

export type UpdateSegmentDTO = {
  name?: string;
  description?: string;
  recipients?: {
    email: string;
    name: string;
  }[];
  updated_by?: string | ObjectId;
  is_active?: boolean;
};
