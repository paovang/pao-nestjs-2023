import { Request } from 'express';

export interface ICache<T> {
  get(key: string): Promise<T | undefined>;

  set(key: string, value: T, ttl?: number): Promise<void>;

  delete(pattern: string): Promise<void>;

  clearCache(): Promise<void>;

  generateCacheKey(table: string, request: Request): string;

  generateNotificationIdentifier(
    type: string,
    title: string,
    message: string,
    recipient: string,
  ): string;

  generateJobIdentifier(jobName: string, data: any): string;
}