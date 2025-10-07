import { ObjectId } from 'mongoose';
import razorpay from '../../config/payment.config';
import { SUBSCRIPTION_CYCLE, SUBSCRIPTION_PERIOD } from '../../consts/rate';
import { TransactionRepository } from './transaction.repository';
import {
  TransactionType,
  TransactionStatus,
  PaymentProvider,
} from './transaction.utils';
import crypto from 'crypto';
import { envConfig } from '../../config/environment-manager';
import UserRepository from '../user/user.repository';
import { logger } from '../../classes/Logger';

export const TransactionService = {
  // Get transactions of a user
  getTransactions: async (userId: string | ObjectId) => {
    try {
      const user = await UserRepository.findUserById(userId as string);
      if (!user) {
        throw new Error('User not found');
      }

      const transactions = await TransactionRepository.getUserTransactions(
        userId as string
      );

      return transactions;
    } catch (error: any) {
      logger.error(`'Error fetching transactions: ${error.message}`, {
        origin: 'services/transactions',
      });
      throw error;
    }
  },
  // Create a subscription transaction
  createSubscription: async (
    userId: string | ObjectId,
    user: any,
    planId: string
  ) => {
    try {
      const planDetails = await razorpay.plans.fetch(planId);

      const priceInPaise = planDetails.item.amount as number;
      const gstAmount = Math.round(0.18 * priceInPaise);

      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: SUBSCRIPTION_CYCLE,
        notify_info: {
          notify_email: user.email,
        },
        notes: {
          user_id: userId as string,
          user_email: user.email,
          user_full_name: user.name,
          plan_id: planId,
        },
        quantity: 1,
        addons: [
          {
            item: {
              name: 'GST',
              amount: gstAmount,
              currency: 'INR',
            },
          },
        ],
      });

      const planFeatures = planDetails.notes?.features;
      let features: string[] = [];

      if (typeof planFeatures === 'string') {
        features.push(planFeatures);
      }

      // Create transaction record
      const transaction = await TransactionRepository.create({
        user: userId as ObjectId,
        amount: (priceInPaise + gstAmount) / 100, // Convert from paise to rupees
        currency: 'INR',
        transactionType: TransactionType.CREATE_SUBSCRIPTION,
        status: TransactionStatus.PENDING,
        paymentProvider: PaymentProvider.RAZORPAY,
        razorpaySubscriptionId: subscription.id,
        metadata: {
          plan_id: planId,
          subscription_id: subscription.id,
        },
        subscriptionPlan: {
          name: planDetails.item.name,
          duration: SUBSCRIPTION_PERIOD,
          features,
        },
      });

      return { subscription, transaction };
    } catch (error: any) {
      logger.error(`'Error creating subscription:', ${error.message}`, {
        origin: 'services/transaction',
      });
      throw error;
    }
  },

  // Create credits purchase order
  createCreditsOrder: async (
    userId: string | ObjectId,
    amount: number,
    user: any
  ) => {
    try {
      if (!amount || typeof amount !== 'number' || amount < 100) {
        throw new Error(`Invalid amount passed: ${amount}`);
      }

      const order = await razorpay.orders.create({
        amount,
        currency: 'INR',
        payment_capture: true,
        notes: {
          intent: 'Purchasing credits',
          user_id: userId as string,
          user_email: user.email,
          user_full_name: user.name,
        },
      });

      const transaction = await TransactionRepository.create({
        user: userId as ObjectId,
        amount: amount / 100, // Convert from paise to rupees
        currency: 'INR',
        transactionType: TransactionType.PURCHASE_CREDITS,
        status: TransactionStatus.PENDING,
        paymentProvider: PaymentProvider.RAZORPAY,
        razorpayOrderId: order.id,
        metadata: {
          credits_amount: amount,
        },
      });

      return { order, transaction };
    } catch (error: any) {
      logger.error(`'Error creating credits order:', ${error.message}`, {
        origin: 'services/transaction',
      });
      throw error;
    }
  },

  // Verify subscription payment
  verifySubscription: async (
    userId: string,
    paymentId: string,
    subscriptionId: string,
    signature: string
  ) => {
    try {
      const generated_signature = crypto
        .createHmac('sha256', envConfig.RAZORPAY_KEY_SECRET!)
        .update(`${paymentId}|${subscriptionId}`)
        .digest('hex');

      if (generated_signature !== signature) {
        throw new Error('Invalid signature');
      }

      const transaction = await TransactionRepository.findOne({
        user: userId,
        razorpaySubscriptionId: subscriptionId,
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Update transaction
      const updatedTransaction = await TransactionRepository.updateById(
        transaction._id.toString(),
        {
          status: TransactionStatus.SUCCESS,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
        }
      );

      return updatedTransaction;
    } catch (error: any) {
      logger.error(`'Error verifying subscription:', ${error.message}`, {
        origin: 'services/transaction',
      });
      throw error;
    }
  },

  // Verify credits purchase
  verifyCreditsPayment: async (
    userId: string,
    paymentId: string,
    orderId: string,
    signature: string
  ) => {
    try {
      const generated_signature = crypto
        .createHmac('sha256', envConfig.RAZORPAY_KEY_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generated_signature !== signature) {
        throw new Error('Invalid signature');
      }

      const transaction =
        await TransactionRepository.findByRazorpayOrderId(orderId);

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Update transaction
      const updatedTransaction = await TransactionRepository.updateById(
        transaction._id.toString(),
        {
          status: TransactionStatus.SUCCESS,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
        }
      );

      return updatedTransaction;
    } catch (error: any) {
      logger.error(`'Error verifying credits payment:', ${error.message}`, {
        origin: 'services/transaction',
      });
      throw error;
    }
  },

  // Create hybrid subscription (both order and subscription for enhanced UI)
  createHybridSubscription: async (
    userId: string | ObjectId,
    user: any,
    planId: string
  ) => {
    try {
      const planDetails = await razorpay.plans.fetch(planId);
      const priceInPaise = planDetails.item.amount as number;
      const gstAmount = Math.round(0.18 * priceInPaise);
      const totalAmount = priceInPaise + gstAmount;

      // 1. Create Razorpay Subscription (for recurring billing)
      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: SUBSCRIPTION_CYCLE,
        notify_info: {
          notify_email: user.email,
        },
        notes: {
          user_id: userId as string,
          user_email: user.email,
          user_full_name: user.name,
          plan_id: planId,
          hybrid: 'true',
        },
        quantity: 1,
        addons: [
          {
            item: {
              name: 'GST',
              amount: gstAmount,
              currency: 'INR',
            },
          },
        ],
      });

      // 2. Create Razorpay Order (for enhanced UI)
      const order = await razorpay.orders.create({
        amount: totalAmount,
        currency: 'INR',
        receipt: `hybrid_${subscription.id}_${Date.now()}`,
        notes: {
          subscription_id: subscription.id,
          user_id: userId as string,
          user_email: user.email,
          user_full_name: user.name,
          plan_id: planId,
          hybrid: 'true',
        },
      });

      const planFeatures = planDetails.notes?.features;
      let features: string[] = [];

      if (typeof planFeatures === 'string') {
        features.push(planFeatures);
      }

      // 3. Create transaction record (hybrid type)
      const transaction = await TransactionRepository.create({
        user: userId as ObjectId,
        amount: totalAmount / 100, // Convert from paise to rupees
        currency: 'INR',
        transactionType: TransactionType.CREATE_SUBSCRIPTION,
        status: TransactionStatus.PENDING,
        paymentProvider: PaymentProvider.RAZORPAY,
        razorpaySubscriptionId: subscription.id,
        razorpayOrderId: order.id,
        metadata: {
          plan_id: planId,
          subscription_id: subscription.id,
          order_id: order.id,
          hybrid: true,
        },
        subscriptionPlan: {
          name: planDetails.item.name,
          duration: SUBSCRIPTION_PERIOD,
          features,
        },
      });

      return { subscription, order, transaction };
    } catch (error: any) {
      logger.error(`'Error creating hybrid subscription:', ${error.message}`, {
        origin: 'services/transaction',
      });
      throw error;
    }
  },

  // Verify hybrid payment (order-based payment for subscription)
  verifyHybridPayment: async (
    userId: string,
    paymentId: string,
    orderId: string,
    signature: string,
    subscriptionId: string,
    planId: string
  ) => {
    try {
      // 1. Verify payment signature
      const generated_signature = crypto
        .createHmac('sha256', envConfig.RAZORPAY_KEY_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generated_signature !== signature) {
        throw new Error('Invalid signature');
      }

      // 2. Find transaction by order ID
      const transaction = await TransactionRepository.findByRazorpayOrderId(orderId);

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // 3. Get payment and order details from Razorpay
      const payment = await razorpay.payments.fetch(paymentId);
      const order = await razorpay.orders.fetch(orderId);
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);

      if (payment.status !== 'captured') {
        throw new Error('Payment not captured');
      }

      // 4. Update transaction
      const updatedTransaction = await TransactionRepository.updateById(
        transaction._id.toString(),
        {
          status: TransactionStatus.SUCCESS,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
        }
      );

      // 5. Activate user subscription
      await UserRepository.updateUser(userId, {
        subscription: {
          id: subscriptionId,
          status: 'active',
          startDate: new Date(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          plan: planId,
        }
      });

      return {
        verified: true,
        message: 'Payment verified and subscription activated',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          plan_id: subscription.plan_id,
        },
        order: {
          id: order.id,
          amount: order.amount,
          status: order.status,
        },
        transaction: updatedTransaction,
      };
    } catch (error: any) {
      logger.error(`'Error verifying hybrid payment:', ${error.message}`, {
        origin: 'services/transaction',
      });
      throw error;
    }
  },
};
