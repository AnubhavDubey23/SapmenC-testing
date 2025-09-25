import { ObjectId } from 'mongoose';
import SegmentRepository from './segment.repository';
import { logActivity } from '../activity-log/activity-log.service';
import {
  ActionType,
  ActivityStatus,
  ResourceType,
} from '../activity-log/activity-log.utils';
import { logger } from '../../classes/Logger';
import { ISegment } from './segment.model';
import UserService from '../user/user.service';

interface ISegmentService {
  createSegment(segment: any, userId: string | ObjectId): Promise<ISegment>;
  getAllSegments(userId: string | ObjectId): Promise<ISegment[]>;
  getSegmentById(id: string): Promise<ISegment>;
  updateSegment(
    id: string,
    updatedSegment: any,
    userId: string | ObjectId
  ): Promise<ISegment>;
  deleteSegment(id: string, userId: string | ObjectId): Promise<ISegment>;
}

class SegmentService implements ISegmentService {
  private static instance: SegmentService;

  // Static methods

  public static getInstance() {
    if (!SegmentService.instance) {
      SegmentService.instance = new SegmentService();
    }
    return SegmentService.instance;
  }

  // Public methods

  public async createSegment(segment: any, userId: string | ObjectId) {
    try {
      const user = await UserService.isUserExistById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const newSegment = await SegmentRepository.createSegment(segment, userId);

      await UserService.incrementSegmentCount(user.id as string);

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.CREATE,
        resourceType: ResourceType.SEGMENT,
        resourceId: newSegment._id as ObjectId,
        status: ActivityStatus.SUCCESS,
      });

      logger.info(`Created segment`, { userId, segmentId: newSegment._id });

      return newSegment;
    } catch (err: any) {
      logger.error(`Failed to create segment: ${err.message}`, {
        origin: 'services/segment',
      });

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.CREATE,
        resourceType: ResourceType.SEGMENT,
        status: ActivityStatus.FAILURE,
      });

      throw err;
    }
  }

  public async getAllSegments(userId: string | ObjectId) {
    try {
      const segments = await SegmentRepository.findAllSegments(userId);

      logger.info(`Fetched segments`, { userId });

      return segments;
    } catch (err: any) {
      logger.error(`Failed to get all segments: ${err.message}`, {
        origin: 'services/segment',
      });

      throw err;
    }
  }

  public async getSegmentById(id: string): Promise<ISegment> {
    try {
      const segment = await SegmentRepository.findSegmentById(id);

      if (!segment) {
        throw new Error('Segment does not exist');
      }

      logger.info(`Fetched segment`, { segmentId: segment?._id });

      return segment;
    } catch (err: any) {
      logger.error(`Failed to get segment with id-${id}: ${err.message}`, {
        origin: 'services/segment',
      });
      throw err;
    }
  }

  public async updateSegment(
    id: string,
    updatedSegment: any,
    userId: string | ObjectId
  ): Promise<ISegment> {
    try {
      const segment = await SegmentRepository.updateSegment(
        id,
        updatedSegment,
        userId
      );

      if (!segment) {
        throw new Error('Segment not found');
      }

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.UPDATE,
        resourceType: ResourceType.SEGMENT,
        resourceId: segment._id as ObjectId,
        status: ActivityStatus.SUCCESS,
      });

      logger.info(`Updated segment`, { userId, segmentId: segment._id });

      return segment;
    } catch (err: any) {
      logger.error(`Failed to update segment with id-${id}:${err.message}`, {
        origin: 'services/segment',
      });

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.UPDATE,
        resourceType: ResourceType.SEGMENT,
        status: ActivityStatus.FAILURE,
      });

      throw err;
    }
  }

  public async deleteSegment(
    id: string,
    userId: string | ObjectId
  ): Promise<ISegment> {
    try {
      const user = await UserService.isUserExistById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const segment = await SegmentRepository.deleteSegment(id);

      if (!segment) {
        throw new Error('Segment not found');
      }

      await UserService.decrementSegmentCount(user.id as string);

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.DELETE,
        resourceType: ResourceType.SEGMENT,
        resourceId: segment._id as ObjectId,
        status: ActivityStatus.SUCCESS,
      });

      logger.info(`Delete segment`, { userId, segmentId: segment._id });

      return segment;
    } catch (err: any) {
      logger.error(`Failed to delete segment with id-${id}: ${err.message}`, {
        origin: 'services/segment',
      });

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.DELETE,
        resourceType: ResourceType.SEGMENT,
        status: ActivityStatus.FAILURE,
      });

      throw err;
    }
  }
}

export default SegmentService.getInstance();
