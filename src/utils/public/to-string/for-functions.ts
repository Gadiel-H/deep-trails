"use strict";

import { typeOf } from "../index.js";

/** RegExp for check identifiers compatible with dot notation. */
const dotNotation = /^[a-zA-Z_$][\w$]*$/;

/** Cache for function strings. */
const cache: WeakMap<Function, { string: string; name: string }> = new WeakMap();

/**
 * Creates a simple string describing a function, similar to `console.log`.
 *
 * @remarks
 * - Distinguishes function types and class syntax.
 * - Includes the name if available.
 *
 * @param func - Function or class to stringify.
 *
 * @returns Simple string representation.
 *
 * @throws TypeError if `func` is not a function.
 *
 * @example
 * const fnString = toFunctionString;
 *
 * fnString(async () => {})       // "[AsyncArrowFunction (anonymous)]"
 * fnString(function* () {})      // "[GeneratorFunction (anonymous)]"
 * fnString(function name() {})   // "[Function: name]"
 * fnString(async function() {})  // "[AsyncFunction (anonymous)]"
 * fnString(Proxy)                // "[NativeFunction: Proxy]"
 * fnString(class SomeClass {})   // "[class SomeClass]"
 *
 * @since 3.0.0-beta.0
 */
export function toFunctionString(func: Function): string {
    const saved = cache.get(func);
    if (saved && saved.name === func.name) return saved.string;

    if (typeof func !== "function")
        throw new TypeError(`Expected a function. Received ${typeOf(func)}\n`);

    let funcString = String(func).trim();
    let nameString = ` ${func.name || "(anonymous)"}`;

    if (funcString.startsWith("class ")) {
        const string = `[class${nameString}]`;
        cache.set(func, { string, name: func.name });
        return string;
    }

    if (nameString !== " (anonymous)") nameString = `:${nameString}`;

    const hasNativeCode =
        funcString.endsWith("{ [native code] }") || funcString.endsWith("{\n    [native code]\n}");

    if (hasNativeCode) {
        funcString = `[NativeFunction${nameString}]`;
        cache.set(func, { string: funcString, name: func.name });
        return funcString;
    }

    let isAsync = false,
        isArrow = false,
        isGenerator = false;

    if (funcString.startsWith("async")) {
        funcString = funcString.substring(5).trim();
        isAsync = true;
    }

    isGenerator = funcString[0] === "*";

    if (isGenerator) {
        funcString = funcString.substring(1).trim();
    } else if (funcString.startsWith("function")) {
        const withoutSpaces = funcString.split(" ").join("");
        isGenerator = withoutSpaces[8] === "*";
    }

    if (!isGenerator) {
        isArrow = funcString[0] === "(";

        if (!isArrow) {
            const paramString = funcString.split("=>")[0];
            isArrow = dotNotation.test(paramString.trim());
        }
    }

    let type = "Function";

    if (isAsync && isGenerator) type = "AsyncGeneratorFunction";
    else if (isGenerator) type = "GeneratorFunction";
    else if (isAsync && isArrow) type = "AsyncArrowFunction";
    else if (isAsync) type = "AsyncFunction";
    else if (isArrow) type = "ArrowFunction";

    funcString = `[${type}${nameString}]`;

    cache.set(func, { string: funcString, name: func.name });
    return funcString;
}
