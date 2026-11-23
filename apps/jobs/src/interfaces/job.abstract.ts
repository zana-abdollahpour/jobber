export abstract class AbstractJob {
  public abstract execute(...args: unknown[]): Promise<unknown>;
}
