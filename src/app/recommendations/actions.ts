"use server";

import { getPersonalizedRecommendations } from "@/ai/flows/personalized-recommendations";
import type { PersonalizedRecommendationsInput, PersonalizedRecommendationsOutput } from "@/ai/flows/personalized-recommendations";

type ActionResult = 
    | { success: true; data: PersonalizedRecommendationsOutput }
    | { success: false; error: string };


export async function handleGetRecommendations(input: PersonalizedRecommendationsInput): Promise<ActionResult> {
  try {
    const result = await getPersonalizedRecommendations(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting recommendations:", error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred while fetching recommendations." };
  }
}
