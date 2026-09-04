import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product'; 

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    let query = {};
    if (category && category !== 'All') {
      const slugCat = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      query.$or = [{ category: category }, { category: slugCat }];
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      const searchConditions = [{ name: searchRegex }, { description: searchRegex }, { tags: searchRegex }];
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: searchConditions }
        ];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    if (featured === 'true') query.featured = true;

    let sortQuery = { createdAt: -1 };
    if (sort === 'price-asc') sortQuery = { price: 1 };
    if (sort === 'price-desc') sortQuery = { price: -1 };
    if (sort === 'newest') sortQuery = { createdAt: -1 };

    const effectiveLimit = limit <= 0 ? 100 : limit;
    const skip = (page - 1) * effectiveLimit;

    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(effectiveLimit);

    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / effectiveLimit);

    return NextResponse.json({ products, total, page, pages });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    if (body.price === undefined || body.price === null || isNaN(Number(body.price))) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }

    if (!body.description || !body.description.trim()) {
      return NextResponse.json({ error: 'Product description is required' }, { status: 400 });
    }

    // Normalize category
    if (body.category) {
      body.category = String(body.category).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'resin-keychains';
    } else {
      body.category = 'resin-keychains';
    }

    // Normalize images: accept array of strings or objects
    if (Array.isArray(body.images)) {
      body.images = body.images.map(img => {
        if (typeof img === 'string') return { url: img, publicId: '' };
        if (img && typeof img === 'object' && img.url) return img;
        return null;
      }).filter(Boolean);
    }
    if (!body.images || body.images.length === 0) {
      body.images = [{ url: '/images/placeholder.svg', publicId: '' }];
    }

    // Normalize numbers
    body.price = Number(body.price);
    if (body.discountPrice !== undefined && body.discountPrice !== null && body.discountPrice !== '') {
      body.discountPrice = Number(body.discountPrice);
    } else {
      delete body.discountPrice;
    }

    // Clean customization options
    if (Array.isArray(body.customizationOptions)) {
      body.customizationOptions = body.customizationOptions.filter(opt => opt && opt.name && opt.name.trim());
    }

    // Generate unique slug if not provided
    if (!body.slug && body.name) {
      const baseSlug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      body.slug = `${baseSlug || 'product'}-${Date.now().toString().slice(-6)}`;
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

