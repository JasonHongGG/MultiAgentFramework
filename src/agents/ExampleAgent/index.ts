import { BaseAgent } from '../BaseAgent';
import { AIProvider } from '../../providers/AIProvider';
import { buildSystemPrompt, buildUserPrompt } from './prompts';

export class ExampleAgent extends BaseAgent {
  constructor(provider: AIProvider) {
    super('ExampleAgent', provider);
  }

  /**
   * Example execution method.
   */
  async execute(input: string, systemContext?: string): Promise<string> {
    const systemPrompt = buildSystemPrompt(systemContext);
    const prompt = buildUserPrompt(input);

    this.logger.info(`Starting execution for input: "${input.substring(0, 30)}..."`);

    // Track execution time
    const startTime = performance.now();

    try {
      const response = await this.provider.generate({
        prompt,
        systemPrompt,
        temperature: 0.7,
        maxTokens: 1000,
      });

      const executionTimeMs = performance.now() - startTime;
      this.logger.info(`Received response successfully in ${Math.round(executionTimeMs)}ms.`);
      
      // Inject execution time into metadata
      const executionMetadata = {
        ...(response.metadata || {}),
        executionTimeMs: Math.round(executionTimeMs)
      };

      // Log the execution to a file
      this.logger.logExecution(
        { prompt, systemPrompt },
        { text: response.text },
        executionMetadata
      );

      return response.text;

    } catch (error: any) {
      const executionTimeMs = performance.now() - startTime;
      this.logger.error(`Failed to execute agent after ${Math.round(executionTimeMs)}ms:`, error);
      throw error;
    }
  }
}
