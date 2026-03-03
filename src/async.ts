/**
 * Async composition and Promise utilities.
 * @module async
 */

import { Ok, Err, type Result } from './result.js';

// ============================================================================
// ASYNC COMPOSITION
// ============================================================================

/**
 * Async version of `pipe` — composes async functions left to right.
 *
 * @example
 * const fetchUser = async (id: string) => ({ id, name: 'Alice' });
 * const getEmail = async (user: { email: string }) => user.email;
 * const sendEmail = async (email: string) => console.log(`Sent to ${email}`);
 *
 * await pipeAsync(fetchUser, getEmail, sendEmail)('user-123');
 */
/* eslint-disable no-redeclare */
export function pipeAsync<A, B>(fn1: (a: A) => Promise<B>): (a: A) => Promise<B>;
export function pipeAsync<A, B, C>(
  fn1: (a: A) => Promise<B>,
  fn2: (b: B) => Promise<C>
): (a: A) => Promise<C>;
export function pipeAsync<A, B, C, D>(
  fn1: (a: A) => Promise<B>,
  fn2: (b: B) => Promise<C>,
  fn3: (c: C) => Promise<D>
): (a: A) => Promise<D>;
export function pipeAsync<A, B, C, D, E>(
  fn1: (a: A) => Promise<B>,
  fn2: (b: B) => Promise<C>,
  fn3: (c: C) => Promise<D>,
  fn4: (d: D) => Promise<E>
): (a: A) => Promise<E>;
export function pipeAsync<A, B, C, D, E, F>(
  fn1: (a: A) => Promise<B>,
  fn2: (b: B) => Promise<C>,
  fn3: (c: C) => Promise<D>,
  fn4: (d: D) => Promise<E>,
  fn5: (e: E) => Promise<F>
): (a: A) => Promise<F>;
export function pipeAsync<A, B, C, D, E, F, G>(
  fn1: (a: A) => Promise<B>,
  fn2: (b: B) => Promise<C>,
  fn3: (c: C) => Promise<D>,
  fn4: (d: D) => Promise<E>,
  fn5: (e: E) => Promise<F>,
  fn6: (f: F) => Promise<G>
): (a: A) => Promise<G>;
export function pipeAsync(
  ...fns: Array<(arg: unknown) => Promise<unknown>>
): (value: unknown) => Promise<unknown> {
  return async (value: unknown): Promise<unknown> => {
    let result: unknown = value;
    for (const fn of fns) {
      result = await fn(result);
    }
    return result;
  };
}

/**
 * Async version of `compose` — composes async functions right to left.
 *
 * @example
 * const process = composeAsync(formatUser, enrichUser, fetchUser);
 * await process('user-123');
 */
export const composeAsync = (...fns: Array<(arg: unknown) => Promise<unknown>>) =>
  pipeAsync(...([...fns].reverse() as [(typeof fns)[0]]));

// ============================================================================
// ASYNC ARRAY TRANSFORMATIONS
// ============================================================================

/**
 * Applies an async function to each element sequentially (curried, data-last).
 *
 * @example
 * const fetchUserDetails = async (id: string) => ({ id, name: 'Alice' });
 * await mapAsync(fetchUserDetails)(['1', '2', '3']);
 */
export const mapAsync =
  <T, R>(fn: (item: T) => Promise<R>) =>
  async (arr: T[]): Promise<R[]> => {
    const results: R[] = [];
    for (const item of arr) {
      results.push(await fn(item));
    }
    return results;
  };

/**
 * Applies an async function to all elements in parallel (curried, data-last).
 *
 * @example
 * const fetchUser = async (id: string) => ({ id, name: 'Alice' });
 * await mapParallel(fetchUser)(['1', '2', '3']);
 */
export const mapParallel =
  <T, R>(fn: (item: T) => Promise<R>) =>
  async (arr: T[]): Promise<R[]> =>
    Promise.all(arr.map(fn));

/**
 * Applies an async function with a concurrency limit (curried, data-last).
 *
 * @example
 * const fetchUser = async (id: string) => ({ id, name: 'Alice' });
 * // Processes 5 at a time
 * await mapConcurrent(5, fetchUser)(['1', '2', '3', '4', '5', '6']);
 */
export const mapConcurrent =
  <T, R>(concurrency: number, fn: (item: T) => Promise<R>) =>
  async (arr: T[]): Promise<R[]> => {
    const results: R[] = new Array(arr.length);
    const executing = new Set<Promise<void>>();

    for (const [index, item] of arr.entries()) {
      const promise: Promise<void> = fn(item).then(result => {
        results[index] = result;
        executing.delete(promise);
      });

      executing.add(promise);

      if (executing.size >= concurrency) {
        await Promise.race(executing);
      }
    }

    await Promise.all(executing);
    return results;
  };

/**
 * Filters an array using an async predicate sequentially (curried, data-last).
 *
 * @example
 * const isActive = async (user: { id: string }) => {
 *   const status = await fetchStatus(user.id);
 *   return status === 'active';
 * };
 * await filterAsync(isActive)(users);
 */
export const filterAsync =
  <T>(predicate: (item: T) => Promise<boolean>) =>
  async (arr: T[]): Promise<T[]> => {
    const results: T[] = [];
    for (const item of arr) {
      if (await predicate(item)) {
        results.push(item);
      }
    }
    return results;
  };

/**
 * Reduces an array with an async reducer sequentially (curried, data-last).
 *
 * @example
 * const sumBalances = async (acc: number, user: { id: string }) => {
 *   const balance = await fetchBalance(user.id);
 *   return acc + balance;
 * };
 * await reduceAsync(sumBalances, 0)(users);
 */
export const reduceAsync =
  <T, R>(fn: (acc: R, item: T) => Promise<R>, initial: R) =>
  async (arr: T[]): Promise<R> => {
    let result = initial;
    for (const item of arr) {
      result = await fn(result, item);
    }
    return result;
  };

// ============================================================================
// PROMISE UTILITIES
// ============================================================================

/**
 * Retries an async function with exponential backoff.
 * Returns `Result<T, Error>` — never throws.
 *
 * @example
 * const result = await retry(3, 1000)(fetchData); // 3 attempts, 1s base delay
 * if (!result.ok) console.error(result.error.message);
 */
export const retry =
  <T>(maxAttempts: number, delayMs: number = 1000, backoff: number = 2) =>
  async (fn: () => Promise<T>): Promise<Result<T, Error>> => {
    let lastError: Error = new Error('no attempts made');

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const value = await fn();
        return Ok(value);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        if (attempt < maxAttempts) {
          const delay = delayMs * Math.pow(backoff, attempt - 1);
          await sleep(delay);
        }
      }
    }

    return Err(lastError);
  };

/**
 * Races a promise against a timeout, rejecting if the deadline is exceeded.
 *
 * @example
 * const slowFetch = async () => fetch('/slow-endpoint');
 * await timeout(5000)(slowFetch()); // rejects if it takes more than 5s
 */
export const timeout =
  <T>(ms: number) =>
  async (promise: Promise<T>): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    });

    return Promise.race([promise, timeoutPromise]);
  };

/**
 * Resolves after a given number of milliseconds.
 *
 * @example
 * await sleep(1000); // waits 1 second
 */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Returns a debounced version of an async function.
 * Only executes after the specified delay has elapsed since the last call.
 *
 * @example
 * const saveData = debounceAsync(500)(async (data: string) => {
 *   await api.save(data);
 * });
 *
 * // Only the last call within 500ms will execute
 * saveData('a');
 * saveData('b');
 * saveData('c'); // only this one runs
 */
export const debounceAsync =
  <T extends unknown[], R>(delayMs: number) =>
  (fn: (...args: T) => Promise<R>) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let latestResolve: ((value: R) => void) | null = null;
    let latestReject: ((error: unknown) => void) | null = null;

    return (...args: T): Promise<R> => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      return new Promise<R>((resolve, reject) => {
        latestResolve = resolve;
        latestReject = reject;

        timeoutId = setTimeout(async () => {
          try {
            const result = await fn(...args);
            latestResolve?.(result);
          } catch (error) {
            latestReject?.(error);
          }
        }, delayMs);
      });
    };
  };

/**
 * Returns a throttled version of an async function.
 * At most one execution per delay window; subsequent calls within the window
 * return the pending promise from the active execution.
 *
 * @example
 * const logEvent = throttleAsync(1000)(async (event: string) => {
 *   await api.log(event);
 * });
 *
 * // At most 1 call per second
 * logEvent('click'); // executes
 * logEvent('click'); // returns same promise
 */
export const throttleAsync =
  <T extends unknown[], R>(delayMs: number) =>
  (fn: (...args: T) => Promise<R>) => {
    let lastExecution = 0;
    let pending: Promise<R> | null = null;

    return async (...args: T): Promise<R> => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecution;

      if (timeSinceLastExecution >= delayMs) {
        lastExecution = now;
        pending = fn(...args);
        return pending;
      }

      if (pending) {
        return pending;
      }

      pending = fn(...args);
      return pending;
    };
  };

/**
 * Memoizes an async function. Returns `Result<T, Error>` — never rethrows.
 * Cached results are returned on subsequent calls with the same arguments.
 *
 * @example
 * const fetchUser = memoizeAsync(async (id: string) => api.getUser(id));
 *
 * const r1 = await fetchUser('123'); // network call -> Ok(user)
 * const r2 = await fetchUser('123'); // cached       -> Ok(user)
 */
export const memoizeAsync = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyFn: (...args: T) => string = (...args) => JSON.stringify(args)
) => {
  const cache = new Map<string, R>();

  return async (...args: T): Promise<Result<R, Error>> => {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return Ok(cache.get(key)!);
    }

    try {
      const result = await fn(...args);
      cache.set(key, result);
      return Ok(result);
    } catch (err) {
      return Err(err instanceof Error ? err : new Error(String(err)));
    }
  };
};

/**
 * Executes an array of async thunks sequentially, collecting results.
 *
 * @example
 * const tasks = [
 *   async () => 'task 1 done',
 *   async () => 'task 2 done',
 * ];
 * await sequence(tasks); // ['task 1 done', 'task 2 done']
 */
export const sequence = async <T>(fns: Array<() => Promise<T>>): Promise<T[]> => {
  const results: T[] = [];
  for (const fn of fns) {
    results.push(await fn());
  }
  return results;
};

/**
 * Executes an array of async thunks in parallel, collecting results.
 *
 * @example
 * const tasks = [
 *   async () => fetchUser('1'),
 *   async () => fetchUser('2'),
 *   async () => fetchUser('3'),
 * ];
 * await parallel(tasks);
 */
export const parallel = async <T>(fns: Array<() => Promise<T>>): Promise<T[]> =>
  Promise.all(fns.map(fn => fn()));
