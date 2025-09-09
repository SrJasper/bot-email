import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-email-sentiment.ts';
import '@/ai/flows/summarize-email-content.ts';
import '@/ai/flows/extract-email-topics.ts';
import '@/ai/flows/extract-text-from-pdf.ts';
