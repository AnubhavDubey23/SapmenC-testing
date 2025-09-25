import { Response } from 'express';
import SegmentService from './segment.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

interface ISegmentController {
  createSegment(req: AuthenticatedRequest, res: Response): Promise<void>;
  getAllSegments(req: AuthenticatedRequest, res: Response): Promise<void>;
  getSegmentById(req: AuthenticatedRequest, res: Response): Promise<void>;
  updateSegment(req: AuthenticatedRequest, res: Response): Promise<void>;
  deleteSegment(req: AuthenticatedRequest, res: Response): Promise<void>;
}

class SegmentController implements ISegmentController {
  private static instance: SegmentController;

  // Static methods


  public static getInstance() {
    if (!SegmentController.instance) {
      SegmentController.instance = new SegmentController();
      Object.freeze(SegmentController.instance);
    }

    return SegmentController.instance;
  }

  // Public methods

  public async createSegment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: userId } = req.user;
      const segment = await SegmentService.createSegment(req.body, userId);
      res.status(201).json({
        status: true,
        message: 'Segment created successfully!',
        data: segment,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Internal Server Error';
      res.status(500).json({
        status: false,
        message,
        data: null,
      });
    }
  }

  public async getAllSegments(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: userId } = req.user;
      const segments = await SegmentService.getAllSegments(userId);
      res.status(200).json({
        status: true,
        message: 'All templates fetched successfully!',
        data: segments,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Internal Server Error';
      res.status(500).json({
        status: false,
        message,
        data: null,
      });
    }
  }

  public async getSegmentById(req: AuthenticatedRequest, res: Response) {
    try {
      const segment = await SegmentService.getSegmentById(req.params.id);
      res.status(200).json({
        status: true,
        message: 'Segment fetched successfully!',
        data: segment,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Internal Server Error';
      res.status(500).json({
        status: false,
        message,
        data: null,
      });
    }
  }

  public async updateSegment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: userId } = req.user;
      const segment = await SegmentService.updateSegment(
        req.params.id,
        req.body,
        userId
      );
      res.status(200).json({
        status: true,
        message: 'Segment updated successfully!',
        data: segment,
      });
    } catch (err: any) {
      const message =
        err instanceof Error ? err.message : 'Internal Server Error';
      res.status(500).json({
        status: false,
        message,
        data: null,
      });
    }
  }

  public async deleteSegment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: userId } = req.user;
      await SegmentService.deleteSegment(req.params.id, userId);
      res.status(204).send();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Internal Server Error';
      res.status(500).json({
        status: false,
        message,
        data: null,
      });
    }
  }
}

export default SegmentController.getInstance();
