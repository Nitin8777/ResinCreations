import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    console.warn('Razorpay keys are missing. Payments will run in demo/mock mode.');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
}

export { razorpayInstance };

/**
 * Create a standard Razorpay Order for Checkout Gateway
 */
export async function createRazorpayOrder(amount, receipt, notes = {}) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const isDemoKey = !keyId || keyId.includes('demo') || !keySecret || keySecret.includes('demo');

  if (isDemoKey || !razorpayInstance) {
    return {
      id: `order_demo_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      isMock: true,
      keyId: keyId || 'rzp_test_placeholder'
    };
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes,
    };

    const order = await razorpayInstance.orders.create(options);
    return {
      ...order,
      isMock: false,
      keyId: process.env.RAZORPAY_KEY_ID
    };
  } catch (error) {
    console.warn('Razorpay API error (using test mode fallback):', error.message);
    return {
      id: `order_demo_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      isMock: true,
      keyId: keyId || 'rzp_test_placeholder'
    };
  }
}

/**
 * Verify Razorpay Payment Signature
 */
export function verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    // Demo mode verification
    return true;
  }

  try {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  } catch (err) {
    console.error('Error verifying signature:', err);
    return false;
  }
}

/**
 * Create a Razorpay Payment Link
 */
export async function createPaymentLink(amount, orderId, customerName, customerEmail, customerPhone, description = 'Payment for Khushi Resin Creations Order') {
  if (!razorpayInstance) {
    return {
      short_url: `https://rzp.io/i/demo_${Date.now()}`,
      id: `plink_mock_${Date.now()}`,
      isMock: true
    };
  }

  try {
    const paymentLinkRequest = {
      amount: Math.round(amount * 100), // amount in paisa
      currency: 'INR',
      accept_partial: false,
      description: description,
      customer: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      notes: {
        orderId: orderId
      },
      callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/order-success?orderId=${orderId}`,
      callback_method: 'get'
    };

    const paymentLink = await razorpayInstance.paymentLink.create(paymentLinkRequest);
    return paymentLink;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
}
