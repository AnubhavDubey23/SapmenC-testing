import { TCreditData, TSubscriptionData } from '@/types/billing.types';
import { TransactionType, TTransaction } from '@/types/transaction.types';

export function transformTransactionsToSubscriptions(
  transactions: TTransaction[]
): TSubscriptionData[] {
  return transactions
    .filter(
      (transaction) =>
        transaction.transactionType === TransactionType.CREATE_SUBSCRIPTION
    )
    .map((transaction) => {
      const subscriptionId = transaction.razorpaySubscriptionId ?? 'rzp_sub_id';
      const duration = transaction.subscriptionPlan
        ? transaction.subscriptionPlan.duration
        : 0;

      const planName = transaction.subscriptionPlan
        ? transaction.subscriptionPlan.name
        : 'plan_name';

      return {
        subscriptionId,
        planName,
        subscriptionLink: '',
        purchasedOn: transaction.updatedAt,
        expiresOn: new Date(),
        status: transaction.status,
      };
    })
    .filter((transaction) => transaction.status !== 'PENDING');
}

export function transformTransactionsToCredits(
  transactions: TTransaction[]
): TCreditData[] {
  return transactions
    .filter(
      (transaction) =>
        transaction.transactionType === TransactionType.PURCHASE_CREDITS
    )
    .map((transaction) => {
      const orderId = transaction.razorpayOrderId ?? 'rzp_order_id';
      const amount = transaction.amount;
      return {
        orderId,
        amount,
        credits: amount,
        date: transaction.createdAt,
        status: transaction.status,
      };
    })
    .filter((transaction) => transaction.status !== 'PENDING');
}
