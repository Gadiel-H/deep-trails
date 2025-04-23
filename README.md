# Deep Trails

[![NPM version](https://img.shields.io/npm/v/deep-trails)](https://www.npmjs.com/package/deep-trails)
[![License: MIT](https://img.shields.io/badge/license-MIT-red.svg)](./LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/gadiel-h/deep-trails)](https://github.com/gadiel-h/deep-trails/issues)
[![Stars](https://img.shields.io/github/stars/gadiel-h/deep-trails)](https://github.com/gadiel-h/deep-trails/stargazers)

[README - español.](./README.es.md)


Deep Trails is a library designed for deep, controlled traversal of data structures, offering great flexibility and security against loops and errors. Its simple and customizable API allows for easy integration into projects that require high-precision traversal of objects, arrays, maps, or sets.



## Characteristics

- **Deep tour:** Recursively iterate over objects, arrays, maps, and sets.
- **Custom control:** Allows you to specify [options](#configuration-options) such as iterating or not using keys, adding indexes as keys in sets, and excluding specific types.
- **Prevention of cycles:** Uses a `WeakSet` to avoid circular references.
- **Extended functionalities:** Includes a help function (`deepIterate.help`) to provide diagnostic information for each iteration. It also includes [other useful functions](#other-useful-functions).
- **No external dependencies for use:** Ideal for projects that require keeping the code light and modular.



## Installation

### With NPM

Install Deep Trails via NPM:

```bash
npm install deep-trails
```


### From GitHub

Clone the repository:

```bash
git clone https://github.com/gadiel-h/deep-trails.git
```



## Usage
Deep Trails has `deepIterate` as its main function, which receives the object to be traversed, a callback function and configuration options as main and fully customizable parameters.



### Basic example in Node.js

```javascript
import { deepIterate } from 'deep-trails';

const obj = {
  a: new Map([
    [ { z: 27 }, true ]
  ]),
  b: {
    c: [ 9, 7, 3 ],
    d: new Set([ null, NaN, undefined ])
  }
};

const options = {
  iterateKeys: false,
  addIndexInSet: true,
  doNotIterate: {
    keyTypes: new Set(),
    objectTypes: new Set()
  }
};

const visited = new WeakSet();  // You can add objects here to avoid iterating over them.

// Loop through the object and execute the callback on each iteration.
deepIterate(obj, (key, value, path) => {
  // Place the logic for each iteration here.
  // You can stop the iteration by making a return.
  const { strPath, strValue, valueType } = deepIterate.help(key, value, path, obj);
  console.log(`${strPath}: ${valueType} = ${strValue}`);
}, options, visited);

```

You can also run `npm test` or the [./tests/node.js](./tests/node.js) file to see a usage example where data for an object is displayed.


### Configuration options

`deepIterate` allows you to use some configuration options to perform more precise iterations or not iterate certain types of objects.


- **iterateKeys (boolean)**: Determines whether keys should be iterated when possible.

- **addIndexInSet (boolean)**: If true, an index will be used as the key in sets instead of the value.

- **doNotIterate (Object)**: Allows you to specify sets or arrays with constructors, either functions or their names (avoid defining the `constructor` property):

  - **keyTypes**: List of key constructors that will not be iterated.

  - **objectTypes**: List of value constructors that will not be iterated over.




### Other useful functions 

Deep Trails also offers other features (accessible from "index.js") that, in addition to helping internally, can be useful:

- **[typeOf](./dist/utils/typeOf.js)**: Detects the type of a value using the `typeof` operator and the `Object.prototype.toString.call` function.
- **[stringifyPath, stringifySimple](./dist/lib/utils/stringify.js)**: Converts paths (arrays) and other values to strings for easy display.
- **[pathUtils](./dist/lib/utils/paths.js)**: Contains 3 functions to save, modify and obtain values ​​with respect to a path within an object.
- **[is](./dist/lib/utils/types-check.js)**: Detects whether a value is of a certain type with each own method of this object.



## Contributions

Contributions are welcome. If you'd like to improve Deep Trails or report a problem, please create an issue or submit a pull request.




## License

This project is distributed under the MIT license.
