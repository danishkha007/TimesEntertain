'use server';

import * as z from 'zod';

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export async function sendContactEmail(
  data: ContactFormInputs
): Promise<{ success: boolean; error?: string }> {
  // This is a mock function to allow the form to work on a static site.
  // To implement real email sending, you would need to use a third-party service
  // or a serverless function.
  console.log('Form data:', data);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  if (data.name && data.email && data.message) {
      return { success: true };
  } else {
      return { success: false, error: 'Mock submission failed.' };
  }
}
