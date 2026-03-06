/**
 * Async composition helpers: pipeAsync, composeAsync.
 * @internal
 */

// ============================================================================
// ASYNC COMPOSITION
// ============================================================================

/**
 * Composes async functions left-to-right, returning a **new function** (point-free).
 * This is the async equivalent of `flow`, not `pipe` — it does not accept a value
 * directly; instead it returns a function that you call with the initial value.
 *
 * Use `flowAsync` as a self-documenting alias if you prefer the `flow` naming:
 *
 * @example
 * const fetchUser = async (id: string) => ({ id, name: 'Alice' });
 * const getEmail = async (user: { email: string }) => user.email;
 * const sendEmail = async (email: string) => console.log(`Sent to ${email}`);
 *
 * // pipeAsync — point-free (returns a function)
 * const process = pipeAsync(fetchUser, getEmail, sendEmail);
 * await process('user-123');
 *
 * // flowAsync — identical behaviour, explicit name
 * const process2 = flowAsync(fetchUser, getEmail, sendEmail);
 * await process2('user-123');
 */
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
export function pipeAsync<A, B, C, D, E, F, G, H>(
  fn1: (a: A) => Promise<B>,
  fn2: (b: B) => Promise<C>,
  fn3: (c: C) => Promise<D>,
  fn4: (d: D) => Promise<E>,
  fn5: (e: E) => Promise<F>,
  fn6: (f: F) => Promise<G>,
  fn7: (g: G) => Promise<H>
): (a: A) => Promise<H>;
export function pipeAsync<A, B, C, D, E, F, G, H, I>(
  fn1: (a: A) => Promise<B>,
  fn2: (b: B) => Promise<C>,
  fn3: (c: C) => Promise<D>,
  fn4: (d: D) => Promise<E>,
  fn5: (e: E) => Promise<F>,
  fn6: (f: F) => Promise<G>,
  fn7: (g: G) => Promise<H>,
  fn8: (h: H) => Promise<I>
): (a: A) => Promise<I>;
export function pipeAsync<A, B, C, D, E, F, G, H, I, J>(
  fn1: (a: A) => Promise<B>,
  fn2: (b: B) => Promise<C>,
  fn3: (c: C) => Promise<D>,
  fn4: (d: D) => Promise<E>,
  fn5: (e: E) => Promise<F>,
  fn6: (f: F) => Promise<G>,
  fn7: (g: G) => Promise<H>,
  fn8: (h: H) => Promise<I>,
  fn9: (i: I) => Promise<J>
): (a: A) => Promise<J>;
export function pipeAsync<A, B, C, D, E, F, G, H, I, J, K>(
  fn1: (a: A) => Promise<B>,
  fn2: (b: B) => Promise<C>,
  fn3: (c: C) => Promise<D>,
  fn4: (d: D) => Promise<E>,
  fn5: (e: E) => Promise<F>,
  fn6: (f: F) => Promise<G>,
  fn7: (g: G) => Promise<H>,
  fn8: (h: H) => Promise<I>,
  fn9: (i: I) => Promise<J>,
  fn10: (j: J) => Promise<K>
): (a: A) => Promise<K>;
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
 * Self-documenting alias for {@link pipeAsync}.
 * Use when you want to make it clear you are building a point-free async pipeline,
 * mirroring the sync `flow` / `pipe` naming convention.
 *
 * @example
 * const process = flowAsync(fetchUser, enrichUser, formatUser);
 * await process('user-123');
 */
export const flowAsync = pipeAsync;

/**
 * Async version of `compose` — composes async functions right to left.
 *
 * @example
 * const process = composeAsync(formatUser, enrichUser, fetchUser);
 * await process('user-123');
 */
export const composeAsync = (...fns: Array<(arg: unknown) => Promise<unknown>>) =>
  pipeAsync(...([...fns].reverse() as [(typeof fns)[0]]));
