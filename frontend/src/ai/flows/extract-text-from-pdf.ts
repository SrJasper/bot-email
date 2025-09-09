'use server';

/**
 * @fileOverview A flow for extracting text from a PDF file.
 *
 * - extractTextFromPdf - A function that takes a PDF file as a data URI and returns the extracted text.
 * - ExtractTextFromPdfInput - The input type for the extractTextFromPdf function.
 * - ExtractTextFromPdfOutput - The return type for the extractTextFromPdf function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextFromPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});

export type ExtractTextFromPdfInput = z.infer<
  typeof ExtractTextFromPdfInputSchema
>;

const ExtractTextFromPdfOutputSchema = z.object({
  textContent: z.string().describe('The extracted text content from the PDF.'),
});

export type ExtractTextFromPdfOutput = z.infer<
  typeof ExtractTextFromPdfOutputSchema
>;

export async function extractTextFromPdf(
  input: ExtractTextFromPdfInput
): Promise<ExtractTextFromPdfOutput> {
  return extractTextFromPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTextFromPdfPrompt',
  input: {schema: ExtractTextFromPdfInputSchema},
  output: {schema: ExtractTextFromPdfOutputSchema},
  prompt: `You are an expert at extracting text content from PDF documents.

  Extract all text from the following PDF document.

  PDF: {{media url=pdfDataUri}}`,
});

const extractTextFromPdfFlow = ai.defineFlow(
  {
    name: 'extractTextFromPdfFlow',
    inputSchema: ExtractTextFromPdfInputSchema,
    outputSchema: ExtractTextFromPdfOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
