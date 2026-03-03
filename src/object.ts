/**
 * Functional object manipulation utilities.
 * @module object
 */

export { isObject } from './_internal/object-utils.js';

export {
  pick,
  omit,
  merge,
  deepMerge,
  defaults,
  mapValues,
  mapKeys,
  filterKeys,
  filterValues,
} from './_internal/object-transform.js';

export {
  keys,
  values,
  entries,
  fromEntries,
  hasKey,
  getPath,
  setPath,
  updatePath,
  getPathOr,
  hasPath,
  deletePath,
  isEmpty,
  equals,
  clone,
  freeze,
  deepEquals,
  deepClone,
} from './_internal/object-access.js';
