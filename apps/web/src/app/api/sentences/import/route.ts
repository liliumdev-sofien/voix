import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sentences } = await request.json();
    
    // In a real implementation, this would call the NestJS API
    // await axios.post('http://localhost:3000/sentences/bulk', sentences);
    
    console.log('Received sentences for import:', sentences.length);

    // Mock success
    return NextResponse.json({ success: true, count: sentences.length });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ success: false, error: 'Import failed' }, { status: 500 });
  }
}
