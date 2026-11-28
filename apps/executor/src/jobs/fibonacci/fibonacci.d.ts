declare module 'fibonacci' {
  import { EventEmitter } from 'events';

  /**
   * The result object emitted by the `result` and `done` events,
   * and returned by `iterate()` when given a max_iterations.
   */
  interface FibonacciResult {
    /** The calculated Fibonacci number as a string (supports arbitrary size). */
    number: string;
    /** Number of digits in the number (as a string, per the module). */
    length: string;
    /** Amount of iterations used to find the number (as a string). */
    iterations: string;
    /** Duration in milliseconds. */
    ms: number;
  }

  interface Fibonacci extends EventEmitter {
    /**
     * Run the Fibonacci iteration.
     *
     * @param max_iterations Limit iterations; otherwise continue forever
     *                       until `kill()` is called.
     * @returns The result object (when `max_iterations` is provided).
     */
    iterate(max_iterations?: number): FibonacciResult;

    /** Stop the iteration loop. */
    kill(): void;

    // Event overloads
    on(event: 'result', listener: (result: FibonacciResult) => void): this;
    on(event: 'done', listener: (result: FibonacciResult) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;

    once(event: 'result', listener: (result: FibonacciResult) => void): this;
    once(event: 'done', listener: (result: FibonacciResult) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;

    emit(event: 'result', result: FibonacciResult): boolean;
    emit(event: 'done', result: FibonacciResult): boolean;
    emit(event: string | symbol, ...args: any[]): boolean;
  }

  const fibonacci: Fibonacci;
  export = fibonacci;
}
