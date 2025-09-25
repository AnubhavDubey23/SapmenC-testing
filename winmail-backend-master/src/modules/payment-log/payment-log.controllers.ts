import { Request, Response } from 'express';
import * as PaymentLogService from './payment-log.services';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { CreatePaymentLogDTO } from './payment-log.dto';

export const createPaymentLog = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    let payload = req.body as CreatePaymentLogDTO;
    payload.user_id = req.user.id;
    const paymentLog = await PaymentLogService.createPaymentLog(req.body);
    return res.status(201).json(paymentLog);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getPaymentLogs = async (req: Request, res: Response) => {
  try {
    const paymentLogs = await PaymentLogService.getPaymentLogs();
    return res.status(200).json(paymentLogs);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getPaymentLogById = async (req: Request, res: Response) => {
  try {
    const paymentLog = await PaymentLogService.getPaymentLogById(req.params.id);
    return res.status(200).json(paymentLog);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updatePaymentLog = async (req: Request, res: Response) => {
  try {
    const paymentLog = await PaymentLogService.updatePaymentLog(
      req.params.id,
      req.body
    );
    return res.status(200).json(paymentLog);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deletePaymentLog = async (req: Request, res: Response) => {
  try {
    await PaymentLogService.deletePaymentLog(req.params.id);
    return res.status(204).json();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
