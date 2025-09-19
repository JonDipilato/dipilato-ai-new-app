import type { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  JSON.parse(payload); // Parse payload for validation

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch {
    // Error verifying webhook
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const { id: _id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    // User created

    // TODO: Add user to your database
    // TODO: Send welcome email
    // TODO: Set up default organization if needed
    // TODO: Grant initial credits/trial access

    // Example: You could create a default organization here
    // or add the user to a trial plan automatically
  }

  if (eventType === 'organization.created') {
    // Organization created

    // TODO: Set up organization in your database
    // TODO: Grant trial access
    // TODO: Initialize default settings
  }

  if (eventType === 'organizationMembership.created') {
    // User added to organization

    // TODO: Handle team member additions
    // TODO: Send team invite emails
    // TODO: Update billing if needed
  }

  return new Response('', { status: 200 });
}
