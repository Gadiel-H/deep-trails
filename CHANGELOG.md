# Changelog

> ⚠️ All beta releases may introduce breaking changes.  
> The API is not considered stable until the beta versions are finished.

For more details about a release, click on the corresponding version.

## [Unreleased]

### Added

- Object validations now also report excess properties ("path: unexpected = value").
  For now, this only affects options validation in `deepIterate` and the `deepIterate.options` object.

- Added the `notation` option to `toPathString`. It will replace `useBrackets` in v3.0.0.

- Added the `onCircular` option to `deepIterate`. It will replace `maxParentVisits` in v3.0.0.

### Changed

- The `CallbackThis` type in `DeepIterate` has been renamed to `Snapshot`, and its API is now read-only.
  This affects both the callback and the return value of `deepIterate`.

- `isArrayLike` now also considers objects missing the last index as array-like.
  This affects validations using this checker, including those performed internally by `deepIterate`.

- `isInteger` has been renamed to `isIntegerLike`.

- `toPathString` now uses the `options.extraKey` argument only if it is explicitly provided (in each call).
  You will notice this if you defined `toPathString.options.extraKey`.

### Fixed

- `deepIterate` can now iterate over objects whose size or length cannot be numerically compared.
  For example, you can now iterate over `FormData` instances.

- The `deepIterate` core now uses the same `useBrackets` option from `toPathString.options` consistently throughout the traversal.
  You will notice the difference if you were mutating this option during traverse.

- Value conversions are now used in object validations (where possible) instead of the original values.
  For example, if you pass `{ maxParentVisits: "3" }` as options in `deepIterate`, it will be transformed to `{ maxParentVisits: 3 }`.

### Performance

- `isArrayLike` is now faster by validating the `length` property using operators instead of a function call.
  This is more noticeable when used thousands or millions of times.

- The `deepIterate` core now performs fewer unnecessary object reads and writes.
  The improvement is more noticeable in deeper traversals.

- `deepIterate` now uses lighter iterators for objects with an inherited `entries` method or that are array-like.

### Deprecated

These functions and options will be removed in v3.0.0

- The `ArrayIterator` and `MethodIterator` factories were deprecated because they are redundant. Use native iterators instead.

- The `callbackWrapper` option in `deepIterate` was deprecated because it can conflict with the callback itself.

- The `maxParentVisits` option in `deepIterate` was deprecated. Use `onCircular` instead.

- The `useBrackets` option in `toPathString` was deprecated. Use `notation` instead.

- The `isInteger` function was deprecated. Use `isIntegerLike` instead.

### Documentation

- Corrected and improved the changelog, home page, and contribution guide.

## [v3.0.0-beta.2] - 2026-01-12

### Changed

- The `size` getter in iterators created by `MethodIterator` now detects
  `Map` and `Set` instances directly instead of relying on `typeOf(object)`.

### Fixed

- In factory-created iterators, calling `next()` no longer advances the internal index once iteration has finished.

- Calling `[Symbol.iterator]()` in factory-created iterators always returns a simple iterator.
  Previously, it returned `null` after `destroy()` was called.

- Added the missing export for the `isArrowFunction()` type checker.

### Performance

- Reduced allocations in the iterator factories.

### Documentation

- Improved and corrected documentation in the public API.

## [v3.0.0-beta.1] - 2025-12-15

### Changed

- The functions in `utils.checkers` are now available directly from `utils` and "deep-trails/utils". `utils.checkers` is still available, but will be removed in stable version 3.0.0.

## [v3.0.0-beta.0] - 2025-12-08

### Added

- Type declarations to use inside and outside the project.
- Object validation using internal schemas.
- 3 factory functions for creating entries iterators.
- 2 extra module formats: CommonJS and IIFE.
- More type checkers in `utils.checkers`.
- More options and functionalities in `deepIterate()`, `utils.toPathString()` and `utils.typeOf()`.

### Changed

- **BREAKING:** The entire project structure and API has changed.
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

### Performance

- Improved performance and memory usage.

### Security

- Stronger security through types and schemas.

### DX

- Upgraded TypeScript integration and dev experience.

### Removed

- These functions and modules were removed because they were not useful or were poorly designed:
    - `pathUtils`
        - `getValueAt()`
        - `setValueAt()`
        - `pathExistsAt()`
    - `fTypeOf()`
    - `sTypeOf()`
    - `deepIterate.help()`
    - And the majority of methods at `is` (currently `utils.checkers`).

## [v2.0.0] - 2025-04-22

### Added

- New type-checking functions added to `is`.

- Exposed the `is` object as part of the public API. It provides type-checking helpers.

### Changed

- deep-trails is now developed with TypeScript.

- The `deepIterate` and `deepIterate.help` functions have been slightly refactored to be more organized.

## [v1.0.0] - 2025-04-16

**First public version of deep-trails.**

[Unreleased]: https://github.com/Gadiel-H/deep-trails/compare/v3.0.0-beta.2...HEAD
[v3.0.0-beta.2]: https://github.com/Gadiel-H/deep-trails/releases/tag/v3.0.0-beta.2
[v3.0.0-beta.1]: https://github.com/Gadiel-H/deep-trails/releases/tag/v3.0.0-beta.1
[v3.0.0-beta.0]: https://github.com/Gadiel-H/deep-trails/releases/tag/v3.0.0-beta.0
[v2.0.0]: https://github.com/Gadiel-H/deep-trails/releases/tag/v2.0.0
[v1.0.0]: https://github.com/Gadiel-H/deep-trails/releases/tag/v1.0.0
