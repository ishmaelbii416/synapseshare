'use server';

/**
 * @fileOverview A paste summarization AI agent.
 *
 * - summarizePaste - A function that handles the paste summarization process.
 * - SummarizePasteInput - The input type for the summarizePaste function.
 * - SummarizePasteOutput - The return type for the summarizePaste function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePasteInputSchema = z.object({
  pasteContent: z
    .string()
    .describe('The content of the paste to be summarized.'),
});
export type SummarizePasteInput = z.infer<typeof SummarizePasteInputSchema>;

const SummarizePasteOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the paste content.'),
});
export type SummarizePasteOutput = z.infer<typeof SummarizePasteOutputSchema>;

export async function summarizePaste(input: SummarizePasteInput): Promise<SummarizePasteOutput> {
  return summarizePasteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePastePrompt',
  input: {schema: SummarizePasteInputSchema},
  output: {schema: SummarizePasteOutputSchema},
  prompt: `Summarize the following text:\n\n{{{pasteContent}}}`, // Handlebars syntax
});

const summarizePasteFlow = ai.defineFlow(
  {
    name: 'summarizePasteFlow',
    inputSchema: SummarizePasteInputSchema,
    outputSchema: SummarizePasteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
