import { NextRequest, NextResponse } from 'next/server';
import { searchPapers } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const papers = await searchPapers(query);

    return NextResponse.json({
      success: true,
      data: papers
    });
  } catch (error) {
    console.error('Error searching papers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search papers' },
      { status: 500 }
    );
  }
}