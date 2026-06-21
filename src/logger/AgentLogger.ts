import * as fs from 'fs/promises';
import * as path from 'path';

export class AgentLogger {
  private logDir: string;

  constructor(private name: string) {
    // Determine the project root assuming this file is in src/logger/
    const projectRoot = path.resolve(__dirname, '../../');
    this.logDir = path.join(projectRoot, '.runtime', 'logs');
  }

  private async ensureLogDir() {
    try {
      await fs.access(this.logDir);
    } catch {
      await fs.mkdir(this.logDir, { recursive: true });
    }
  }

  private async writeLog(level: string, message: string, data?: any) {
    try {
      await this.ensureLogDir();
      const now = new Date();
      
      // Format YYYYMMDD_HHMMSS
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
      
      // Random ID to prevent collisions
      const randomId = Math.random().toString(36).substring(2, 8);
      
      // agentName_YYYYMMDD_HHMMSS_randomId.json
      const fileName = `${this.name}_${timestamp}_${randomId}.json`;
      const filePath = path.join(this.logDir, fileName);

      const logEntry = {
        agentName: this.name,
        timestamp: now.toISOString(),
        level,
        message,
        ...data
      };

      await fs.writeFile(filePath, JSON.stringify(logEntry, null, 2), 'utf-8');
      
    } catch (err) {
      console.error(`[${this.name}] Failed to write log to file:`, err);
    }
  }

  logExecution(request: any, response: any, metadata: any = {}) {
    // Fire and forget (asynchronous logging)
    this.writeLog('EXECUTION', 'Agent execution completed', {
      request,
      response,
      metadata
    }).catch(console.error);
  }

  info(message: string, ...args: any[]) {
    console.log(`[${this.name}] INFO: ${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(`[${this.name}] WARN: ${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(`[${this.name}] ERROR: ${message}`, ...args);
    // Write errors to file as well
    this.writeLog('ERROR', message, { args }).catch(console.error);
  }

  debug(message: string, ...args: any[]) {
    console.debug(`[${this.name}] DEBUG: ${message}`, ...args);
  }
}
