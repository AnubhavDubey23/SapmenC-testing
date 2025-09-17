import { FilterQuery } from 'mongoose';
import Transaction, { ITransaction } from './transaction.model';

export const TransactionRepository = {
  // Create a new transaction
  create: async (transactionData: Partial<ITransaction>) => {
    return await Transaction.create(transactionData);
  },

  // Find transaction by ID
  findById: async (id: string) => {
    return await Transaction.findById(id);
  },

  // Find one transaction by filter
  findOne: async (filter: FilterQuery<ITransaction>) => {
    return await Transaction.findOne(filter);
  },

  // Find all transactions by filter
  findMany: async (filter: FilterQuery<ITransaction>) => {
    return await Transaction.find(filter);
  },

  // Update transaction by ID
  updateById: async (id: string, update: Partial<ITransaction>) => {
    return await Transaction.findByIdAndUpdate(id, update, { new: true });
  },

  // Find by Razorpay Order ID
  findByRazorpayOrderId: async (orderId: string) => {
    return await Transaction.findOne({ razorpayOrderId: orderId });
  },

  // Find by Razorpay Payment ID
  findByRazorpayPaymentId: async (paymentId: string) => {
    return await Transaction.findOne({ razorpayPaymentId: paymentId });
  },

  // Get user's transactions
  getUserTransactions: async (userId: string) => {
    return await Transaction.find({ user: userId }).sort({ createdAt: -1 });
  },

  // Get transactions by status
  getTransactionsByStatus: async (status: string) => {
    return await Transaction.find({ status }).sort({ createdAt: -1 });
  },

  // Get transactions by type
  getTransactionsByType: async (transactionType: string) => {
    return await Transaction.find({ transactionType }).sort({ createdAt: -1 });
  },
};
