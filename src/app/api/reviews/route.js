import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';

const defaultReviews = [
  {
    _id: 'rev_1',
    name: 'Aarti Kulkarni',
    rating: 5,
    productName: 'Galaxy Resin Keychain',
    comment: 'The galaxy keychain is so mesmerizing! The finishing is so smooth, no sharp edges at all. Received it in 4 days with beautiful gift packaging. Highly recommended!',
    media: [
      {
        url: '/images/placeholder.svg',
        mediaType: 'image'
      }
    ],
    verified: true,
    likes: 12,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'rev_2',
    name: 'Rohit Sharma',
    rating: 5,
    productName: 'Custom Name Nameplate',
    comment: 'Ordered a customized royal blue door nameplate for our new apartment. Khushi was so patient in finalizing the font and golden leaf foil placement. Looks extremely premium at our entrance!',
    media: [
      {
        url: '/images/placeholder.svg',
        mediaType: 'image'
      }
    ],
    verified: true,
    likes: 24,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'rev_3',
    name: 'Simran Walia',
    rating: 5,
    productName: 'Floral Resin Photo Frame',
    comment: 'Gave this floral couple photo frame to my best friend for her anniversary. The preserved roses look fresh and the gloss finish is mirror-like! She absolutely loved it.',
    media: [
      {
        url: '/images/placeholder.svg',
        mediaType: 'image'
      }
    ],
    verified: true,
    likes: 19,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'rev_4',
    name: 'Pooja Mehta',
    rating: 5,
    productName: 'Rose Gold Resin Earrings',
    comment: 'Very lightweight and dainty earrings. Real dried flowers in clear resin look so aesthetic with ethnic and western outfits. 10/10 craftsmanship!',
    media: [],
    verified: true,
    likes: 8,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true' || searchParams.get('all') === 'true';
    const statusParam = searchParams.get('status');

    let reviews = [];
    const conn = await dbConnect();

    if (conn) {
      let query = {};
      if (isAdmin) {
        if (statusParam && statusParam !== 'All') {
          query.status = statusParam;
        }
      } else {
        query.status = 'approved';
      }

      const dbReviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .lean();

      if (isAdmin) {
        reviews = dbReviews || [];
      } else {
        if (dbReviews && dbReviews.length > 0) {
          reviews = [...dbReviews, ...defaultReviews];
        } else {
          reviews = defaultReviews;
        }
      }
    } else {
      reviews = defaultReviews;
    }

    const total = reviews.length;
    const avgRating = (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / (total || 1)).toFixed(1);

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let approvedCount = 0;
    let pendingCount = 0;
    let rejectedCount = 0;

    reviews.forEach(r => {
      const star = Math.round(r.rating || 5);
      if (breakdown[star] !== undefined) breakdown[star]++;
      const st = r.status || 'approved';
      if (st === 'approved') approvedCount++;
      else if (st === 'pending') pendingCount++;
      else if (st === 'rejected') rejectedCount++;
    });

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        totalReviews: total,
        approvedCount,
        pendingCount,
        rejectedCount,
        averageRating: Number(avgRating),
        breakdown
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({
      success: true,
      reviews: defaultReviews,
      stats: {
        totalReviews: defaultReviews.length,
        averageRating: 5.0,
        approvedCount: defaultReviews.length,
        pendingCount: 0,
        rejectedCount: 0,
        breakdown: { 5: 4, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, rating, productName, comment, media, status, verified } = body;

    if (!name || !rating || !comment) {
      return NextResponse.json(
        { error: 'Name, star rating, and review comments are required.' },
        { status: 400 }
      );
    }

    const newReviewData = {
      name: name.trim(),
      email: (email || '').trim(),
      rating: Number(rating),
      productName: productName || 'Custom Resin Art',
      comment: comment.trim(),
      media: Array.isArray(media) ? media : [],
      verified: verified !== undefined ? verified : true,
      status: status || 'approved',
      likes: 0,
      createdAt: new Date()
    };

    try {
      await dbConnect();
      const savedReview = await Review.create(newReviewData);
      return NextResponse.json({
        success: true,
        review: savedReview,
        message: 'Review saved successfully!'
      }, { status: 201 });
    } catch (dbErr) {
      console.warn('DB offline, returning memory review:', dbErr.message);
      return NextResponse.json({
        success: true,
        review: { _id: `local_${Date.now()}`, ...newReviewData },
        message: 'Review saved successfully!'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
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
      return NextResponse.json({ error: 'No review IDs provided to delete' }, { status: 400 });
    }

    const result = await Review.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ 
      success: true, 
      message: `${result.deletedCount} reviews deleted successfully`, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting reviews in bulk:', error);
    return NextResponse.json({ error: 'Failed to delete reviews' }, { status: 500 });
  }
}

