// @ts-expect-error - Twilio types not properly exported
import { Twilio } from 'twilio';

// Initialize Twilio client
const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export type SMSData = {
  to: string;
  message: string;
  from?: string;
};

export type AppointmentReminder = {
  customerName: string;
  customerPhone: string;
  appointmentDate: Date;
  service: string;
  businessName: string;
};

export type AppointmentConfirmation = {
  customerName: string;
  customerPhone: string;
  appointmentDate: Date;
  service: string;
  businessName: string;
  duration: number;
};

export class TwilioService {
  private static instance: TwilioService;
  private client: Twilio;
  private fromNumber: string;

  private constructor() {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured');
    }

    this.client = twilioClient;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';

    if (!this.fromNumber) {
      throw new Error('Twilio phone number not configured');
    }
  }

  public static getInstance(): TwilioService {
    if (!TwilioService.instance) {
      TwilioService.instance = new TwilioService();
    }
    return TwilioService.instance;
  }

  async sendSMS(data: SMSData): Promise<string> {
    try {
      const message = await this.client.messages.create({
        body: data.message,
        from: data.from || this.fromNumber,
        to: data.to,
      });

      // SMS sent successfully: ${message.sid}
      return message.sid;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error(`SMS failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendAppointmentConfirmation(confirmation: AppointmentConfirmation): Promise<string> {
    const message = `Hi ${confirmation.customerName}!

✅ Your ${confirmation.service} appointment is confirmed for ${confirmation.appointmentDate.toLocaleDateString()} at ${confirmation.appointmentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}.

📍 ${confirmation.businessName}
⏱️ Duration: ${confirmation.duration} minutes

Reply CANCEL to cancel or call us if you need to reschedule.`;

    return this.sendSMS({
      to: confirmation.customerPhone,
      message,
    });
  }

  async sendAppointmentReminder(reminder: AppointmentReminder): Promise<string> {
    const hoursUntil = Math.ceil((reminder.appointmentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60));

    const message = `⏰ Reminder: Your ${reminder.service} appointment is in ${hoursUntil} hours!

📅 ${reminder.appointmentDate.toLocaleDateString()} at ${reminder.appointmentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
📍 ${reminder.businessName}

Reply CONFIRM to confirm or call us to reschedule.`;

    return this.sendSMS({
      to: reminder.customerPhone,
      message,
    });
  }

  async sendFollowUp(customerName: string, customerPhone: string, service: string, businessName: string): Promise<string> {
    const message = `Hi ${customerName}!

Thank you for choosing ${businessName} for your ${service}. We hope you loved your experience!

⭐ How was your visit? Reply with a rating 1-5
💬 We'd love your feedback to improve our service

Book your next appointment anytime by calling us or visiting our website.`;

    return this.sendSMS({
      to: customerPhone,
      message,
    });
  }

  async sendNoShowFollowUp(customerName: string, customerPhone: string, service: string, businessName: string): Promise<string> {
    const message = `Hi ${customerName},

We missed you for your ${service} appointment today at ${businessName}.

No worries - life happens! 📅

Reply RESCHEDULE to book a new time or call us directly. We're here to help when you're ready.`;

    return this.sendSMS({
      to: customerPhone,
      message,
    });
  }

  // Schedule reminders (you'd use this with a job queue like Bull or a cron job)
  async scheduleReminder(reminder: AppointmentReminder, hoursBeforeAppointment: number = 24): Promise<void> {
    const reminderTime = new Date(reminder.appointmentDate.getTime() - (hoursBeforeAppointment * 60 * 60 * 1000));

    // In a real implementation, you'd use a job queue here
    // For now, we'll just log when the reminder should be sent
    // Reminder scheduled for ${reminderTime.toISOString()} (${hoursBeforeAppointment}h before appointment)

    // Example with setTimeout for demo (not production-ready)
    const delayMs = reminderTime.getTime() - new Date().getTime();
    if (delayMs > 0 && delayMs < 24 * 60 * 60 * 1000) { // Only schedule if within 24 hours
      setTimeout(() => {
        this.sendAppointmentReminder(reminder);
      }, delayMs);
    }
  }
}

export const twilioService = TwilioService.getInstance;
