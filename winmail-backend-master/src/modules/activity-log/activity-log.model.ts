import mongoose, { Document, Schema } from 'mongoose';
import { ActionType, ActivityStatus, ResourceType } from './activity-log.utils';

export interface IActivityLog extends Document {
  user: Schema.Types.ObjectId;
  actionType: string;
  resourceType: string;
  resourceId: Schema.Types.ObjectId;
  status: string;
}

const ActivityLogSchema: Schema<IActivityLog> = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actionType: {
      type: String,
      required: true,
      enum: Object.values(ActionType),
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: Object.values(ResourceType),
    },

    resourceId: {
      type: Schema.Types.ObjectId,
      required: false,
    },

    status: {
      type: String,
      required: true,
      enum: Object.values(ActivityStatus),
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.model<IActivityLog>(
  'ActivityLog',
  ActivityLogSchema
);

export default ActivityLog;
