import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, agentId } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    // Use your real agent ID or the one provided
    const targetAgentId = agentId || '6RhauZbiAbIIXKby1Idp';

    // Call ElevenLabs Conversational AI API
    const response = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        agent_id: targetAgentId,
        phone_number: phoneNumber,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/elevenlabs/webhook`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to initiate conversation' },
        { status: response.status },
      );
    }

    const conversationData = await response.json();

    // Return conversation details
    return NextResponse.json({
      success: true,
      conversationId: conversationData.conversation_id,
      agentId: targetAgentId,
      phoneNumber,
      status: 'initiated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Conversation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
