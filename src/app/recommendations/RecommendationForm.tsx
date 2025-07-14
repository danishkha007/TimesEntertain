"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Loader2 } from "lucide-react";
import { handleGetRecommendations } from "./actions";

const formSchema = z.object({
  viewingHistory: z.string().min(1, "Please list at least one movie or show."),
  preferences: z.string().min(10, "Please describe your preferences in a bit more detail."),
});

type FormValues = z.infer<typeof formSchema>;

export default function RecommendationForm() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      viewingHistory: "",
      preferences: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendations([]);
    setError(null);

    const viewingHistoryArray = values.viewingHistory.split(',').map(s => s.trim()).filter(Boolean);
    const result = await handleGetRecommendations({
        viewingHistory: viewingHistoryArray,
        preferences: values.preferences,
        numberOfRecommendations: 5,
    });
    
    if (result.success && result.data) {
        setRecommendations(result.data.recommendations);
    } else {
        setError(result.error || "An unknown error occurred.");
    }
    setIsLoading(false);
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="viewingHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Viewing History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Inception, Breaking Bad, The Office"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List some movies or TV shows you&apos;ve enjoyed. Separate them with commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I love sci-fi with complex plots, mind-bending concepts, and great visuals. I'm also a fan of witty comedies and historical dramas."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what you look for in a movie or show. Mention genres, actors, directors, themes, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Get Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mt-8 border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">An Error Occurred</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
            </CardContent>
        </Card>
      )}

      {recommendations.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Here are your personalized recommendations!</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-lg">{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
