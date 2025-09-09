'use server';

/**
 * @fileOverview Summarizes email content provided by the user.
 *
 * - summarizeEmailContent - A function that takes email content as input and returns a summary.
 * - SummarizeEmailContentInput - The input type for the summarizeEmailContent function.
 * - SummarizeEmailContentOutput - The return type for the summarizeEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmailContentInputSchema = z.object({
  emailContent: z
    .string() 
    .describe('The content of the email to be summarized.'),
});
export type SummarizeEmailContentInput = z.infer<typeof SummarizeEmailContentInputSchema>;

const SummarizeEmailContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the email content.'),
});
export type SummarizeEmailContentOutput = z.infer<typeof SummarizeEmailContentOutputSchema>;

export async function summarizeEmailContent(input: SummarizeEmailContentInput): Promise<SummarizeEmailContentOutput> {
  return summarizeEmailContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmailContentPrompt',
  input: {schema: SummarizeEmailContentInputSchema},
  output: {schema: SummarizeEmailContentOutputSchema},
  prompt: `Summarize the following email content in a concise manner:\n\n{{{emailContent}}}`,
});

const summarizeEmailContentFlow = ai.defineFlow(
  {
    name: 'summarizeEmailContentFlow',
    inputSchema: SummarizeEmailContentInputSchema,
    outputSchema: SummarizeEmailContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
