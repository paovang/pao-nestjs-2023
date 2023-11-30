export interface ILogger {
    log(message: string, context?: Record<string, unknown>): void;
  
    error(
      message: string,
      trace?: string,
      context?: Record<string, unknown>,
    ): void;
  
    warn(message: string, context?: Record<string, unknown>): void;
  
    debug(message: string, context?: Record<string, unknown>): void;
  
    verbose(message: string, context?: Record<string, unknown>): void;
}