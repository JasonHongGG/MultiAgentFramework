import { AIProvider } from '../AIProvider';
import { GenerateRequest, GenerateResponse, GenerateStreamChunk } from '../../types';
import { VertexAI, FinishReason } from '@google-cloud/vertexai';

export class VertexAIProvider implements AIProvider {
  public readonly name = 'VertexAI';

  constructor(
    private model: string,
    private projectId: string,
    private region: string,
    private accessToken: string
  ) {}

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const vertex_ai = new VertexAI({
      project: this.projectId,
      location: this.region,
    });
    // Assuming the user handles authentication externally or through standard Google Cloud Auth.
    // If accessToken must be used explicitly, the SDK's GoogleAuth can be configured, 
    // but typically the default auth mechanism is preferred.

    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: this.model,
      generationConfig: {
        temperature: request.temperature ?? 0.2,
        maxOutputTokens: request.maxTokens ?? 3000,
      },
      ...(request.systemPrompt ? { systemInstruction: { role: 'system', parts: [{ text: request.systemPrompt }] } } : {}),
    });

    try {
      const responseStream = await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: request.prompt }] }],
      });
      const response = await responseStream.response;

      const candidate = response.candidates?.[0];
      if (!candidate || !candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('Unexpected Vertex AI response format: missing content parts.');
      }

      const text = candidate.content.parts[0]?.text || '';
      const usageMetadata = response.usageMetadata || {};

      return {
        text,
        usage: {
          promptTokens: usageMetadata.promptTokenCount || 0,
          completionTokens: usageMetadata.candidatesTokenCount || 0,
          totalTokens: usageMetadata.totalTokenCount || 0,
        },
        metadata: {
          provider: this.name,
          model: this.model,
          projectId: this.projectId,
          region: this.region
        }
      };
    } catch (error: any) {
      console.error('Vertex AI Provider Error:', error);
      throw error;
    }
  }

  async *generateStream(request: GenerateRequest): AsyncGenerator<GenerateStreamChunk, void, unknown> {
    const vertex_ai = new VertexAI({
      project: this.projectId,
      location: this.region,
    });

    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: this.model,
      generationConfig: {
        temperature: request.temperature ?? 0.2,
        maxOutputTokens: request.maxTokens ?? 3000,
      },
      ...(request.systemPrompt ? { systemInstruction: { role: 'system', parts: [{ text: request.systemPrompt }] } } : {}),
    });

    try {
      const streamingResp = await generativeModel.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: request.prompt }] }],
      });

      for await (const chunk of streamingResp.stream) {
        const candidate = chunk.candidates?.[0];
        const textChunk = candidate?.content?.parts?.[0]?.text || '';
        const isFinished = candidate?.finishReason && candidate.finishReason !== FinishReason.FINISH_REASON_UNSPECIFIED;
        const usageMetadata = chunk.usageMetadata;

        yield {
          text: textChunk,
          isFinished: !!isFinished,
          ...(usageMetadata ? {
            usage: {
              promptTokens: usageMetadata.promptTokenCount || 0,
              completionTokens: usageMetadata.candidatesTokenCount || 0,
              totalTokens: usageMetadata.totalTokenCount || 0,
            }
          } : {}),
          metadata: {
            provider: this.name,
            model: this.model,
            projectId: this.projectId,
            region: this.region
          }
        };
      }
    } catch (error: any) {
      console.error('Vertex AI Provider Stream Error:', error);
      throw error;
    }
  }
}
