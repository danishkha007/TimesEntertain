// src/ai/flows/personalized-recommendations.ts
'use server';

/**
 * @fileOverview A personalized movie and TV show recommendation AI agent.
 *
 * - getPersonalizedRecommendations - A function that returns personalized recommendations based on viewing history and preferences.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  viewingHistory: z
    .array(z.string())
    .describe('An array of movie and TV show titles the user has watched.'),
  preferences: z
    .string()
    .describe(
      'A description of the user\u2019s preferences, including genres, actors, directors, and themes they enjoy.'
    ),
  numberOfRecommendations: z
    .number()
    .default(5)
    .describe('The number of recommendations to return.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of personalized movie and TV show recommendations.'),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a movie and TV show recommendation expert.

Based on the user's viewing history and preferences, provide {{numberOfRecommendations}} personalized recommendations.

Viewing History: {{{viewingHistory}}}
Preferences: {{{preferences}}}

Recommendations:`, // The output schema description already guides the output format, so no need to repeat it here.
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
