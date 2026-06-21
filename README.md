# Multi-Agent Framework

This project defines a strict, modular, and extensible architecture for building Multi-Agent systems using TypeScript and Node.js. It isolates AI provider implementations from Agent logic, separating concerns to allow easy swapping and scaling of AI components.

## Architecture Rules & Guidelines

### 1. Interfaces & Abstraction
The framework relies on two primary abstractions:
- **`AIProvider` (`src/providers/AIProvider.ts`)**: The interface defining how to communicate with an LLM backend. All AI interactions must pass through the `generate` method.
- **`BaseAgent` (`src/agents/BaseAgent.ts`)**: The abstract base class defining an Agent. All agents must implement the `execute` method and use the injected `AIProvider` for AI capabilities.

### 2. The Factory Pattern
Agents and Providers are instantiated exclusively via Factories. This allows environment-based configuration without altering business logic.
- **`ProviderFactory`**: Reads `.env` to determine which provider class to instantiate.
- **`AgentFactory`**: Reads `.env` (via the ProviderFactory) to instantiate the correct Agent and bind the corresponding Provider.

### 3. Agent Directory Structure
Every Agent must be completely self-contained within its own directory under `src/agents/`. **Do not place agent files directly in the root of `src/agents/`.**

An Agent directory MUST enforce a strict separation between **logic** and **prompts**:
```
src/agents/MyCustomAgent/
├── index.ts     # The core agent logic extending BaseAgent
└── prompts.ts   # All system prompts, templates, and text building functions
```

### 4. Provider Directory Structure
Every AI Provider must have its own directory under `src/providers/` containing its specific implementation and any associated SDK/Types.
```
src/providers/geminiflow/
├── GeminiFlowProvider.ts  # Implements AIProvider
└── sdk/                   # Any specific SDK or types required by this provider
    ├── client.ts
    └── types.ts
```

### 5. Runtime Outputs & Logging
All generated files, logs, and artifacts during execution must be stored in the `.runtime/` directory. **Do not pollute the workspace root.**

**Logging Rules:**
- The `AgentLogger` automatically manages logging.
- Log files are generated at `.runtime/logs/[AgentName]_[YYYYMMDD]_[HHMMSS]_[Hash].json`.
- A complete log must include:
  - The exact `request` (Prompt, System Prompt).
  - The exact `response` (Text generated).
  - Basic `metadata` (Model, Provider).
  - **`executionTimeMs`**: The time taken (in milliseconds) from sending the request to the AI Provider until receiving the full response. This is calculated inside the Agent and passed to the Logger.

## Getting Started

### Installation
```bash
npm install
```

### Configuration
Copy the `.env.example` to `.env` and fill in your desired Provider configurations.
```bash
cp .env.example .env
```

### Testing the Architecture
Run the test script to verify the framework and logging mechanism:
```bash
npx ts-node src/test.ts
```
After running the test, check the `.runtime/logs/` folder to see the generated JSON execution log.
