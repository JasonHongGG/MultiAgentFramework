import { AIProvider } from '../AIProvider';
import { GenerateRequest, GenerateResponse, GenerateStreamChunk } from '../../types';

export class OllamaProvider implements AIProvider {
  public readonly name = 'ollama';
  private endpoint: string;

  constructor(public readonly model: string, baseUrl: string = 'http://localhost:11434') {
    this.endpoint = `${baseUrl.replace(/\/$/, '')}/api/generate`;
  }

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const payload = {
      model: this.model,
      prompt: request.prompt,
      system: request.systemPrompt,
      stream: false,
      options: {
        temperature: request.temperature ?? 0.7,
        num_predict: request.maxTokens,
      }
    };

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;

      return {
        text: data.response,
        metadata: {
          provider: this.name,
          model: this.model,
          raw_response: data,
        },
      };
    } catch (error) {
      console.error('Ollama Provider Error:', error);
      throw error;
    }
  }

  async *generateStream(request: GenerateRequest): AsyncGenerator<GenerateStreamChunk, void, unknown> {
    const payload = {
      model: this.model,
      prompt: request.prompt,
      system: request.systemPrompt,
      stream: true,
      options: {
        temperature: request.temperature ?? 0.7,
        num_predict: request.maxTokens,
      }
    };

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is missing.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          
          try {
            const data = JSON.parse(trimmed);
            yield {
              text: data.response || '',
              isFinished: data.done,
              usage: data.done ? {
                promptTokens: data.prompt_eval_count || 0,
                completionTokens: data.eval_count || 0,
                totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
              } : undefined,
              metadata: {
                provider: this.name,
                model: this.model,
              }
            };
          } catch (e) {
            // ignore JSON parse error
          }
        }
      }
    } catch (error) {
      console.error('Ollama Provider Stream Error:', error);
      throw error;
    }
  }
}
