import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Try saving to database
    try {
      await dbConnect();
      await Contact.create({ name, email, phone, subject, message });
    } catch (dbErr) {
      console.warn('Could not save contact inquiry to DB (offline/demo fallback):', dbErr.message);
    }

    console.log('Customer inquiry received:', { name, email, phone, subject, message });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received. We will get back to you within 24 hours.'
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
  }
}
