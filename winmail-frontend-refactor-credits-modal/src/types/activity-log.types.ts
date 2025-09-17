export type TActivityLog = {
  user: string;
  actionType: string;
  resourceType: string;
  resourceId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TAccountHistoryData = {
  date: Date;
  time: Date;
  activityType: string;
  actionType: string;
  resourceType: string;
  resourceId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export const ActionType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  VIEW: 'VIEW',
  TRIGGER: 'TRIGGER',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE',
} as const;

export const ResourceType = {
  USER: 'USER',
  TEMPLATE: 'TEMPLATE',
  SEGMENT: 'SEGMENT',
  CONTACT: 'CONTACT',
  TRANSACTION: 'TRANSACTION',
} as const;

export const ActivityStatus = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  PENDING: 'PENDING',
} as const;
