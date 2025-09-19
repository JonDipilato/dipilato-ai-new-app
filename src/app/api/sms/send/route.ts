import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { TwilioService } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    const { type, customerName, customerPhone, appointmentDate, service, businessName, duration } = await request.json();

    if (!customerPhone) {
      return NextResponse.json({ error: 'Customer phone number is required' }, { status: 400 });
    }

    const twilioService = TwilioService.getInstance();
    let messageId: string;

    switch (type) {
      case 'confirmation':
        if (!appointmentDate || !service || !businessName || !duration) {
          return NextResponse.json({ error: 'Missing required fields for confirmation' }, { status: 400 });
        }
        messageId = await twilioService.sendAppointmentConfirmation({
          customerName: customerName || 'Valued Customer',
          customerPhone,
          appointmentDate: new Date(appointmentDate),
          service,
          businessName,
          duration,
        });
        break;

      case 'reminder':
        if (!appointmentDate || !service || !businessName) {
          return NextResponse.json({ error: 'Missing required fields for reminder' }, { status: 400 });
        }
        messageId = await twilioService.sendAppointmentReminder({
          customerName: customerName || 'Valued Customer',
          customerPhone,
          appointmentDate: new Date(appointmentDate),
          service,
          businessName,
        });
        break;

      case 'followup':
        if (!service || !businessName) {
          return NextResponse.json({ error: 'Missing required fields for follow-up' }, { status: 400 });
        }
        messageId = await twilioService.sendFollowUp(
          customerName || 'Valued Customer',
          customerPhone,
          service,
          businessName,
        );
        break;

      case 'noshow':
        if (!service || !businessName) {
          return NextResponse.json({ error: 'Missing required fields for no-show follow-up' }, { status: 400 });
        }
        messageId = await twilioService.sendNoShowFollowUp(
          customerName || 'Valued Customer',
          customerPhone,
          service,
          businessName,
        );
        break;

      default:
        return NextResponse.json({ error: 'Invalid SMS type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      messageId,
      message: 'SMS sent successfully',
    });
  } catch (error) {
    console.error('SMS API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send SMS' },
      { status: 500 },
    );
  }
}
