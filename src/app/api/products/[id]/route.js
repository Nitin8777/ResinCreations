import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product'; 

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    if (body.category) {
      body.category = String(body.category).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'resin-keychains';
    }

    if (Array.isArray(body.images)) {
      body.images = body.images.map(img => {
        if (typeof img === 'string') return { url: img, publicId: '' };
        if (img && typeof img === 'object' && img.url) return img;
        return null;
      }).filter(Boolean);
    }

    if (body.price !== undefined) {
      body.price = Number(body.price);
    }

    if (body.discountPrice !== undefined && body.discountPrice !== null && body.discountPrice !== '') {
      body.discountPrice = Number(body.discountPrice);
    } else if (body.discountPrice === '' || body.discountPrice === null) {
      body.discountPrice = undefined;
    }

    body.updatedAt = Date.now();
    
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

