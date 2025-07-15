
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }).max(1000),
  referrername: z.string().min(0, { message: 'Message must be at least 10 characters.' }).max(1000),
});

type ContactFormValues = z.infer<typeof formSchema>;

// Replace this with your own form submission endpoint.
// Some services like Zoho Forms allow GET submissions with URL parameters.
const FORM_ENDPOINT = "https://forms.zohopublic.in/infoakture1/form/Conatct/formperma/AUOumVEVsWgdP8Q_sJYnGcD1LXtrP6DM1RaTkPoKsLw"; // <-- IMPORTANT: UPDATE THIS

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      referrername: 'timesentertain',
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    if (FORM_ENDPOINT.includes("YOUR_FORM_ID_HERE")) {
        console.error("Form submission is not configured. Please update the FORM_ENDPOINT in ContactForm.tsx.");
        setSubmitError("The contact form is not configured. Please contact the site administrator.");
        setIsSubmitting(false);
        return;
    }

    try {
      // Encode form values into URL query parameters
      const params = new URLSearchParams({
        name: values.name,
        email: values.email,
        message: values.message,
        referrername: values.referrername,
        // Zoho specific field names might be different, e.g., 'Name', 'Email'
        // For Zoho, you might need to map:
        // Name: values.name,
        // Email: values.email,
        // etc.
      }).toString();
      
      const submissionUrl = `${FORM_ENDPOINT}?${params}`;

      // Use a simple GET request. Some form backends accept this.
      // We use `mode: 'no-cors'` because we don't need to read the response,
      // and this can prevent CORS errors with certain backends.
      const response = await fetch(submissionUrl, {
        method: 'GET',
        mode: 'no-cors',
      });
      
      // Since 'no-cors' mode results in an opaque response, we can't check response.ok.
      // We will assume success if the fetch call itself doesn't throw an error.
      
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We will get back to you shortly.',
      });
      form.reset();

    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
       setSubmitError(`There was a problem sending your message: ${errorMessage}. Please try again later.`);
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {submitError && (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Could Not Send Message</AlertTitle>
                <AlertDescription>
                    {submitError}
                </AlertDescription>
            </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us what's on your mind..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  );
}
