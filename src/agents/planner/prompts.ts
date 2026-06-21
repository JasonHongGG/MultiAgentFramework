export const PLANNER_SYSTEM_PROMPT = `You are an expert planner. Your goal is to create a step-by-step plan for the user's task. Be concise and structured.`;

export function buildPlannerUserPrompt(taskDescription: string): string {
  return `Please create a detailed step-by-step plan for the following task:\n${taskDescription}`;
}
