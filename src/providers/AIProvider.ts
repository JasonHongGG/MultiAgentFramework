import { GenerateRequest, GenerateResponse, GenerateStreamChunk } from '../types';

export interface AIProvider {
  readonly name: string;
  generate(request: GenerateRequest): Promise<GenerateResponse>;
  generateStream?(request: GenerateRequest): AsyncGenerator<GenerateStreamChunk, void, unknown>;
}
