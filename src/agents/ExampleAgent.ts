import { BaseAgent } from './BaseAgent';
import { AIProvider } from '../providers/AIProvider';

export class ExampleAgent extends BaseAgent {
  constructor(provider: AIProvider) {
    // Call the base constructor with a specific agent name
    super('ExampleAgent', provider);
  }

  /**
   * A simple example execution method.
   * In a real agent, this might involve complex prompts, parsing JSON output,
   * retries, etc.
   */
  async execute(input: string, systemContext?: string): Promise<string> {
    const systemPrompt = systemContext || "You are a helpful AI assistant. Answer concisely.";
    const prompt = `Please process the following request:\n${input}`;

    this.logger.info(`Starting execution for input: "${input.substring(0, 30)}..."`);

    try {
      const response = await this.provider.generate({
        prompt,
        systemPrompt,
        temperature: 0.7,
        maxTokens: 1000,
      });

      this.logger.info('Received response successfully.');
      
      // Log the execution to a file
      this.logger.logExecution(
        { prompt, systemPrompt },
        { text: response.text },
        response.metadata
      );

      return response.text;

    } catch (error: any) {
      this.logger.error('Failed to execute agent:', error);
      throw error;
    }
  }
}
