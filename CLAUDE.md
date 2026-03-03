# fp-core

Functional programming primitives for TypeScript. Zero dependencies. Every type inferred.

## Repository

- **npm:** https://www.npmjs.com/package/fp-core
- **GitHub:** https://github.com/roxdavirox/fp-core

## Structure

```
fp-core/
├── src/
│   ├── index.ts        # barrel export
│   ├── result.ts       # Result<T, E>
│   ├── option.ts       # Option<T>
│   ├── composition.ts  # pipe, compose, curry, memoize, tap...
│   ├── async.ts        # pipeAsync, retry, timeout, debounce...
│   ├── array.ts        # map, filter, groupBy, chunk...
│   ├── object.ts       # pick, omit, merge, setPath...
│   ├── string.ts       # camelCase, truncate, template...
│   └── predicates.ts   # and, or, not, isString, between...
├── tests/
├── scripts/
│   ├── branch-create.sh
│   ├── pr-create.sh
│   └── pr-check.sh
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
```

## Commands

```bash
npm test              # run tests
npm run type-check    # type check
npm run build         # compile to dist/
npm run test:coverage # coverage report
```

## Design Principles

- **Value-first pipe:** `pipe(value, fn1, fn2)` — TypeScript infers every step
- **Curried data-last:** data argument comes last so functions compose in `pipe`
- **Result over exceptions:** functions that can fail return `Result<T, E>`
- **Option over null:** functions that can return nothing return `Option<T>`
- **Zero dependencies:** no runtime dependencies, ever
- **Tree-shakeable:** named exports, no side effects

## Conventions

### Commits

```
type(scope): description in English
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `ci`, `chore`
Scopes: `result`, `option`, `array`, `object`, `string`, `predicates`, `async`, `composition`, `ci`, `dx`

Commits must be atomic. Commit after each complete logical change — do not accumulate.

### Branches

```
<type>/issue-<N>-<slug>
```

Examples: `fix/issue-1-unique-flatten-thunk`, `feat/issue-5-subpath-exports`

Use `./scripts/branch-create.sh <N>` to create from an issue.

### Code style

- Everything in English: comments, JSDoc, commit messages, PR descriptions.
- No `any`. Use `unknown` + type guard when necessary.
- No mutation. Spread, `map`, `filter`, `reduce` only.
- No `if/else` blocks where ternary or early return is clearer.
- All exported functions must have JSDoc with at least one `@example`.

## Agent rules

- Do NOT commit without explicit user instruction.
- Do NOT run `git push` or `gh pr merge` without explicit user instruction.
- Do NOT add emojis to any file.
- Do NOT add "Co-authored-by: Claude" or any AI attribution to commits.
- Work on `<type>/issue-<N>-<slug>` branches. Never commit directly to main.
- Use `./scripts/branch-create.sh <N>` to create branches.
- Use `./scripts/pr-create.sh` to open PRs.
- Use `./scripts/pr-check.sh` to inspect CI and review status.

## GitHub Project

All issues and PRs belong to the **mago-office** project (project #2).
Project node ID: `PVT_kwHOAPDgbs4BQglq`

Status field ID: `PVTSSF_lAHOAPDgbs4BQglqzg-m2Sc`
Status options: Backlog=`8df12426`, Todo=`532fc3d8`, InProgress=`b894fbad`, InReview=`c999db95`, Done=`c841d7a3`

Priority field ID: `PVTSSF_lAHOAPDgbs4BQglqzg-nNm4`
Priority options: High=`e9333909`, Medium=`8cb7a262`, Low=`373ced67`
