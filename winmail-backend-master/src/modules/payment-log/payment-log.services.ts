import { CreatePaymentLogDTO } from './payment-log.dto';
import * as PaymentLogRepository from './payment-log.repository';

export const createPaymentLog = async (data: CreatePaymentLogDTO) => {
  const paymentLog = await PaymentLogRepository.createPaymentLog(data);
  return paymentLog;
};

export const getPaymentLogs = async () => {
  const paymentLogs = await PaymentLogRepository.getPaymentLogs();
  return paymentLogs;
};

export const getPaymentLogById = async (id: string) => {
  const paymentLog = await PaymentLogRepository.getPaymentLogById(id);
  return paymentLog;
};

export const updatePaymentLog = async (
  id: string,
  data: CreatePaymentLogDTO
) => {
  const paymentLog = await PaymentLogRepository.updatePaymentLog(id, data);
  return paymentLog;
};

export const deletePaymentLog = async (id: string) => {
  await PaymentLogRepository.deletePaymentLog(id);
  return true;
};
