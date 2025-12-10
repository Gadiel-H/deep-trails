# Change log

## v3.0.0-beta.0 (2025-12-08)

### Features

- Type declarations to use inside and outside the project.

- More options and functionalities in `deepIterate()`, `utils.toPathString()` and `utils.typeOf()`.

- More type checkers in `utils.checkers`.

- Object validation using internal schemas.

- 3 factory functions for create entries iterators.

- 2 extra module formats: CommonJS and IIFE (for browsers).

### Upgraded

- Security using types and schemas.

- Performance and memory usage.

- TypeScript integration and dev experience.

### Modified

- The entire project structure and API has changed.

- Name changes in the main entry point:
    - `is` --> `utils.checkers`
        - `object()` --> `isNoFnObject()`
        - `function()` --> `isFunction()`
        - `any_object()` --> `isObject()`
        - `plain_object()` --> `isPlainObject()`
        - The other checker functions have beeen removed.
    - `stringifySimple()` --> `utils.toSimpleString()`
    - `stringifyPath()` --> `utils.toPathString()`
    - `defaultSettings` --> `deepIterate.options`

### Removed

- These functions and modules were removed because they were not useful or were poorly designed:
    - `pathUtils`
    - `fTypeOf()`
    - `sTypeOf()`
    - `deepIterate.help()`
    - And the majority of methods at `is` (currently `utils.checkers`).

## v2.0.0 (2025-04-22)

### Features

- deep-trails is now developed with TypeScript.

- New type-checking functions added to `is`.

### Added

- Exposed the `is` object as part of the public API. It provides type-checking helpers.

### Modified

- The `deepIterate` and `deepIterate.help` functions have been slightly refactored to be more organized.

## v1.0.0 (2025-04-16)

**First public version of deep-trails.**
