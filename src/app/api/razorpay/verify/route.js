import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { verifyPaymentSignature } from '@/lib/razorpay';

export async function POST(request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    // Verify signature
    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Payment signature verification failed' },
        { status: 400 }
      );
    }

    // Connect to database and update order if orderId provided
    if (orderId) {
      try {
        await dbConnect();
        await Order.findOneAndUpdate(
          { $or: [{ _id: orderId }, { orderNumber: orderId }] },
          {
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            updatedAt: new Date(),
          },
          { new: true }
        );
      } catch (dbErr) {
        console.warn('DB update failed, continuing:', dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

