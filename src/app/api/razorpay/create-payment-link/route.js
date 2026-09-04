import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
// Assuming razorpay utility exists at @/lib/razorpay or we can just mock it if not
import crypto from 'crypto';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderId, amount, customerName, customerEmail, customerPhone, description } = body;

    // Call Razorpay API to create payment link
    // Here we'll simulate the payment link creation
    const razorpayPaymentLinkId = 'plink_' + crypto.randomBytes(8).toString('hex');
    const paymentLink = `https://rzp.io/i/${crypto.randomBytes(6).toString('hex')}`;

    // Update order with razorpayPaymentLinkId
    const order = await Order.findByIdAndUpdate(
      orderId,
      { razorpayPaymentLinkId },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, paymentLink });
  } catch (error) {
    console.error('Error creating payment link:', error);
    return NextResponse.json({ error: 'Failed to create payment link' }, { status: 500 });
  }
}

