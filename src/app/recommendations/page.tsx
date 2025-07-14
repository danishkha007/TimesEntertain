import type { Metadata } from 'next';
import RecommendationForm from './RecommendationForm';

export const metadata: Metadata = {
  title: 'Personalized Recommendations',
  description: 'Get personalized movie and TV show recommendations based on your taste.',
};

export default function RecommendationsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold mb-4">
          Find Your Next Favorite
        </h1>
        <p className="text-lg text-muted-foreground">
          Tell us what you like, and our AI will find movies and TV shows
          you&apos;ll love. The more details you provide, the better the
          recommendations!
        </p>
      </div>
      <RecommendationForm />
    </div>
  );
}
