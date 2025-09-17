import { CreatePaymentLogDTO } from './payment-log.dto';
import paymentLogModel from './payment-log.model';

export const createPaymentLog = async (data: CreatePaymentLogDTO) => {
  const paymentLog = await paymentLogModel.create(data);
  return paymentLog;
};

export const getPaymentLogs = async () => {
  const paymentLogs = await paymentLogModel.find();
  return paymentLogs;
};

export const getPaymentLogById = async (id: string) => {
  const paymentLog = await paymentLogModel.findById(id);
  return paymentLog;
};

export const updatePaymentLog = async (
  id: string,
  data: CreatePaymentLogDTO
) => {
  const paymentLog = await paymentLogModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  return paymentLog;
};

export const deletePaymentLog = async (id: string) => {
  await paymentLogModel.findByIdAndDelete(id);
  return true;
};
