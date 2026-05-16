import Stripe from 'stripe';
declare const stripeUtil: {
    createCheckoutSession(order: any): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    verifyWebhook(rawBody: any, sig: string): Promise<Stripe.Event>;
};
export default stripeUtil;
//# sourceMappingURL=stripe.d.ts.map