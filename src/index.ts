import 'dotenv/config';
import { AgentFactory } from './factory/AgentFactory';

async function main() {
  console.log('=== Multi-Agent Framework Started ===\n');

  // 1. Create Agents via Factory (Dependencies are injected based on .env)
  const planner = AgentFactory.createPlanner();
  const generator = AgentFactory.createGenerator();

  const taskDescription = "Write a hello world program in Python.";

  try {
    // 2. Execute Planner
    console.log('--- Executing Planner ---');
    const plan = await planner.execute(taskDescription);
    console.log(`\nPlanner Output:\n${plan}\n`);

    // 3. Execute Generator
    console.log('--- Executing Generator ---');
    const result = await generator.execute(plan);
    console.log(`\nGenerator Output:\n${result}\n`);

    console.log('=== Multi-Agent Framework Finished ===');
    console.log('Check the "logs" directory for isolated agent logs.');
  } catch (error) {
    console.error('Execution failed:', error);
  }
}

main();
