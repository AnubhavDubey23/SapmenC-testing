import { Response } from 'express';

import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

import { TransactionService } from './transaction.service';

export const TransactionController = {
  getTransactions: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id: userId } = req.user;
      const transactions = await TransactionService.getTransactions(userId);
      res.status(200).json({
        status: true,
        message: 'Transactions fetched',
        data: transactions,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
