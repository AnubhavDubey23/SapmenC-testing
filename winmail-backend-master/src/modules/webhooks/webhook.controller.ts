import { Request, Response } from 'express';
import { envConfig } from '../../config/environment-manager';
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import {
  EPaymentEvent,
  TWebhookOrderPayload,
  TWebhookPaymentPayload,
  TWebhookSubscriptionPayload,
} from '../../types/payment.types';
import WebhookService from './webhook.service';

interface IWebhookController {
  handleRazorpayWebhook(req: Request, res: Response): Promise<void>;
}

class WebhookController implements IWebhookController {
  private static instance: WebhookController;

  public static getInstance(): WebhookController {
    if (!WebhookController.instance) {
      WebhookController.instance = new WebhookController();
      Object.freeze(WebhookController.instance);
    }

    return WebhookController.instance;
  }

  async handleRazorpayWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const isValid = validateWebhookSignature(
        JSON.stringify(req.body),
        signature as string,
        envConfig.RAZORPAY_WEBHOOK_SECRET!
      );

      if (!isValid) {
        res.status(400).json({
          status: false,
          message: 'Signature is not valid',
          data: null,
        });
      }

      const { event, payload } = req.body;

      let payment = undefined;
      if (payload.payment) {
        payment = payload.payment satisfies TWebhookPaymentPayload;
      }

      switch (event) {
        case EPaymentEvent.ORDER_PAID:
          await WebhookService.handleOrderPaid(
            payload.order as TWebhookOrderPayload,
            payment
          );
          break;
        case EPaymentEvent.SUBSCRIPTION_AUTHENTICATED:
          await WebhookService.handleSubscriptionAuthenticated(
            payload.subscription as TWebhookSubscriptionPayload
          );
          break;
        case EPaymentEvent.SUBSCRIPTION_ACTIVATED:
          await WebhookService.handleSubscriptionActivated(
            payload.subscription as TWebhookSubscriptionPayload
          );
          break;
        case EPaymentEvent.SUBSCRIPTION_CHARGED:
          await WebhookService.handleSubscriptionCharged(
            payload.subscription as TWebhookSubscriptionPayload
          );
          break;
        case EPaymentEvent.SUBSCRIPTION_HALTED:
          await WebhookService.handleSubscriptionHalted(
            payload.subscription as TWebhookSubscriptionPayload
          );
          break;
        case EPaymentEvent.SUBSCRIPTION_CANCELLED:
          await WebhookService.handleSubscriptionCancelled(
            payload.subscription as TWebhookSubscriptionPayload
          );
          break;
        default:
          break;
      }

      res.status(200).send();
    } catch (error: any) {
      res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }
}

export default WebhookController.getInstance();
