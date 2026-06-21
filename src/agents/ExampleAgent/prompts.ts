/**
 * System prompt for the ExampleAgent.
 */
export const buildSystemPrompt = (context?: string): string => {
  if (context) {
    return context;
  }
  return `You are a helpful AI assistant in the Multi-Agent Framework. 
Answer concisely and clearly. Focus on accuracy.`;
};

/**
 * User prompt builder for the ExampleAgent.
 */
export const buildUserPrompt = (input: string): string => {
  return `Please process the following request carefully:\n\n${input}`;
};
