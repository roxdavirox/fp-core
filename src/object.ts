/**
 * Functional object manipulation utilities.
 * @module object
 */

// ============================================================================
// OBJECT TRANSFORMATIONS
// ============================================================================

/**
 * Returns a new object containing only the specified keys (curried, data-last).
 *
 * @example
 * const user = { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 };
 * pick(['name', 'email'])(user);
 * // { name: 'Alice', email: 'alice@example.com' }
 */
export const pick =
  <T extends object, K extends keyof T>(keys: K[]) =>
  (obj: T): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  };

/**
 * Returns a new object with the specified keys removed (curried, data-last).
 *
 * @example
 * const user = { id: 1, name: 'Alice', password: 'secret' };
 * omit(['password'])(user);
 * // { id: 1, name: 'Alice' }
 */
export const omit =
  <T extends object, K extends keyof T>(keys: K[]) =>
  (obj: T): Omit<T, K> => {
    const result = { ...obj };
    for (const key of keys) {
      delete result[key];
    }
    return result;
  };

/**
 * Shallow-merges two objects, with the override taking precedence (curried, data-last).
 *
 * @example
 * const defaults = { theme: 'dark', lang: 'en' };
 * const userPrefs = { lang: 'pt' };
 * merge(defaults)(userPrefs);
 * // { theme: 'dark', lang: 'pt' }
 */
export const merge =
  <T extends object>(base: T) =>
  <U extends object>(override: U): T & U => ({
    ...base,
    ...override,
  });

/**
 * Recursively merges two objects. Arrays are replaced, not merged (curried, data-last).
 *
 * @example
 * const obj1 = { a: 1, b: { c: 2, d: 3 } };
 * const obj2 = { b: { d: 4, e: 5 } };
 * deepMerge(obj1)(obj2);
 * // { a: 1, b: { c: 2, d: 4, e: 5 } }
 */
export const deepMerge =
  <T extends object>(base: T) =>
  <U extends object>(override: U): T & U => {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };

    for (const key in override) {
      const overrideValue = override[key];
      const baseValue = result[key];

      if (
        isObject(overrideValue) &&
        isObject(baseValue) &&
        !Array.isArray(overrideValue) &&
        !Array.isArray(baseValue)
      ) {
        result[key] = deepMerge(baseValue)(overrideValue);
      } else {
        result[key] = overrideValue;
      }
    }

    return result as T & U;
  };

/**
 * Transforms every value in an object, preserving keys (curried, data-last).
 *
 * @example
 * const prices = { apple: 10, banana: 5, orange: 8 };
 * mapValues((price: number) => price * 2)(prices);
 * // { apple: 20, banana: 10, orange: 16 }
 */
export const mapValues =
  <T extends object, R>(fn: (value: T[keyof T], key: keyof T) => R) =>
  (obj: T): Record<keyof T, R> => {
    const result = {} as Record<keyof T, R>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = fn(obj[key], key);
      }
    }
    return result;
  };

/**
 * Transforms every key in an object, preserving values (curried, data-last).
 *
 * @example
 * const obj = { first_name: 'Alice', last_name: 'Smith' };
 * mapKeys((key: string) => key.replace('_', ''))(obj);
 * // { firstname: 'Alice', lastname: 'Smith' }
 */
export const mapKeys =
  <T extends object, K extends string>(fn: (key: keyof T) => K) =>
  (obj: T): Record<K, T[keyof T]> => {
    const result = {} as Record<K, T[keyof T]>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = fn(key);
        result[newKey] = obj[key];
      }
    }
    return result;
  };

/**
 * Returns a partial object containing only entries whose key passes the predicate
 * (curried, data-last).
 *
 * @example
 * const obj = { name: 'Alice', age: 30, _internal: true };
 * filterKeys((key: string) => !key.startsWith('_'))(obj);
 * // { name: 'Alice', age: 30 }
 */
export const filterKeys =
  <T extends object>(predicate: (key: keyof T) => boolean) =>
  (obj: T): Partial<T> => {
    const result = {} as Partial<T>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && predicate(key)) {
        result[key] = obj[key];
      }
    }
    return result;
  };

/**
 * Returns a partial object containing only entries whose value passes the predicate
 * (curried, data-last).
 *
 * @example
 * const obj = { a: 1, b: null, c: 3, d: undefined };
 * filterValues((v: unknown) => v != null)(obj);
 * // { a: 1, c: 3 }
 */
export const filterValues =
  <T extends object>(predicate: (value: T[keyof T]) => boolean) =>
  (obj: T): Partial<T> => {
    const result = {} as Partial<T>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (predicate(value)) {
          result[key] = value;
        }
      }
    }
    return result;
  };

// ============================================================================
// OBJECT QUERIES
// ============================================================================

/**
 * Returns the keys of an object as a typed array.
 *
 * @example
 * keys({ a: 1, b: 2, c: 3 });
 * // ['a', 'b', 'c']
 */
export const keys = <T extends object>(obj: T): Array<keyof T> =>
  Object.keys(obj) as Array<keyof T>;

/**
 * Returns the values of an object as an array.
 *
 * @example
 * values({ a: 1, b: 2, c: 3 });
 * // [1, 2, 3]
 */
export const values = <T extends object>(obj: T): Array<T[keyof T]> => Object.values(obj);

/**
 * Returns `[key, value]` pairs for an object.
 *
 * @example
 * entries({ a: 1, b: 2 });
 * // [['a', 1], ['b', 2]]
 */
export const entries = <T extends object>(obj: T): Array<[keyof T, T[keyof T]]> =>
  Object.entries(obj) as Array<[keyof T, T[keyof T]]>;

/**
 * Reconstructs an object from an array of `[key, value]` pairs.
 *
 * @example
 * fromEntries([['a', 1], ['b', 2]]);
 * // { a: 1, b: 2 }
 */
export const fromEntries = <K extends string, V>(entries: Array<[K, V]>): Record<K, V> =>
  Object.fromEntries(entries) as Record<K, V>;

/**
 * Returns true if the given key exists in the object (curried, data-last).
 *
 * @example
 * hasKey('name')({ name: 'Alice', age: 30 }); // true
 */
export const hasKey =
  <T extends object, K extends keyof T>(key: K) =>
  (obj: T): boolean =>
    key in obj;

/**
 * Reads a value from an arbitrarily nested path. Returns `undefined` if any
 * segment along the path is missing (curried, data-last).
 *
 * @example
 * const user = { profile: { name: 'Alice' } };
 * getPath(['profile', 'name'])(user);
 * // 'Alice'
 */
export const getPath =
  <T extends object>(path: string[]) =>
  (obj: T): unknown => {
    let result: unknown = obj;
    for (const key of path) {
      if (result == null) return undefined;
      result = (result as Record<string, unknown>)[key];
    }
    return result;
  };

/**
 * Returns a new object with the value at the given path replaced.
 * Does not mutate the original (curried, data-last).
 *
 * @example
 * const user = { profile: { name: 'Alice' } };
 * setPath(['profile', 'name'], 'Bob')(user);
 * // { profile: { name: 'Bob' } }
 */
export const setPath =
  <T extends object>(path: string[], value: unknown) =>
  (obj: T): T => {
    if (path.length === 0) return obj;

    const [head, ...tail] = path;
    const currentValue = (obj as Record<string, unknown>)[head];

    if (tail.length === 0) {
      return {
        ...obj,
        [head]: value,
      } as T;
    }

    return {
      ...obj,
      [head]: setPath(tail, value)(isObject(currentValue) ? currentValue : {}),
    } as T;
  };

/**
 * Applies a function to the value at the given path and returns a new object.
 * Does not mutate the original (curried, data-last).
 *
 * @example
 * const user = { profile: { age: 30 } };
 * updatePath(['profile', 'age'], (age: number) => age + 1)(user);
 * // { profile: { age: 31 } }
 */
export const updatePath =
  <T extends object>(path: string[], fn: (value: unknown) => unknown) =>
  (obj: T): T => {
    const currentValue = getPath(path)(obj);
    const newValue = fn(currentValue);
    return setPath(path, newValue)(obj) as T;
  };

// ============================================================================
// TYPE UTILITIES
// ============================================================================

/**
 * Returns true if the object has no own enumerable properties.
 *
 * @example
 * isEmpty({}); // true
 * isEmpty({ a: 1 }); // false
 */
export const isEmpty = <T extends object>(obj: T): boolean => Object.keys(obj).length === 0;

/**
 * Returns true if the value is a plain object (not an array, not null).
 *
 * @example
 * isObject({}); // true
 * isObject([]); // false
 * isObject(null); // false
 */
export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Deep-equality comparison for two objects (curried, data-last).
 *
 * @example
 * equals({ a: 1, b: { c: 2 } })({ a: 1, b: { c: 2 } }); // true
 * equals({ a: 1 })({ a: 2 }); // false
 */
export const equals =
  <T extends object>(obj1: T) =>
  (obj2: T): boolean => {
    if (obj1 === obj2) return true;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      const val1 = (obj1 as Record<string, unknown>)[key];
      const val2 = (obj2 as Record<string, unknown>)[key];

      if (isObject(val1) && isObject(val2)) {
        if (!equals(val1)(val2)) return false;
      } else if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) return false;
        for (let i = 0; i < val1.length; i++) {
          if (isObject(val1[i]) && isObject(val2[i])) {
            if (!equals(val1[i])(val2[i])) return false;
          } else if (val1[i] !== val2[i]) {
            return false;
          }
        }
      } else if (val1 !== val2) {
        return false;
      }
    }

    return true;
  };

/**
 * Returns a deep clone of the value. Handles plain objects, arrays, and Dates.
 *
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const copy = clone(original);
 * copy.b.c = 999;
 * console.log(original.b.c); // 2 — original is unchanged
 */
export const clone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => clone(item)) as T;
  }

  if (obj instanceof Object) {
    const clonedObj: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = clone((obj as Record<string, unknown>)[key]);
      }
    }
    return clonedObj as T;
  }

  return obj;
};

/**
 * Recursively freezes an object, making it and all nested objects immutable.
 *
 * @example
 * const obj = freeze({ a: 1, b: { c: 2 } });
 * obj.a = 999; // throws in strict mode
 */
export const freeze = <T extends object>(obj: T): Readonly<T> => {
  Object.freeze(obj);

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (isObject(value)) {
        freeze(value);
      }
    }
  }

  return obj;
};
