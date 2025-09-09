'use server';

/**
 * @fileOverview A flow for analyzing the sentiment of an email.
 *
 * - analyzeEmailSentiment - A function that takes email content as input and returns the sentiment score.
 * - AnalyzeEmailSentimentInput - The input type for the analyzeEmailSentiment function.
 * - AnalyzeEmailSentimentOutput - The return type for the analyzeEmailSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEmailSentimentInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the email to analyze for sentiment.'),
});

export type AnalyzeEmailSentimentInput = z.infer<
  typeof AnalyzeEmailSentimentInputSchema
>;

const AnalyzeEmailSentimentOutputSchema = z.object({
  sentimentScore: z
    .string()
    .describe(
      'The sentiment score of the email, can be positive, neutral, or negative.'
    ),
});

export type AnalyzeEmailSentimentOutput = z.infer<
  typeof AnalyzeEmailSentimentOutputSchema
>;

export async function analyzeEmailSentiment(
  input: AnalyzeEmailSentimentInput
): Promise<AnalyzeEmailSentimentOutput> {
  return analyzeEmailSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEmailSentimentPrompt',
  input: {schema: AnalyzeEmailSentimentInputSchema},
  output: {schema: AnalyzeEmailSentimentOutputSchema},
  prompt: `Analyze the sentiment of the following email content and provide a sentiment score (positive, neutral, or negative):

  Email Content:
  {{emailContent}}`,
});

const analyzeEmailSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeEmailSentimentFlow',
    inputSchema: AnalyzeEmailSentimentInputSchema,
    outputSchema: AnalyzeEmailSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
