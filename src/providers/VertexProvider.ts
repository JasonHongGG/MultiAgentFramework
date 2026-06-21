import { AIProvider } from './AIProvider';
import { GenerateRequest, GenerateResponse } from '../types';

export class VertexProvider implements AIProvider {
  public readonly name = 'vertex';

  constructor(public readonly model: string) {}

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    // In a real implementation, you would use @google-cloud/vertexai SDK here
    const sysPart = request.systemPrompt ? `[System: ${request.systemPrompt}]\n` : '';
    
    return {
      text: `[Vertex ${this.model}]\n${sysPart}[User: ${request.prompt}]`,
      metadata: {
        provider: this.name,
        model: this.model,
        simulated: true,
      },
    };
  }
}
