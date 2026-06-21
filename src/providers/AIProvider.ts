import { GenerateRequest, GenerateResponse } from '../types';

export interface AIProvider {
  /**
   * Provider's name identifier (e.g., 'gemini', 'ollama', 'vertex')
   */
  readonly name: string;

  /**
   * Target model used by this provider (e.g., 'gemini-1.5-pro')
   */
  readonly model: string;

  /**
   * Generates a text response from the underlying AI model.
   */
  generate(request: GenerateRequest): Promise<GenerateResponse>;
}
