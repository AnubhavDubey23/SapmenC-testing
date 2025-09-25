import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import PlanService from '../plan/plan.service';
import userModel from '../user/user.model';
import UserRepository from '../user/user.repository';
import { EPlanIds } from '../../data/PLANS_DATA';
import {
  RazorpayPaymentVerificationBody,
  RazorpaySubscriptionVerificationBody,
} from './payment.dto';
import { TransactionService } from '../transactions/transaction.service';

export const createSubscription = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id: userId } = req.user;
    const { planId } = req.params;

    const user = await userModel.findById(userId).populate('role');
    if (!user) {
      throw new Error('User not found!');
    }

    // if (user.role.name === 'ADMIN') {
    //   throw new Error('Admin cannot subscribe to a plan!');
    // }

    // Handle free plan
    if (planId === EPlanIds.FREE) {
      await PlanService.startFreePlan(userId);
      return res.status(200).json({
        status: true,
        message: 'Free plan started!',
        data: { user },
      });
    }

    // Create paid subscription
    const { subscription, transaction } =
      await TransactionService.createSubscription(userId, user, planId);

    return res.status(200).json({
      status: true,
      message: 'Subscription Created Successfully',
      data: { user, subscription, transaction },
    });
  } catch (err: any) {
    return res.status(400).json({
      status: false,
      message: err.message || 'Subscription Creation Failed',
      data: err,
    });
  }
};

export const verifySubscription = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id: userId } = req.user;
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body as RazorpaySubscriptionVerificationBody;

    // Verify the payment
    const transaction = await TransactionService.verifySubscription(
      userId,
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature
    );

    if (!transaction) {
      throw new Error('Could not verify subscription');
    }

    return res.status(200).json({
      status: true,
      message: 'Payment verified successfully',
      data: {
        transaction,
      },
    });
  } catch (err: any) {
    return res.status(400).json({
      status: false,
      message: err.message || 'Payment verification failed',
      data: null,
    });
  }
};

export const purchaseCredits = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { amount } = req.body;
    const { id: userId } = req.user;

    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { order, transaction } = await TransactionService.createCreditsOrder(
      userId,
      amount,
      user
    );

    return res.status(201).json({
      status: true,
      message: 'Created order successfully',
      data: { user, order, transaction },
    });
  } catch (err: any) {
    console.error('Error creating credits order:', err?.message || err);
    return res.status(500).json({
      status: false,
      message: err.message || 'Failed to create order',
      data: null,
    });
  }
};

export const verifyPurchaseCredits = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id: userId } = req.user;
    const { amount } = req.body;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body as RazorpayPaymentVerificationBody;

    // Verify the payment
    const transaction = await TransactionService.verifyCreditsPayment(
      userId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    );

    if (!transaction) {
      return res.status(400).json({
        status: false,
        message: "Payment verification failed",
        data: null,
      });
    }
    
    // Convert amount from paise to credits (1 rupee = 1 credit)
    await UserRepository.incrementCredits(userId, amount / 100);

    
    return res.status(201).json({
      status: true,
      message: 'Payment verified successfully and incremented credits',
      data: { transaction },
    });
  } catch (err: any) {
    return res.status(500).json({
      status: false,
      message: err.message || 'Failed to verify payment',
      data: null,
    });
  }
};
