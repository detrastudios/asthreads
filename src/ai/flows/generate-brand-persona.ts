// The directive tells the Next.js runtime that the code in this file should be executed on the server-side.
'use server';

/**
 * @fileOverview Generates a brand persona based on user inputs about their brand.
 *
 * - generateBrandPersona - A function that generates the brand persona.
 * - GenerateBrandPersonaInput - The input type for the generateBrandPersona function.
 * - GenerateBrandPersonaOutput - The return type for the generateBrandPersona function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBrandPersonaInputSchema = z.object({
  targetAudience: z.string().describe('Description of the brand\'s target audience.'),
  painPoints: z.string().describe('Key pain points of the target audience.'),
  solutions: z.string().describe('Solutions the brand offers to address the pain points.'),
  values: z.string().describe('Core values of the brand.'),
  contentStyle: z.string().describe('Preferred style for the brand\'s content.'),
});
export type GenerateBrandPersonaInput = z.infer<typeof GenerateBrandPersonaInputSchema>;

const GenerateBrandPersonaOutputSchema = z.object({
  tone: z.string().describe('Suggested tone for the brand persona.'),
  contentPillars: z.string().describe('Suggested content pillars for the brand.'),
  contentTypes: z.string().describe('Suggested content types for the brand.'),
  shouldIncorporateInfo: z.boolean().describe('Whether to incorporate additional info'),
});
export type GenerateBrandPersonaOutput = z.infer<typeof GenerateBrandPersonaOutputSchema>;

export async function generateBrandPersona(input: GenerateBrandPersonaInput): Promise<GenerateBrandPersonaOutput> {
  return generateBrandPersonaFlow(input);
}

const incorporateInfoTool = ai.defineTool({
  name: 'incorporateInfoTool',
  description: 'Call this to determine whether to incorporate additional information based on the brand details',
  inputSchema: z.object({
    targetAudience: z.string().describe('Description of the brand\'s target audience.'),
    painPoints: z.string().describe('Key pain points of the target audience.'),
    solutions: z.string().describe('Solutions the brand offers to address the pain points.'),
    values: z.string().describe('Core values of the brand.'),
    contentStyle: z.string().describe('Preferred style for the brand\'s content.'),
  }),
  outputSchema: z.boolean(),
}, async (input) => {
  // Simulate a decision-making process for whether to incorporate info
  // For now, just return true for demonstration purposes
  return true;
});

const prompt = ai.definePrompt({
  name: 'generateBrandPersonaPrompt',
  tools: [incorporateInfoTool],
  input: {schema: GenerateBrandPersonaInputSchema},
  output: {schema: GenerateBrandPersonaOutputSchema},
  prompt: `You are an AI assistant that helps generate brand personas.

  Based on the following brand information, suggest a brand persona including tone, content pillars, and content types.

  Target Audience: {{{targetAudience}}}
  Pain Points: {{{painPoints}}}
  Solutions: {{{solutions}}}
  Values: {{{values}}}
  Content Style: {{{contentStyle}}}

  The response must be a JSON object matching the following schema:
  ${JSON.stringify(GenerateBrandPersonaOutputSchema.shape, null, 2)}

  Include the field shouldIncorporateInfo to indicate if additional info is to be incorporated, using the incorporateInfoTool to determine this.`, 
});

const generateBrandPersonaFlow = ai.defineFlow(
  {
    name: 'generateBrandPersonaFlow',
    inputSchema: GenerateBrandPersonaInputSchema,
    outputSchema: GenerateBrandPersonaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
