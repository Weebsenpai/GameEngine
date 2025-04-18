'use server';
/**
 * @fileOverview A 3D model generator AI agent.
 *
 * - generate3DModel - A function that handles the 3D model generation process.
 * - Generate3DModelInput - The input type for the generate3DModel function.
 * - Generate3DModelOutput - The return type for the generate3DModel function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const Generate3DModelInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate the 3D model from.'),
});
export type Generate3DModelInput = z.infer<typeof Generate3DModelInputSchema>;

const Generate3DModelOutputSchema = z.object({
  modelUrl: z.string().describe('The URL of the generated 3D model.'),
});
export type Generate3DModelOutput = z.infer<typeof Generate3DModelOutputSchema>;

export async function generate3DModel(input: Generate3DModelInput): Promise<Generate3DModelOutput> {
  return generate3DModelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generate3DModelPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The prompt to generate the 3D model from.'),
    }),
  },
  output: {
    schema: z.object({
      modelUrl: z.string().describe('The URL of the generated 3D model.'),
    }),
  },
  prompt: `You are a 3D model generation AI. Please generate a URL for a 3D model based on the following prompt: {{{prompt}}}. The URL should point to a valid 3D model file.`, 
});

const generate3DModelFlow = ai.defineFlow<
  typeof Generate3DModelInputSchema,
  typeof Generate3DModelOutputSchema
>({
  name: 'generate3DModelFlow',
  inputSchema: Generate3DModelInputSchema,
  outputSchema: Generate3DModelOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
