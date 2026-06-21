import * as fs from 'fs';
import * as path from 'path';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

export interface LogEntry {
  type: 'request' | 'response' | 'info' | 'error';
  message: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

export class AgentLogger {
  private logFilePath: string;

  constructor(public agentName: string) {
    // Format: 目標名稱_yyyymmdd_hhmmss_自行設計
    const timestamp = dayjs().format('YYYYMMDD_HHmmss');
    const uuid = uuidv4().substring(0, 8); // short uuid
    const filename = `${agentName}_${timestamp}_${uuid}.log`;
    
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    this.logFilePath = path.join(logsDir, filename);
  }

  private write(entry: LogEntry) {
    const timestamp = dayjs().toISOString();
    const logData = JSON.stringify({
      timestamp,
      type: entry.type,
      message: entry.message,
      metadata: entry.metadata,
    });
    fs.appendFileSync(this.logFilePath, logData + '\n');
  }

  request(message: string, metadata?: Record<string, any>) {
    this.write({ type: 'request', message, metadata });
    console.log(`[${this.agentName}] REQUEST: ${message}`);
  }

  response(message: string, metadata?: Record<string, any>) {
    this.write({ type: 'response', message, metadata });
    console.log(`[${this.agentName}] RESPONSE: ${message}`);
  }

  info(message: string, metadata?: Record<string, any>) {
    this.write({ type: 'info', message, metadata });
    console.log(`[${this.agentName}] INFO: ${message}`);
  }

  error(message: string, metadata?: Record<string, any>) {
    this.write({ type: 'error', message, metadata });
    console.error(`[${this.agentName}] ERROR: ${message}`);
  }
}
