import type { Metadata } from 'next';
import { ContactForm } from './_components/ContactForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with us. We would love to hear from you!',
};

export default function ContactPage() {
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
                        <a href="mailto:contact@timesentertain.example.com" className="text-muted-foreground hover:text-primary">
                            contact@timesentertain.example.com
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
                        <ContactForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
