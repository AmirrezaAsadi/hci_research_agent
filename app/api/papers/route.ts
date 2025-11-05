import { NextRequest, NextResponse } from 'next/server';
import { getRecentPapers } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const papers = await getRecentPapers(limit);

    return NextResponse.json({
      success: true,
      data: papers
    });
  } catch (error) {
    console.error('Error fetching papers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch papers' },
      { status: 500 }
    );
  }
}