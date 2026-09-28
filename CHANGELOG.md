# Changelog

> ⚠️ All beta releases may introduce breaking changes.  
> The API is not considered stable until the beta versions are finished.

For more details about a release, click on the corresponding version.

## [Unreleased] - 2026-09-27

### Added

- Support for `"first"` and `"last"` as arguments for `PropertiesIterable.peek()`.

- The `PropertiesIterable.getSize()` method, which returns the current number of keys, or `undefined` after `clear()`.

- The `PropertiesIterable.clear()` method, which releases captured references and leaves the iterator methods finished.

- `PropertiesIterable.object` now returns `null` after `clear()` releases the iterator's internal references.

- The `deepIterate()` `onGetter` option, which executes, catches, or delegates property getters encountered during property iteration. It defaults to `"catch-error"`.

- The `Control.setValue()` method for changing the current value in the source object and traversal context.

### Removed

- The `useBrackets` option in `toPathString()`. Use `notation` instead.

- The `toPathString.options` object. Use `toPathString.notation` to change the default notation.

- The `isInteger()` checker. Renamed to `isIntegerLike()`.

- The `checkers` object. Import the checkers from `"deep-trails/utils"` or the `utils` object.

- The `ArrayIterator()` and `MethodIterator()` factories. Use native iterators instead.

- The `callbackWrapper` and `maxParentVisits` options in `deepIterate()`. Use bound callbacks and the `onCircular` option instead.

- The `Control.useEntry()` method. Use `setValue()` instead.

- The `EntriesIterator` type. Replaced by `PropertiesIterable`.

- The `PropertiesIterable.size` property. Replaced by `PropertiesIterable.getSize()`.

- The `PropertiesIterable.destroy()` method. Replaced by `PropertiesIterable.clear()`.

- The `Snapshot` type. Replaced by `TraversalContext`.

### Fixed

- **Breaking:** `Callback` now passes the `V` type argument to `Control`.
  This makes `control.setValue()` require a value of type `V`.

- **Breaking:** `deepIterate.options` now has a null prototype and rejects defining accessors, unknown properties, and prototype changes.

- **Breaking:** `toSimpleString()` now:
    - Validates objects using `instanceof` instead of relying only on string tags.
      If an object fails the `instanceof` check, it is stringified using `Object.prototype.toString.call()`.

    - Uses an object tags table without prototype.
      This can be a breaking change if the previous behavior was required by your program.
      This only affects the rare case where the toString tag previously matched an inherited property.

    - Escapes strings instead of returning them between unescaped quotes.

- **Breaking:** `isPlainObject()` now has a safer and more precise TS predicate typing:
    - Intersections with primitive types or types that extend `Function` result in `never`.
    - After check, accessing nonexistent properties (outside the checker) on the object results in `unknown` instead of `any`.

- **Breaking:** `toFunctionString()` now uses a different function-string representation:
    - Detects function types more accurately. See its [documentation](https://gadiel-h.github.io/deep-trails/functions/utils.toFunctionString.html) for details.
        - Detects generator and async functions using their constructor names and string tags.
        - Detects classes using a regular expression instead of `string.startsWith()`.
        - Detects native functions using a regular expression instead of `string.endsWith()`.

    - Stringifies only functions with an empty name (`""`) as anonymous.

    - Detects arrow functions using a regular expression instead of relying on incorrect properties.

    - Detects arrow functions with up to three levels of nested parentheses; source beginning with `"("` is treated as arrow syntax.

- `toSimpleString()` stringifies invalid `Date` instances as `"Invalid Date"` instead of throwing an error.

- Errors thrown by a `deepIterate()` callback are now available as the `cause` of the resulting error.

- `toFunctionString()` now:
    - Validates that its input is a function before reading the `name` property.
    - Returns a fallback representation if the function source cannot be inspected.
    - Stringifies symbol names without throwing an error.
    - Uses `"[TypeFunction [name error]]"` if reading the name throws an error.

- `isArrayLike()` returns `false` if getting the object length throws an error.

- `isBoundFunction()` returns `false` if getting the function name throws an error.

- `isFunction()` also supports constructor signatures in the type constraint of `T`.

### Changed

- **Breaking:** Adapted `ChildContext` to the effects of `Options.onGetter`.
  Added the exported `ChildBaseContext`, `ChildValueRead`, and `ChildValueError` types. Getter failures are represented by `value: undefined` and `getterError` with the original error in `cause`.

- **Breaking:** Changed the TS type parameters order for `TraversalContext`, `Callback`, and `deepIterate()` to `<P, K, V, R>`.

- **Breaking:** Changed the signatures of `PropertiesIterator()` and `deepIterate()`.

- **Breaking:** `PropertiesIterator()` validates its arguments and throws an error when an argument is invalid.

- **Breaking:** `Options.onCircular()` must return `"iterate" | "skip"` instead of `boolean | void | never`.
  At runtime, `deepIterate()` continues only when the callback returns `"iterate"`.

- **Breaking:** `makeIterator()` (internal) now identifies excluded built-in objects with `instanceof`; cross-realm instances or objects with modified prototypes may therefore be handled differently.

- **Breaking:** Calling `PropertiesIterable[Symbol.iterator]()` no longer resets the shared iteration state.

- `PropertiesIterable.peek()` converts its argument to `number` if it is not `"first"` or `"last"`.

- `toSimpleString()` clears the cache every 5000 items.

- `deepIterate()` uses lighter property iterators for supported objects and array-like values.

### Documentation

- Clarified documentation and added examples for `PropertiesIterable`, `PropertiesIterator()`, and `deepIterate()`.

- Corrected the value description in the `VisitLogMap` type to say it is an array, not a `ParentContext` object.

- Explained the objects as references instead of values in `ChildContext` and `ParentContext`.

- Clarified and detailed documentation in `toFunctionString()` and its dependent checkers (`is*Function()`).

- Specified the path notation in `Options.pathType` when it is a string.

- Minor fixes and clarifications in `VisitLogMap` and `Options.pathType`, `ChildContext` and `ParentContext`.

## [v3.0.0-beta.3] - 2026-03-03

### Added

- Object validations now also report excess properties ("path: unexpected = value").
  For now, this only affects options validation in `deepIterate` and the `deepIterate.options` object.

- Added the `notation` option to `toPathString`. It will replace `useBrackets` in v3.0.0.

- Added the `onCircular` option to `deepIterate`. It will replace `maxParentVisits` in v3.0.0.

- Added warnings for deprecated features (`console.warn("deep-trails: ...")`).

### Changed

- The `CallbackThis` type in `DeepIterate` has been renamed to `Snapshot`, and its API is now read-only.
  This affects both the callback and the return value of `deepIterate`.

- `isArrayLike` now also considers objects missing the last index as array-like.
  This affects validations using this checker, including those performed internally by `deepIterate`.

- `isInteger` has been renamed to `isIntegerLike`.

- `toPathString` now uses the `options.extraKey` argument only if it is explicitly provided (in each call).
  You will notice this if you defined `toPathString.options.extraKey`.

- `deepIterate` now always uses mixed notation to create paths if `options.pathType === "string"`.

### Fixed

- `deepIterate` can now iterate over objects whose size or length cannot be numerically compared.
  For example, you can now iterate over `FormData` instances.

- Value conversions are now used in object validations (where possible) instead of the original values.
  For example, if you pass `{ pathType: "Array" }` as options in `deepIterate`, it will be transformed to `{ pathType: "array" }`.

- Now `toFunctionString` no longer depends on the function to be represented having the `toString` property.

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

[Unreleased]: https://github.com/Gadiel-H/deep-trails/compare/v3.0.0-beta.3...HEAD
[v3.0.0-beta.3]: https://github.com/Gadiel-H/deep-trails/releases/tag/v3.0.0-beta.3
[v3.0.0-beta.2]: https://github.com/Gadiel-H/deep-trails/releases/tag/v3.0.0-beta.2
[v3.0.0-beta.1]: https://github.com/Gadiel-H/deep-trails/releases/tag/v3.0.0-beta.1
[v3.0.0-beta.0]: https://github.com/Gadiel-H/deep-trails/releases/tag/v3.0.0-beta.0
[v2.0.0]: https://github.com/Gadiel-H/deep-trails/releases/tag/v2.0.0
[v1.0.0]: https://github.com/Gadiel-H/deep-trails/releases/tag/v1.0.0
