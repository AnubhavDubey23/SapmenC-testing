import { TContact } from './contact.types';

export type Tsegment = {
  _id: string;
  createdAt: any;
  updatedAt: any;
  name: string;
  description: string;
  recipients: TContact[];
  created_by: any;
  updated_by: any;
  is_active: boolean;
};
