import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const verificationResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: 'POST' }
    );

    const verificationData = await verificationResponse.json();

    return NextResponse.json({ 
      success: verificationData.success,
      score: verificationData.score 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'ReCAPTCHA verification failed' },
      { status: 500 }
    );
  }
}