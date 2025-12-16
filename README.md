[Documentation](https://gadiel-h.github.io/deep-trails)
| [Contributing](https://github.com/gadiel-h/deep-trails/tree/main/CONTRIBUTING.md)
| [Usage examples](https://github.com/gadiel-h/deep-trails/tree/main/examples)

[![NPM version](https://img.shields.io/npm/v/deep-trails)](https://www.npmjs.com/package/deep-trails)
[![License: MIT](https://img.shields.io/badge/license-MIT-red.svg)](./LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/gadiel-h/deep-trails)](https://github.com/gadiel-h/deep-trails/issues)
[![Stars](https://img.shields.io/github/stars/gadiel-h/deep-trails)](https://github.com/gadiel-h/deep-trails/stargazers)

**deep-trails** is a TypeScript library for traversing data structures in a deep, flexible, and fully controlled way.  
It is designed for heavy-duty use, complex manipulation, and custom behaviors that other libraries don't cover.

## Features

- **Extensive support:** Includes ES and CJS modules, full TypeScript typings, and a general-purpose API.

- **Total Control:** Each iteration can be precisely customized. You can modify the flow, transform nodes, obtain ancestral contexts, and more.

- **Zero dependencies:** Modular, lightweight code with no external dependencies.

## Installation

deep-trails is currently in the beta of version 3.0.0.  
Although changes may occur, the API is more powerful and stable than in previous versions.

#### With NPM:

```bash
npm install deep-trails@beta
```

#### With a CDN:

```html
<script src="https://unpkg.com/deep-trails@beta/dist/iife.min.js"></script>
<script>
    const { deepIterate, utils, iterate } = DeepTrails;
</script>
```

#### Manually:

The NPM package is created using `npm run build`, for compatibility with more environments.  
But you can also get just IIFE, or types and ES or CJS modules, like here:

```bash
git clone https://github.com/gadiel-h/deep-trails
cd deep-trails/
npm ci
npm run build:types
npm run build:esm
rm -rf node_modules/
```

## Basic usage example

> Note: You can find an interactive demo at https://raw.githack.com/gadiel-h/deep-trails/main/examples/json-filter.html

deep-trails has `deepIterate` as its main function, which receives the object to be traversed, a callback function, and configuration options.

```js
import { deepIterate } from "deep-trails";
import { toSimpleString } from "deep-trails/utils";

const API_RESPONSE = {
    status: "success",
    count: 2,
    results: [
        {
            id: 101,
            title: "Item A",
            active: true,
            config: {
                theme: "dark",
                settings: [1, 2, 3]
            }
        },
        {
            id: 102,
            title: "Item B",
            active: false,
            config: null
        }
    ]
};

deepIterate(
    API_RESPONSE,
    function ({ path, key, value }, parent, control) {
        const grandparent = parent.parentValue;

        // Updating status
        if (key === "status") {
            value = "processed";
        }

        // Preventing type errors
        else if (key === "config" && value == null) {
            control.skipNode = true;
            value = {};
        }

        // Removing inactive items
        else if (key === "active" && value === false) {
            // In this case the grandparent is an array
            grandparent.splice(parent.index, 1);

            // You can also stop iterating over the parent
            control.stopParentNow = true;
        }

        parent.value[key] = value;

        // Notifying changes in the parent
        control.useEntry(key, value);

        // Displaying paths and values
        console.log(`${path} = ${toSimpleString(value)}`);
    },
    {
        pathType: "string"
    }
);
```

## Available modules

- **"deep-trails"**: Main entry point. It contains all the essentials of the API.

- **"deep-trails/iterate"**: Functions dedicated to iteration.

- **"deep-trails/utils"**: Utilities for validation, formatting, and conversion.

- **"deep-trails/types"**: Public type declarations.

- **"deep-trails/types/deep-iterate"**: Specific types used by `deepIterate`.

## License

This project is distributed under the MIT [license](./LICENSE).
