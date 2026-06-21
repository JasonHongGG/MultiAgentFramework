import * as dotenv from 'dotenv';
import { AgentFactory } from './agents/AgentFactory';

// Load environment variables from .env
dotenv.config();

async function main() {
  console.log('--- Multi-Agent Framework Test ---');
  
  try {
    // Instantiate the 'example' agent using the factory.
    // The factory reads process.env to decide which provider to use (e.g. Ollama, Vertex, GeminiFlow).
    const agent = AgentFactory.createAgent('example');
    
    console.log(`Agent '${agent.name}' created successfully.`);
    console.log(`Using Provider: ${process.env.AGENT_EXAMPLE_PROVIDER}`);
    
    // We can execute the agent
    const input = 'What are three key principles of a good software architecture?';
    console.log(`\nSending prompt to agent: "${input}"`);
    
    // If you don't have Ollama running locally, this will fail with a connection error,
    // but it will prove the architecture and logging mechanism works.
    const result = await agent.execute(input);
    
    console.log('\n--- Agent Response ---');
    console.log(result);
    console.log('----------------------\n');
    console.log('Check the /logs folder to see the generated execution log!');

  } catch (error: any) {
    console.error('\nError during test execution:');
    console.error(error.message);
    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      console.log('\nNote: It seems the configured provider (e.g., Ollama at localhost:11434) is not running.');
      console.log('The architecture is working, but it cannot reach the LLM backend.');
    }
  }
}

main();
