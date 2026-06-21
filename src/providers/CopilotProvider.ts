import { AIProvider } from './AIProvider';
import { GenerateRequest, GenerateResponse } from '../types';

export class CopilotProvider implements AIProvider {
  public readonly name = 'copilot';

  constructor(public readonly model: string) {}

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    // In a real implementation, you would call the Github Copilot backend here
    const sysPart = request.systemPrompt ? `[System: ${request.systemPrompt}]\n` : '';
    
    return {
      text: `[Copilot ${this.model}]\n${sysPart}[User: ${request.prompt}]`,
      metadata: {
        provider: this.name,
        model: this.model,
        simulated: true,
      },
    };
  }
}
