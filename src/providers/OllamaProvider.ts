import { AIProvider } from './AIProvider';
import { GenerateRequest, GenerateResponse } from '../types';

export class OllamaProvider implements AIProvider {
  public readonly name = 'ollama';

  constructor(public readonly model: string) {}

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    // In a real implementation, you would make an HTTP request to local Ollama server
    const sysPart = request.systemPrompt ? `[System: ${request.systemPrompt}]\n` : '';
    
    return {
      text: `[Ollama ${this.model}]\n${sysPart}[User: ${request.prompt}]`,
      metadata: {
        provider: this.name,
        model: this.model,
        simulated: true,
      },
    };
  }
}
