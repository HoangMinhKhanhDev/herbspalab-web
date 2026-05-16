import Stripe from 'stripe';
import { logger } from './logger.js';
let stripe = null;
function getStripe() {
    if (!stripe) {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
        }
        stripe = new Stripe(secretKey);
    }
    return stripe;
}
const stripeUtil = {
    async createCheckoutSession(order) {
        try {
            const session = await getStripe().checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: order.orderItems.map((item) => ({
                    price_data: {
                        currency: 'vnd',
                        product_data: {
                            name: item.name,
                            images: item.image ? [item.image] : [],
                        },
                        unit_amount: item.price,
                    },
                    quantity: item.qty,
                })),
                mode: 'payment',
                success_url: `${process.env.DOMAIN || 'http://localhost:5000'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.DOMAIN || 'http://localhost:5000'}/cart`,
                metadata: {
                    orderId: order.id.toString(),
                },
            });
            return session;
        }
        catch (error) {
            logger.error('Stripe session creation failed:', error);
            throw error;
        }
    },
    async verifyWebhook(rawBody, sig) {
        try {
            return getStripe().webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
        }
        catch (error) {
            logger.error('Stripe webhook verification failed:', error);
            throw error;
        }
    }
};
export default stripeUtil;
//# sourceMappingURL=stripe.js.map