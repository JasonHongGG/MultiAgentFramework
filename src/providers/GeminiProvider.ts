import { AIProvider } from './AIProvider';
import { GenerateRequest, GenerateResponse } from '../types';

export class GeminiProvider implements AIProvider {
  public readonly name = 'gemini';

  constructor(public readonly model: string) {}

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    // In a real implementation, you would use @google/generative-ai SDK here
    // And pass systemPrompt as systemInstruction if provided.
    const sysPart = request.systemPrompt ? `[System: ${request.systemPrompt}]\n` : '';
    
    return {
      text: `[Gemini ${this.model}]\n${sysPart}[User: ${request.prompt}]`,
      metadata: {
        provider: this.name,
        model: this.model,
        simulated: true,
      },
    };
  }
}
