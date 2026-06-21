import { BaseAgent } from '../BaseAgent';
import { GENERATOR_SYSTEM_PROMPT, buildGeneratorUserPrompt } from './prompts';

export class GeneratorAgent extends BaseAgent {
  async execute(plan: string): Promise<string> {
    this.logger.info('Starting generation phase', { planLength: plan.length });
    
    const prompt = buildGeneratorUserPrompt(plan);
    const systemPrompt = GENERATOR_SYSTEM_PROMPT;
    
    this.logger.request(`Prompting ${this.provider.name} (${this.provider.model})`, { systemPrompt, prompt });
    
    try {
      const response = await this.provider.generate({ systemPrompt, prompt });
      this.logger.response('Received result from provider', { responseText: response.text });
      return response.text;
    } catch (error: any) {
      this.logger.error('Failed to generate result', { error: error.message });
      throw error;
    }
  }
}
