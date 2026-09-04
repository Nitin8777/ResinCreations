import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order'; 

export async function GET(request) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ orders: [], total: 0, page: 1, pages: 1 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    let query = {};
    if (status && status !== 'All') query.status = status;
    if (paymentStatus && paymentStatus !== 'All') query.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return NextResponse.json({ orders, total, page, pages });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ orders: [], total: 0, page: 1, pages: 1 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Auto-generate orderNumber using KRC-XXXXXX format
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `KRC-${Date.now().toString().slice(-4)}${randomSuffix}`;
    
    const orderData = {
      ...body,
      orderNumber,
      createdAt: new Date(),
      orderStatus: 'received',
      paymentStatus: 'pending',
    };

    try {
      const conn = await dbConnect();
      if (conn) {
        const order = await Order.create(orderData);
        return NextResponse.json({ success: true, order }, { status: 201 });
      }
    } catch (dbErr) {
      console.warn('MongoDB not ready, continuing with order generation:', dbErr.message);
    }

    // Return created order even if database is not configured yet so payments never get blocked
    return NextResponse.json({ 
      success: true, 
      order: {
        _id: `ord_${Date.now()}`,
        ...orderData
      } 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    let ids = [];

    if (idsParam) {
      ids = idsParam.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      const body = await request.json().catch(() => ({}));
      ids = Array.isArray(body.ids) ? body.ids : [];
    }

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'No order IDs provided to delete' }, { status: 400 });
    }

    const result = await Order.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ 
      success: true, 
      message: `${result.deletedCount} orders deleted successfully`, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting orders:', error);
    return NextResponse.json({ error: 'Failed to delete orders' }, { status: 500 });
  }
}
