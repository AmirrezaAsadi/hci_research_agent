import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Verify this is coming from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Trigger the Railway backend workflow
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hciresearchagent-production.up.railway.app';
    const response = await fetch(`${backendUrl}/workflow/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ force: true }),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Workflow triggered successfully',
      backend_response: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error triggering workflow:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
