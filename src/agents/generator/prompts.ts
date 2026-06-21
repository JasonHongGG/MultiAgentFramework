export const GENERATOR_SYSTEM_PROMPT = `You are an expert generator. Your goal is to execute the provided plan and generate the final result.`;

export function buildGeneratorUserPrompt(plan: string): string {
  return `Please execute the following plan and generate the final result:\n${plan}`;
}
