import { BaseAgent } from '../BaseAgent';
import { PLANNER_SYSTEM_PROMPT, buildPlannerUserPrompt } from './prompts';

export class PlannerAgent extends BaseAgent {
  async execute(taskDescription: string): Promise<string> {
    this.logger.info('Starting planning phase', { task: taskDescription });
    
    const prompt = buildPlannerUserPrompt(taskDescription);
    const systemPrompt = PLANNER_SYSTEM_PROMPT;
    
    this.logger.request(`Prompting ${this.provider.name} (${this.provider.model})`, { systemPrompt, prompt });
    
    try {
      const response = await this.provider.generate({ systemPrompt, prompt });
      this.logger.response('Received plan from provider', { responseText: response.text });
      return response.text;
    } catch (error: any) {
      this.logger.error('Failed to generate plan', { error: error.message });
      throw error;
    }
  }
}
