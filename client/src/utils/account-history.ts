import {
  ActionType,
  ResourceType,
  TAccountHistoryData,
  TActivityLog,
} from '@/types/activity-log.types';

function _transformActivityType(action: string, resource: string) {
  let activityType = '';
  switch (resource) {
  case ResourceType.SEGMENT:
    activityType = 'New Segment';
    break;
  case ResourceType.TEMPLATE:
    activityType = 'New Template';
    break;
  case ResourceType.CONTACT:
    activityType = 'New Contact';
    break;
  case ResourceType.USER:
    activityType = 'New User';
    break;
  case ResourceType.TRANSACTION:
    activityType = 'New Transaction';
    break;
  }

  switch (action) {
  case ActionType.CREATE:
    activityType += ' Created';
    break;
  case ActionType.UPDATE:
    activityType += ' Updated';
    break;
  case ActionType.VIEW:
    activityType += ' Viewed';
    break;
  case ActionType.DELETE:
    activityType += ' Deleted';
    break;
  case ActionType.EXPORT:
    activityType += ' Exported';
    break;
  case ActionType.IMPORT:
    activityType += ' Imported';
    break;
  case ActionType.TRIGGER:
    activityType += ' Sent';
    break;
  case ActionType.SETTINGS_CHANGE:
    activityType += ' Settings Changed';
    break;
  case ActionType.PERMISSION_CHANGE:
    activityType += ' Permissions Changed';
    break;
  }

  return activityType;
}

export function transformActivityLogsToAccountHistory(
  logs: TActivityLog[]
): TAccountHistoryData[] {
  return logs.map((log) => ({
    date: log.createdAt,
    time: log.createdAt,
    activityType: _transformActivityType(log.actionType, log.resourceType),
    ...log,
  }));
}
