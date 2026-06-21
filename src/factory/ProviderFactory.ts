import { AIProvider } from '../providers/AIProvider';
import { GeminiProvider } from '../providers/GeminiProvider';
import { OllamaProvider } from '../providers/OllamaProvider';
import { CopilotProvider } from '../providers/CopilotProvider';
import { VertexProvider } from '../providers/VertexProvider';

export class ProviderFactory {
  static create(providerName: string, modelName: string): AIProvider {
    switch (providerName.toLowerCase()) {
      case 'gemini':
        return new GeminiProvider(modelName);
      case 'ollama':
        return new OllamaProvider(modelName);
      case 'copilot':
        return new CopilotProvider(modelName);
      case 'vertex':
        return new VertexProvider(modelName);
      default:
        throw new Error(`Unsupported AI Provider: ${providerName}`);
    }
  }
}
