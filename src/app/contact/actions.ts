'use server';

import * as z from 'zod';
import nodemailer from 'nodemailer';

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export async function sendContactEmail(
  data: ContactFormInputs
): Promise<{ success: boolean; error?: string }> {
  const parsedData = contactFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, error: 'Invalid form data.' };
  }

  const { name, email, message } = parsedData.data;

  const {
    EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD,
    EMAIL_TO,
  } = process.env;

  if (
    !EMAIL_SERVER_HOST ||
    !EMAIL_SERVER_PORT ||
    !EMAIL_SERVER_USER ||
    !EMAIL_SERVER_PASSWORD ||
    !EMAIL_TO
  ) {
    console.error('Missing email environment variables');
    return {
      success: false,
      error: 'Server is not configured to send emails.',
    };
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: parseInt(EMAIL_SERVER_PORT, 10),
    secure: parseInt(EMAIL_SERVER_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`, // Set from address to be the user's email
    to: EMAIL_TO,
    replyTo: email,
    subject: `New Contact Form Message from ${name}`,
    text: `You have received a new message from your website contact form.
    
    Here are the details:
    Name: ${name}
    Email: ${email}
    
    Message:
    ${message}`,
    html: `
    <h2>New Contact Form Message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <h3>Message:</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    await transporter.verify();
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: `Failed to send email. ${errorMessage}` };
  }
}
