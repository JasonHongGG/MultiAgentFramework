import { BaseAgent } from './BaseAgent';
import { ProviderFactory } from '../providers/ProviderFactory';
import { ExampleAgent } from './ExampleAgent';

export class AgentFactory {
  static createAgent(agentName: string): BaseAgent {
    const provider = ProviderFactory.createProvider(agentName);

    switch (agentName.toLowerCase()) {
      case 'example':
        return new ExampleAgent(provider);
      
      // Future agents can be added here
      
      default:
        throw new Error(`Factory Error: Unknown agent type '${agentName}'`);
    }
  }
}
