import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, receipt, notes, customerName, customerEmail, customerPhone } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const orderNotes = {
      ...(notes || {}),
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
    };

    const razorpayOrder = await createRazorpayOrder(amount, receipt, orderNotes);

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      keyId: razorpayOrder.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo12345'
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create payment order' }, { status: 500 });
  }
}

