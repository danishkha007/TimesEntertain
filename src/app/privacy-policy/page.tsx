
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for TimesEntertain.',
};

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            <strong>Last Updated:</strong> {lastUpdatedDate}
          </p>

          <section className="space-y-2">
            <h2 className="text-2xl font-headline font-semibold text-foreground">1. Introduction</h2>
            <p>
              Welcome to TimesEntertain. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-headline font-semibold text-foreground">2. Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>
                <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
              </li>
               <li>
                <strong>Watchlist Data:</strong> We store the movies and TV shows you add to your watchlist. This information is stored locally in your browser and is not transmitted to our servers.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-headline font-semibold text-foreground">3. Use of Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
             <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Create and manage your account.</li>
                <li>Email you regarding your account or order.</li>
                <li>Enable user-to-user communications.</li>
                <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
                <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            </ul>
          </section>
          
           <section className="space-y-2">
            <h2 className="text-2xl font-headline font-semibold text-foreground">4. Security of Your Information</h2>
            <p>
             We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-headline font-semibold text-foreground">5. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p>
              contact@timesentertain.example.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
