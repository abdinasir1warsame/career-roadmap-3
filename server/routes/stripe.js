import express from 'express';
import stripe from 'stripe';
import { db } from '../firebase.js';

const router = express.Router();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  const { priceId, userId } = req.body;

  try {
    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/canceled`,
      metadata: {
        firebaseUID: userId,
      },
      subscription_data: {
        metadata: {
          firebaseUID: userId,
        },
      },
    });

    res.json({ sessionId: session.id });
  } catch (e) {
    console.error('Checkout session error:', e);
    res.status(400).json({
      error: 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined,
    });
  }
});

// Create portal session
router.post('/create-portal-session', async (req, res) => {
  const { customerId } = req.body;

  try {
    const portalSession = await stripeClient.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/account`,
    });

    res.json({ url: portalSession.url });
  } catch (e) {
    console.error('Portal session error:', e);
    res.status(400).json({
      error: 'Failed to create portal session',
      details: process.env.NODE_ENV === 'development' ? e.message : undefined,
    });
  }
});

// Stripe webhook
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripeClient.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object);
          break;
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;
        case 'invoice.payment_failed':
          await handlePaymentFailed(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Webhook handlers
async function handleCheckoutSessionCompleted(session) {
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripeClient.subscriptions.retrieve(
      session.subscription
    );
    const priceId = subscription.items.data[0].price.id;
    const firebaseUID = session.metadata.firebaseUID;

    if (firebaseUID) {
      await db
        .collection('users')
        .doc(firebaseUID)
        .set(
          {
            stripeCustomerId: subscription.customer,
            subscription: {
              status: subscription.status,
              priceId: priceId,
              currentPeriodEnd: subscription.current_period_end * 1000,
              subscriptionId: subscription.id,
            },
          },
          { merge: true }
        );
    }
  }
}

async function handleSubscriptionUpdated(subscription) {
  const firebaseUID = subscription.metadata.firebaseUID;

  if (firebaseUID) {
    await db
      .collection('users')
      .doc(firebaseUID)
      .set(
        {
          subscription: {
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end * 1000,
          },
        },
        { merge: true }
      );
  }
}

async function handlePaymentFailed(invoice) {
  const firebaseUID = invoice.metadata.firebaseUID;

  if (firebaseUID) {
    await db.collection('users').doc(firebaseUID).set(
      {
        'subscription.status': 'past_due',
      },
      { merge: true }
    );
  }
}

export default router;
