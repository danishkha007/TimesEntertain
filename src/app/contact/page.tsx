
"use client";

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { ContactForm } from './_components/ContactForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Note: Metadata is not used in Client Components, but we keep it for potential future static rendering
// export const metadata: Metadata = {
//     title: 'Contact Us',
//     description: 'Get in touch with us. We would love to hear from you!',
// };

export default function ContactPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        document.title = "Contact Us | TimesEntertain";
    }, []);

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Contact Us</h1>
                    <p className="text-muted-foreground mt-2">
                        Have a question, comment, or feedback? Fill out the form and we will get back to you as soon as possible.
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-primary" />
                        <a href="mailto:contact@timesentertain.com" className="text-muted-foreground hover:text-primary">
                            contact@timesentertain.com
                        </a>
                    </div>
                     <div className="flex items-center gap-4">
                        <Phone className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground">(123) 456-7890</span>
                    </div>
                </div>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Send us a message</CardTitle>
                        <CardDescription>We typically respond within 24 hours.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isClient ? (
                            <ContactForm />
                        ) : (
                            <div className="space-y-6">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
