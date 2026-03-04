# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Subpath exports for granular imports (`fp-core/result`, `fp-core/option`, etc.)
- Full test suite for `array`, `object`, `string`, and `predicates` modules (405 tests total)
- Coverage tests for `mapResultAsync`, `flatMapAsync`, `debounceAsync`, `throttleAsync`, `composeAsync`
- Coverage thresholds enforced in CI (90% lines/functions/statements, 85% branches)
- `tapResult(fn)(result)` — side-effect on `Ok`, passes result through unchanged
- `tapError(fn)(result)` — side-effect on `Err`, passes result through unchanged
- `orElse(fn)(result)` — recover from `Err` by producing a new `Result`
- `fromNullableResult(onNone)(value)` — lift a nullable value into `Result`
- `flow(...fns)` — point-free left-to-right composition (complement to `pipe`)
- `ap(resultFn)(result)` — apply a wrapped function Result to a Result value
- `liftA2` — alias for `combineTwo`
- `liftA3(fn)(ra, rb, rc)` — lift a ternary function over three Results
- `bimap(onOk, onErr)(result)` — map both branches of a Result
- `mapLeft(fn)(result)` — alias for `mapErr`
- `swap(result)` — flips `Ok(x)` to `Err(x)` and vice versa
- `toOption(result)` — converts `Ok(x)` to `Some(x)`, `Err` to `None`
- `defaults(base)(obj)` — fills missing keys in `obj` from `base`
- `getPathOr(fallback, path)(obj)` — like `getPath` but returns fallback when path is absent
- `hasPath(path)(obj)` — returns `true` if the nested path exists, even when value is null
- `deletePath(path)(obj)` — removes the nested key, returns a new object
- `mapConcurrentResult(concurrency, fn)(arr)` — concurrent map accumulating all errors in Result
- `mapAsyncResult(fn)(arr)` — sequential async map accumulating all errors in Result
- `reduceAsyncResult(fn, initial)(arr)` — sequential async reduce that short-circuits on first Err
- `deepEquals(a)(b)` — structural equality with cycle detection (Date, RegExp, Map, Set)
- `deepClone(value)` — deep clone with cycle detection (Date, RegExp, Map, Set)
- `head(arr)` — first element as `Option<T>`, `None` if empty
- `tail(arr)` — all-but-first as `Option<T[]>`, `None` if empty
- `last(arr)` — last element as `Option<T>`, `None` if empty
- `init(arr)` — all-but-last as `Option<T[]>`, `None` if empty
- `nth(n)(arr)` — element at index n (supports negative), `None` if out of bounds
- ESLint configuration (`eslint.config.mjs`) with typed linting via `typescript-eslint`
- Stricter tsconfig flags: `noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`
- Husky git hooks: pre-commit runs `lint-staged` (ESLint + tsc), pre-push runs full test suite

### Changed
- `isNaN` renamed to `isNotANumber` — avoids shadowing the global `isNaN` built-in
- `isFinite` renamed to `isFiniteNumber` — avoids shadowing the global `isFinite` built-in

### Fixed
- `composeAsync` no longer mutates the caller's function array (was calling `.reverse()` in-place)
- `unique`, `flatten`, `flattenDeep` removed unnecessary thunk layer (were `unique()([...])`, now `unique([...])`)
- `string.reverse` now correctly handles multi-codepoint characters (emoji, surrogate pairs) using `Array.from`

### Refactored (internal, no breaking changes)
- `async.ts` split into `_internal/async-composition.ts`, `_internal/async-array.ts`, `_internal/async-control.ts`
- `object.ts` split into `_internal/object-utils.ts`, `_internal/object-transform.ts`, `_internal/object-access.ts`
- `string.ts` split into `_internal/string-transform.ts`, `_internal/string-query.ts`, `_internal/string-template.ts`, `_internal/string-validators.ts`
- `composition.ts` split into `_internal/pipe.ts`, `_internal/compose.ts`, `_internal/fn-utils.ts`

---

## [0.1.0] - 2026-03-03

### Added

**Core modules**

- `Result<T, E>` — type-safe error handling without exceptions
  - `Ok`, `Err`, `mapResult`, `mapErr`, `flatMap`, `match`, `tryCatch`, `fromPromise`, `andThen`, `unwrapOr`, `unwrapOrElse`, `unwrap`, `isOk`, `isErr`, `combineTwo`, `combineAll`, `collectErrors`, `validateAll`, `validateAny`, `mapResultAsync`, `flatMapAsync`, `tryCatchAsync`
- `Option<T>` — explicit nullability without null/undefined
  - `Some`, `None`, `fromNullable`, `fromTryCatch`, `mapOption`, `flatMapOption`, `andThenOption`, `matchOption`, `unwrapOptionOr`, `unwrapOption`, `unwrapOptionOrElse`, `orElseOption`, `optionToResult`, `resultToOption`, `isSome`, `isNone`, `toNullable`, `toArray`, `zipOption`, `sequenceOption`, `compactOptions`

**Composition**

- `pipe(value, ...fns)` — left-to-right composition, fully typed up to 10 steps
- `compose(...fns)` — right-to-left composition
- `curry` — converts a multi-argument function to curried form
- `memoize` — caches function results by argument
- `tap` — executes a side effect and passes the value through
- `identity` — returns its argument unchanged
- `constant` — returns a function that always returns the same value
- `partial`, `flip`, `once`, `after`, `before`, `negate`, `prop`

**Async**

- `pipeAsync` — async left-to-right composition
- `composeAsync` — async right-to-left composition
- `mapAsync` — sequential async map
- `mapParallel` — parallel async map
- `mapConcurrent` — parallel async map with concurrency limit
- `filterAsync` — sequential async filter
- `reduceAsync` — sequential async reduce
- `retry` — retries with exponential backoff, returns `Result`
- `timeout` — races a promise against a deadline
- `sleep` — promise-based delay
- `debounceAsync` — debounced async function
- `throttleAsync` — throttled async function
- `memoizeAsync` — memoized async function returning `Result`
- `sequence` — runs async thunks sequentially
- `parallel` — runs async thunks in parallel

**Array**

- `map`, `filter`, `reduce`, `flatMapArray`, `sortBy`
- `unique`, `take`, `skip`, `find`, `some`, `every`
- `groupBy`, `countBy`, `partition`
- `flatten`, `flattenDeep`, `zip`, `unzip`, `chunk`, `compact`, `hasItems`

**Object**

- `pick`, `omit`, `merge`, `deepMerge`, `mapValues`, `filterValues`
- `fromEntries`, `entries`, `mapKeys`, `filterKeys`
- `setPath`, `getPath`, `updatePath`
- `hasKey`, `isEmpty`, `equals`, `clone`
- `keys`, `values`

**String**

- `camelCase`, `pascalCase`, `kebabCase`, `snakeCase`
- `capitalize`, `trim`, `trimStart`, `trimEnd`
- `startsWith`, `endsWith`, `includes` (curried)
- `truncate`, `padStart`, `padEnd`
- `split`, `join`, `replace`, `replaceAll` (curried)
- `template` — simple `{{variable}}` string interpolation
- `words`, `isEmpty`, `isBlank`, `toUpperCase`, `toLowerCase`

**Predicates**

- `and`, `or`, `not`, `xor`, `nand`, `nor` — predicate combinators
- `isString`, `isNumber`, `isBoolean`, `isNull`, `isUndefined`, `isNil`
- `isArray`, `isFunction`, `isDate`, `isRegExp`, `isPromise`
- `between`, `gt`, `lt`, `gte`, `lte`, `eq`, `neq`
- `hasProperty` — type-guarded property check
- `isNotEmpty`, `isNotNull`
- `isEven`, `isOdd`, `isPositive`, `isNegative`, `isZero`, `isInteger`, `isInfinite`

**Infrastructure**

- TypeScript 5.x, `"moduleResolution": "bundler"`, strict mode
- Vitest test suite with v8 coverage
- GitHub Actions CI (type-check → test → build, Node 20 + 22)
- Automated npm publish on tag push

[Unreleased]: https://github.com/roxdavirox/fp-core/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/roxdavirox/fp-core/releases/tag/v0.1.0
