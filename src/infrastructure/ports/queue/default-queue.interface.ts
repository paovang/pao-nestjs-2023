export interface IDefualtQueue<Payload> {
    addJob(jobName: string, data: Payload, cacheTTL?: number): Promise<void>;
}