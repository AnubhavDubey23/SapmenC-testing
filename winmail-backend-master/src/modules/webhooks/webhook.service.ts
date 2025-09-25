import mongoose from 'mongoose';

import {
  TWebhookOrderPayload,
  TWebhookPaymentPayload,
  TWebhookSubscriptionPayload,
} from '../../types/payment.types';
import Transaction from '../transactions/transaction.model';
import {
  TransactionStatus,
  TransactionType,
} from '../transactions/transaction.utils';
import userModel from '../user/user.model';
import razorpay from '../../config/payment.config';
import { SUBSCRIPTION_PERIOD } from '../../consts/rate';
import { ESubscriptionStatus } from '../../data/SUBSCRIPTIONS_DATA';
import { EPlanIds } from '../../data/PLANS_DATA';
import { logger } from '../../classes/Logger';

interface IWebhookService {
  handleOrderPaid(
    order: TWebhookOrderPayload,
    payment?: TWebhookPaymentPayload
  ): Promise<void>;
  handleSubscriptionAuthenticated(
    subscription: TWebhookSubscriptionPayload
  ): Promise<void>;
  handleSubscriptionActivated(
    subscription: TWebhookSubscriptionPayload
  ): Promise<void>;
  handleSubscriptionCharged(
    subscription: TWebhookSubscriptionPayload
  ): Promise<void>;
  handleSubscriptionHalted(
    subscription: TWebhookSubscriptionPayload
  ): Promise<void>;
  handleSubscriptionCancelled(
    subscription: TWebhookSubscriptionPayload
  ): Promise<void>;
}

class WebhookService implements IWebhookService {
  private static instance: WebhookService;

  public static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
      Object.freeze(WebhookService.instance);
    }

    return WebhookService.instance;
  }

  async handleOrderPaid(
    order: TWebhookOrderPayload,
    payment?: TWebhookPaymentPayload
  ): Promise<void> {
    const planId = payment?.entity.notes.plan_id;
    if (planId) {
      // If there's a plan id in notes, we return gracefully and not record this order
      return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const userId = order.entity.notes.user_id;
      if (!userId) {
        throw new Error('No userId found in notes');
      }

      await Transaction.findOneAndUpdate(
        {
          razorpayOrderId: order.entity.id,
        },
        {
          status: TransactionStatus.SUCCESS,
          updatedAt: new Date(),
        },
        { session }
      );

      await userModel.findByIdAndUpdate(userId, {
        $inc: {
          credits: order.entity.amount_paid,
        },
      });

      await session.commitTransaction();

      logger.info(`Order paid`, {
        userId,
        orderId: order.entity.id,
        amount: order.entity.amount_paid,
      });

      return;
    } catch (err: any) {
      await session.abortTransaction();
      logger.error(`Order paid handling failed: ${err.message}`, {
        origin: 'services/webhook',
      });
      throw err;
    } finally {
      session.endSession();
    }
  }

  async handleSubscriptionAuthenticated(
    subscription: TWebhookSubscriptionPayload
  ): Promise<void> {
    // Store the transaction but do not update the user's plan
    try {
      const userId = subscription.entity.notes.user_id;
      if (!userId) {
        throw new Error('No userId found in notes');
      }

      await Transaction.findOneAndUpdate(
        {
          razorpaySubscriptionId: subscription.entity.id,
        },
        {
          user: userId,
          status: TransactionStatus.SUCCESS,
          updatedAt: new Date(),
        },
        { new: true, upsert: true }
      );

      logger.info('Subscription authenticated', {
        userId,
        subscriptionId: subscription.entity.id,
      });
    } catch (err: any) {
      logger.error(
        `Subscription authenticated handling failed: ${err.message}`,
        {
          origin: 'services/webhook',
        }
      );
      throw err;
    }
  }

  async handleSubscriptionActivated(
    subscription: TWebhookSubscriptionPayload
  ): Promise<void> {
    // Subscription is activated -> Now we can update user's plan
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const userId = subscription.entity.notes.user_id;
      if (!userId) {
        throw new Error('No userId found in notes');
      }

      await Transaction.findOneAndUpdate(
        {
          razorpaySubscriptionId: subscription.entity.id,
        },
        {
          status: TransactionStatus.SUCCESS,
          updatedAt: new Date(),
        },
        { session }
      );

      const currentStartUnix = subscription.entity.current_start;
      const currentEndUnix = subscription.entity.current_end;

      const currentStart = currentStartUnix
        ? new Date(currentStartUnix * 1000)
        : new Date(Date.now());

      const currentEnd = currentEndUnix
        ? new Date(currentEndUnix * 1000)
        : new Date(Date.now() + 1000 * 60 * 60 * 24 * SUBSCRIPTION_PERIOD);

      await userModel.findByIdAndUpdate(userId, {
        subscription: {
          plan: subscription.entity.plan_id,
          status: 'active',
          startDate: currentStart,
          expiryDate: currentEnd,
        },
      });

      await session.commitTransaction();

      logger.info('Subscription activated', {
        userId,
        subscriptionId: subscription.entity.id,
      });
    } catch (err: any) {
      await session.abortTransaction();
      logger.error(`Subscription activated handling failed: ${err.message}`, {
        origin: 'services/webhook',
      });
      throw err;
    } finally {
      session.endSession();
    }
  }

  async handleSubscriptionCharged(
    subscription: TWebhookSubscriptionPayload
  ): Promise<void> {
    // Update user's expiry date, etc here -> Helps maintain payment history
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const userId = subscription.entity.notes.user_id;
      if (!userId) {
        throw new Error('No userId found in notes');
      }

      const currentStartUnix = subscription.entity.current_start;
      const currentEndUnix = subscription.entity.current_end;

      const currentStart = currentStartUnix
        ? new Date(currentStartUnix * 1000)
        : new Date(Date.now());

      const currentEnd = currentEndUnix
        ? new Date(currentEndUnix * 1000)
        : new Date(Date.now() + 1000 * 60 * 60 * 24 * SUBSCRIPTION_PERIOD);

      const planDetails = await razorpay.plans.fetch(
        subscription.entity.plan_id
      );

      const planFeatures = planDetails.notes?.features;
      let features: string[] = [];

      if (typeof planFeatures === 'string') {
        features.push(planFeatures);
      }

      const amount =
        typeof planDetails.item.amount === 'string'
          ? parseFloat(planDetails.item.amount) / 100
          : planDetails.item.amount / 100;

      await Transaction.create({
        user: userId,
        amount,
        transactionType: TransactionType.RENEW_SUBSCRIPTION,
        status: TransactionStatus.SUCCESS,
        razorpaySubscriptionId: subscription.entity.id,
        metadata: {
          plan_id: subscription.entity.plan_id,
          subscription_id: subscription.entity.id,
        },
        subscriptionPlan: {
          name: planDetails.item.name,
          duration: SUBSCRIPTION_PERIOD,
          features,
        },
      });

      await userModel.findByIdAndUpdate(
        userId,
        {
          subscription: {
            plan: subscription.entity.plan_id,
            status: ESubscriptionStatus.ACTIVE,
            startDate: currentStart,
            expiryDate: currentEnd,
          },
        },
        { session }
      );

      await session.commitTransaction();

      logger.info('Subscription charged', {
        userId,
        subscriptionId: subscription.entity.id,
      });
    } catch (err: any) {
      await session.abortTransaction();
      logger.error(`Subscription charged handling failed: ${err.message}`, {
        origin: 'services/webhook',
      });
      throw err;
    } finally {
      session.endSession();
    }
  }

  async handleSubscriptionHalted(
    subscription: TWebhookSubscriptionPayload
  ): Promise<void> {
    // Mark subscription as halted but don't downgrade user's plan
    try {
      const userId = subscription.entity.notes?.user_id;
      if (!userId) {
        logger.error(
          `No userId found in subscription notes: ${subscription.entity.id}`,
          { origin: 'services/webhook' }
        );
        throw new Error('No userId found in subscription notes');
      }

      // Update transaction status
      await Transaction.findOneAndUpdate(
        { razorpaySubscriptionId: subscription.entity.id },
        {
          updatedAt: new Date(),
          metadata: subscription.entity,
        }
      );

      logger.info('Subscription halted', {
        userId,
        subscriptionId: subscription.entity.id,
      });
    } catch (err: any) {
      logger.error(`Subscription halted handling failed ${err.message}`, {
        origin: 'services/webhook',
      });
      throw err;
    }
  }

  async handleSubscriptionCancelled(
    subscription: TWebhookSubscriptionPayload
  ): Promise<void> {
    // Downgrade user's plan to free
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const userId = subscription.entity.notes.user_id;
      if (!userId) {
        throw new Error('No userId found in notes');
      }

      await Transaction.findOneAndUpdate(
        { razorpaySubscriptionId: subscription.entity.id },
        {
          updatedAt: new Date(),
          metadata: subscription,
        },
        { session }
      );

      await userModel.findByIdAndUpdate(userId, {
        subscription: {
          plan: EPlanIds.FREE,
          id: null,
          status: 'cancelled',
        },
      });

      await session.commitTransaction();

      logger.info('Subscription cancelled', {
        userId,
        subscriptionId: subscription.entity.id,
      });
    } catch (err: any) {
      logger.error(`Subscription cancellation handling failed ${err.message}`, {
        origin: 'services/webhook',
      });
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}

export default WebhookService.getInstance();
