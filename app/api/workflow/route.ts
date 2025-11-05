import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Trigger the backend workflow
    const response = await fetch(`${BACKEND_URL}/workflow/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Workflow triggered successfully',
      data
    });
  } catch (error) {
    console.error('Error triggering workflow:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to trigger workflow' },
      { status: 500 }
    );
  }
}