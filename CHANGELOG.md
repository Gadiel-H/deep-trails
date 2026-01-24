# Changelog

> ⚠️ All beta releases may introduce breaking changes.  
> The API is not considered stable until the beta versions are finished.

For more details about a release, click on the corresponding version.

## [Unreleased]

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
