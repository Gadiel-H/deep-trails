[Documentation](https://gadiel-h.github.io/deep-trails)
| [Changelog](https://github.com/gadiel-h/deep-trails/tree/main/CHANGELOG.md)
| [Contributing](https://github.com/gadiel-h/deep-trails/tree/main/CONTRIBUTING.md)
| [Examples](https://github.com/gadiel-h/deep-trails/tree/main/examples)
| [Demo](https://raw.githack.com/gadiel-h/deep-trails/main/examples/json-filter.html)

[![NPM version](https://img.shields.io/npm/v/deep-trails)](https://www.npmjs.com/package/deep-trails)
[![License: MIT](https://img.shields.io/badge/license-MIT-red.svg)](./LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/gadiel-h/deep-trails)](https://github.com/gadiel-h/deep-trails/issues)
[![Stars](https://img.shields.io/github/stars/gadiel-h/deep-trails)](https://github.com/gadiel-h/deep-trails/stargazers)

**deep-trails** is a developer-friendly TypeScript library for deeply traversing and manipulating data structures with full control and context.

## Features

- **High control:** Modify the traverse flow, transform nodes, specify options, and more.

- **Full context:** Get context from current nodes, and also from their ancestors with a log of visited parent nodes.

- **Zero dependencies:** Modular, lightweight code with no external dependencies.

deep-trails aims to stay out of your way and let you express traversal logic clearly and explicitly.

## Supported environments

- **ESM** – modern Node.js and bundlers
- **CommonJS** – legacy Node.js
- **IIFE** – browsers without a bundler
- **TypeScript** – full typings included

## Installation

deep-trails supports all major JavaScript environments.

### Package managers

```bash
npm install deep-trails@beta
# or
pnpm add deep-trails@beta
# or
yarn add deep-trails@beta
# or
bun add deep-trails@beta
```

### CDN (browsers)

```html
<script src="https://unpkg.com/deep-trails@beta/dist/iife.min.js"></script>
<script>
    const { deepIterate, utils, iterate } = DeepTrails;
</script>
```

> Version 3 is in beta phase.  
> Version 2 is still available, but version 3 offers a cleaner and more expressive API.

## Getting started

This short guide shows you how to use deep-trails in most situations, with examples.

`deepIterate` is the main function. To learn more, you can read the [documentation].

### Basic usage

```js
import { deepIterate } from "deep-trails";

const object = { a: { b: 0 } };

deepIterate(object, ({ path, value }) => console.log(path, value));
```

### Nodes context

The callback in `deepIterate` receives a context object for the child and another for the parent.

They contain information related to the position in the structure and the traverse.

[Child context.](https://gadiel-h.github.io/deep-trails/types/DeepIterate.ChildContext.html)  
[Parent context.](https://gadiel-h.github.io/deep-trails/types/DeepIterate.ParentContext.html)

```js
deepIterate(object, (child, parent) => {
    const { key, value, path, index } = child;
    const { depth, parentValue } = child;

    // The parent includes that information and more
    const { size, visits, role } = parent;
});
```

### Traverse control

You can have better control of the traverse with the control object.

Its effects are applied after each call to the callback.

[More information.](https://gadiel-h.github.io/deep-trails/types/DeepIterate.Control.html)

#### Changing the flow

```js
deepIterate(object, (child, parent, control) => {
    // Avoid fully iterating over the current child
    control.skipNode = child.depth >= 10;

    // Stop iterating the parent immediately
    control.stopParentNow = child.index >= 100;

    // Finish the entire traverse at once
    control.finishNow = child.key === "stopHere";
});
```

#### Mutating the current parent

`deepIterate` does not automatically update the context if you modify the parent object.

To update it, you must call `control.useEntry()` with the key and value you want to use for the current child.

So far, this is the only available method related to mutation.

[More information.](https://gadiel-h.github.io/deep-trails/types/DeepIterate.Control.html#useentry)

```js
deepIterate(object, ({ key, value }, parent, control) => {
    if (value == null) {
        value = {};
        parent.value[key] = value; // Mutate the parent
        control.useEntry(key, value); // Update context
    }
});
```

### Options argument

You can also specify options to change behaviors, independent of the callback.

[More information.](https://gadiel-h.github.io/deep-trails/types/DeepIterate.Options.html)

#### In each call

```js
deepIterate(object, callback, {
    maxParentVisits: Infinity, // Allows visiting circular structures
    visitLogType: "map",
    pathType: "string",
    exposeVisitLog: false // Disallows visit log access inside the callback
});
```

#### In the defaults

[More information.](https://gadiel-h.github.io/deep-trails/functions/deepIterate.html#options)

```js
const defaults = {
    pathType: "string",
    visitLogType: "map",
    maxParentVisits: Infinity
};

// This won't work because the property is read-only
deepIterate.options = defaults;

// Better do this
deepIterate.options.pathType = "string";

// Or this multiple options
Object.assign(deepIterate.options, defaults);
```

### Full context

With the `this` object you can also access the arguments you provided,
and a log of visited parent nodes if you requested one.

```js
const { visitLog } = deepIterate(
    object,
    function (child, parent, control) {
        const { root, callback, visitLog, options } = this;

        // Advanced: accessing deep ancestral history
        if (depth >= 3) {
            const _parent = child.parentValue;
            const grandparent = parent.parentValue;
            const greatGrandparent = visitLog.get(grandparent).at(-1).parentValue;
        }
    },
    {
        visitLogType: "map"
    }
);

for (const history of visitLog) {
    for (const context of history) {
        const { key, value, path, visits } = context;
    }
}
```

## Available modules

### deep-trails

The main entry point.

- Exports the entire public API
- The IIFE bundle and documentation are generated from here

### deep-trails/iterate

Functions dedicated to iteration.

Includes functions such as:

- `deepIterate`
- `ArrayIterator`
- `PropertiesIterator`
- and `MethodIterator`

### deep-trails/utils

Utilities that may not be related to iteration.

Includes functions for validation, formatting, and conversion, such as:

- `toSimpleString`
- `toPathString`
- `typeOf`
- `isPlainObject`
- `isArrayLike`
- `isBoundFunction`
- and more

### deep-trails/types

Public type declarations.

These types are used to document the library and improve the dev experience.

You can also use them in your code.

### deep-trails/types/deep-iterate

Specific types used by `deepIterate`.

It contains types such as `ChildContext`, `Control`, `Options`, and others.

## License

This project is distributed under the MIT [license](./LICENSE).

[Documentation]: https://gadiel-h.github.io/deep-trails
