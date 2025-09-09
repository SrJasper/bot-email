'use server';

/**
 * @fileOverview A flow for extracting key topics from an email.
 *
 * - extractEmailTopics - A function that extracts key topics from an email.
 * - ExtractEmailTopicsInput - The input type for the extractEmailTopics function.
 * - ExtractEmailTopicsOutput - The return type for the extractEmailTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractEmailTopicsInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the email from which to extract topics.'),
});
export type ExtractEmailTopicsInput = z.infer<typeof ExtractEmailTopicsInputSchema>;

const ExtractEmailTopicsOutputSchema = z.object({
  topics: z.array(z.string()).describe('The key topics discussed in the email.'),
});
export type ExtractEmailTopicsOutput = z.infer<typeof ExtractEmailTopicsOutputSchema>;

export async function extractEmailTopics(input: ExtractEmailTopicsInput): Promise<ExtractEmailTopicsOutput> {
  return extractEmailTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractEmailTopicsPrompt',
  input: {schema: ExtractEmailTopicsInputSchema},
  output: {schema: ExtractEmailTopicsOutputSchema},
  prompt: `You are an expert at extracting key topics from emails.

  Analyze the following email content and identify the main topics discussed. Return a list of topics as strings.

  Email Content: {{{emailContent}}}

  Topics:`,
});

const extractEmailTopicsFlow = ai.defineFlow(
  {
    name: 'extractEmailTopicsFlow',
    inputSchema: ExtractEmailTopicsInputSchema,
    outputSchema: ExtractEmailTopicsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
