import { Resend } from 'resend';

const NOTIFY_EMAIL = 'spencerhorton28@gmail.com';

export async function sendContactNotification(m: { name: string; email: string; message: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Best-effort — the message is already saved in the database either way.

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: 'Spencer Lane Site <onboarding@resend.dev>',
    to: NOTIFY_EMAIL,
    replyTo: m.email,
    subject: `New inquiry from ${m.name}`,
    text: `${m.name} (${m.email}) wrote:\n\n${m.message}`,
  });
}
