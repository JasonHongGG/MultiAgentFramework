import { AIProvider } from './AIProvider';
import { OllamaProvider } from './ollama/OllamaProvider';
import { VertexAIProvider } from './vertexai/VertexAIProvider';
import { GeminiFlowProvider } from './geminiflow/GeminiFlowProvider';

export class ProviderFactory {
  static createProvider(agentName: string): AIProvider {
    const envPrefix = `AGENT_${agentName.toUpperCase()}_`;
    
    const providerType = process.env[`${envPrefix}PROVIDER`];
    const model = process.env[`${envPrefix}MODEL`];

    if (!providerType) {
      throw new Error(`Configuration Error: Missing ${envPrefix}PROVIDER in .env`);
    }

    if (!model) {
      throw new Error(`Configuration Error: Missing ${envPrefix}MODEL in .env`);
    }

    switch (providerType.toLowerCase()) {
      case 'ollama': {
        const url = process.env.PROVIDER_OLLAMA_URL;
        if (!url) {
          throw new Error('Configuration Error: Missing PROVIDER_OLLAMA_URL in .env');
        }
        return new OllamaProvider(model, url);
      }
      case 'vertex': {
        const projectId = process.env.PROVIDER_VERTEX_PROJECT_ID;
        const region = process.env.PROVIDER_VERTEX_REGION;
        const accessToken = process.env.PROVIDER_VERTEX_ACCESS_TOKEN;

        if (!projectId) throw new Error('Configuration Error: Missing PROVIDER_VERTEX_PROJECT_ID in .env');
        if (!region) throw new Error('Configuration Error: Missing PROVIDER_VERTEX_REGION in .env');
        if (!accessToken) throw new Error('Configuration Error: Missing PROVIDER_VERTEX_ACCESS_TOKEN in .env');

        return new VertexAIProvider(model, projectId, region, accessToken);
      }
      case 'geminiflow': {
        const url = process.env.PROVIDER_GEMINIFLOW_URL || 'http://127.0.0.1:8000';
        return new GeminiFlowProvider(model, url);
      }
      
      // Future providers can be added here
      
      default:
        throw new Error(`Configuration Error: Unsupported provider type '${providerType}' for agent '${agentName}'`);
    }
  }
}
