import { REDIS_CLIENT } from '../../../../common/configurations/cache.config';
import { ICache } from '../../../ports/cache/cache.interface';
import * as msgpack from '@msgpack/msgpack';
import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Request } from 'express';
import Redis from 'ioredis';

@Injectable()
/**
 * Utility service for caching operations. Provides methods for fetching,
 * setting, and deleting cache entries, as well as generating cache keys.
 */
export class CacheService implements ICache<any> {
  constructor(@Inject(REDIS_CLIENT) private readonly cache: Redis) {}

  /**
   * Fetches a cache entry by key.
   *
   * @param key The cache key.
   * @returns A Promise containing the cached value or undefined.
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const encodedValue = await this.cache.getBuffer(key);
      if (encodedValue) {
        return msgpack.decode(encodedValue) as T;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets a cache entry.
   *
   * @param key The cache key.
   * @param value The value to cache.
   * @param ttl Time to live (optional) for the cache entry (millisecond).
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const encodedValue = Buffer.from(msgpack.encode(value));
      if (ttl) {
        await this.cache.set(key, encodedValue, 'PX', ttl);
      } else {
        await this.cache.set(key, encodedValue);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a cache entry by key.
   *
   * @param pattern The cache key.
   */
  async delete(pattern: string): Promise<void> {
    try {
      let cursor = '0';
      const keys = [];
      do {
        const res = await this.cache.scan(
          cursor,
          'MATCH',
          `*${pattern}*`,
          'COUNT',
          '100',
        );
        if (Array.isArray(res) && res.length === 2) {
          keys.push(...res[1]);
          cursor = res[0];
        }
      } while (cursor !== '0');

      if (keys.length > 0) {
        const pipeline = this.cache.pipeline();
        for (const key of keys) {
          pipeline.unlink(key);
        }
        await pipeline.exec();
      }
    } catch (error) {
      throw error;
    }
  }

  async clearCache(): Promise<void> {
    try {
      await this.cache.flushdb();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generates a cache key based on the resource name and request data.
   *
   * @param resource The resource name.
   * @param request The Express request object.
   * @returns The generated cache key.
   */
  generateCacheKey(resource: string, request: Request): string {
    const sortedQueryString = this.getSortedQueryString(request);
    const headersString = this.getHeadersString(request);
    const localeString = this.getLocaleString(request);
    const hashInput = sortedQueryString + headersString + localeString;
    const hash = this.generateHash(hashInput);
    return `${resource}_${hash}`;
  }

  /**
   * Sorts the query parameters from the request in alphabetical order and returns them as a query string.
   *
   * @param request The Express request object.
   * @returns A sorted query string.
   */
  private getSortedQueryString(request: Request): string {
    const sortedFilter = Object.fromEntries(
      Object.entries(request.query).sort((a, b) => a[0].localeCompare(b[0])),
    );
    return new URLSearchParams(
      sortedFilter as Record<string, string>,
    ).toString();
  }

  /**
   * Extracts relevant headers from the request that could affect the response.
   *
   * @param request The Express request object.
   * @returns A string representation of relevant headers.
   */
  private getHeadersString(request: Request): string {
    const relevantHeaders = {
      Accept: request.headers.accept,
    };
    return JSON.stringify(relevantHeaders);
  }

  /**
   * Extracts the locale information from the request headers.
   *
   * @param request The Express request object.
   * @returns A query string with the locale information.
   */
  private getLocaleString(request: Request): string {
    const rawLocale = request.headers.locale;
    const localeValue = Array.isArray(rawLocale)
      ? (rawLocale as string[])[0] ?? ''
      : rawLocale ?? '';
    return new URLSearchParams({ locale: localeValue }).toString();
  }

  /**
   * Generates a sha256 hash for a given input string.
   *
   * @param input The string to be hashed.
   * @returns The generated hash.
   */
  private generateHash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Generate an identifier to prevent duplicate notify
   * @param type
   * @param title
   * @param message
   * @param recipient
   */
  generateNotificationIdentifier(
    type: string,
    title: string,
    message: string,
    recipient: string,
  ): string {
    return crypto
      .createHash('sha256')
      .update(`${type}_${title}_${message}_${recipient}`)
      .digest('hex');
  }

  /**
   * Generate an identifier to prevent duplicate job
   * @param jobName
   * @param data
   */
  generateJobIdentifier(jobName: string, data: any): string {
    return crypto
      .createHash('sha256')
      .update(`${jobName}_${JSON.stringify(data)}`)
      .digest('hex');
  }
}