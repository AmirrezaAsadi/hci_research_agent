import { NextResponse } from 'next/server';
import { createTables } from '@/lib/db';

export async function GET() {
  try {
    await createTables();
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables created successfully!' 
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
