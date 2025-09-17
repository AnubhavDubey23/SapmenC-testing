export type TSubscriptionData = {
  subscriptionId: string;
  planName: string;
  subscriptionLink: string;
  purchasedOn: Date;
  expiresOn: Date;
  status: string;
};

export type TCreditData = {
  orderId: string;
  amount: number;
  credits: number;
  date: Date;
  status: string;
};
