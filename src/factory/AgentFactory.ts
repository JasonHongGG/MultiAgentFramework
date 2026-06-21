import { ProviderFactory } from './ProviderFactory';
import { PlannerAgent } from '../agents/planner/PlannerAgent';
import { GeneratorAgent } from '../agents/generator/GeneratorAgent';

export class AgentFactory {
  /**
   * Creates a PlannerAgent configured with the provider specified in .env
   */
  static createPlanner(): PlannerAgent {
    const providerName = process.env.PLANNER_PROVIDER;
    const modelName = process.env.PLANNER_MODEL;

    if (!providerName || !modelName) {
      throw new Error('Missing PLANNER_PROVIDER or PLANNER_MODEL in environment variables.');
    }
    
    const provider = ProviderFactory.create(providerName, modelName);
    return new PlannerAgent('PlannerAgent', provider);
  }

  /**
   * Creates a GeneratorAgent configured with the provider specified in .env
   */
  static createGenerator(): GeneratorAgent {
    const providerName = process.env.GENERATOR_PROVIDER;
    const modelName = process.env.GENERATOR_MODEL;

    if (!providerName || !modelName) {
      throw new Error('Missing GENERATOR_PROVIDER or GENERATOR_MODEL in environment variables.');
    }
    
    const provider = ProviderFactory.create(providerName, modelName);
    return new GeneratorAgent('GeneratorAgent', provider);
  }
}
