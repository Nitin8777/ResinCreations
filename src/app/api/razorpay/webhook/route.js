import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import crypto from 'crypto';

export async function POST(request) {
  try {
    await dbConnect();
    
    // In a real implementation, you would verify the signature using Razorpay secret
    // const bodyText = await request.text();
    // const signature = request.headers.get('x-razorpay-signature');
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(bodyText).digest('hex');
    // if (signature !== expectedSignature) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    
    const payload = await request.json();
    const event = payload.event;
    
    if (event === 'payment_link.paid') {
      const paymentLinkId = payload.payload.payment_link.entity.id;
      
      await Order.findOneAndUpdate(
        { razorpayPaymentLinkId: paymentLinkId },
        { paymentStatus: 'paid', status: 'processing' }
      );
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

