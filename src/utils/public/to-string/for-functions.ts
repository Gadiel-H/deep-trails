"use strict";

import { toSimpleString } from "./for-anything.js";

/** RegExp for check identifiers compatible with dot notation. */
const dotNotation = /^[a-zA-Z_$][\w$]*$/;

/** Cache for function strings. */
const cache: WeakMap<Function, { string: string; name: string }> = new WeakMap();

/**
 * Creates a simple string describing a function.
 *
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
        throw new TypeError(`${toSimpleString(func)} is not a function.\n`);

    let funcString = String(func).trim();

    if (funcString.startsWith("class ")) {
        const name = func.name || "(anonymous)";
        const string = `[class ${name}]`;
        cache.set(func, { string, name: func.name });
        return string;
    }

    const stringEnd = func.name !== "" ? `: ${func.name}]` : " (anonymous)]";

    if (
        funcString.endsWith("{ [native code] }") ||
        funcString.endsWith("{\n    [native code]\n}")
    ) {
        funcString = "[NativeFunction" + stringEnd;
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

    if (funcString[0] === "*") {
        funcString = funcString.substring(1).trim();
        isGenerator = true;
    } else if (funcString.startsWith("function")) {
        // Checks wheter `func` has "*" after "function" keyword.
        isGenerator = funcString.split(" ").join("")[8] === "*";
    } else if (funcString[0] === "(") {
        isArrow = true;
    } else {
        // Checks whether `func` doesn't have parentheses around its param
        // Example: `param => {}`
        isArrow = dotNotation.test(funcString.split("=>")[0].trim());
    }

    if (isAsync && isGenerator) {
        funcString = "[AsyncGeneratorFunction" + stringEnd;
    } else if (isAsync && !isArrow) {
        funcString = "[AsyncFunction" + stringEnd;
    } else if (isGenerator) {
        funcString = "[GeneratorFunction" + stringEnd;
    } else if (isArrow && isAsync) {
        funcString = "[AsyncArrowFunction" + stringEnd;
    } else if (isArrow) {
        funcString = "[ArrowFunction" + stringEnd;
    } else funcString = "[Function" + stringEnd;

    cache.set(func, { string: funcString, name: func.name });
    return funcString;
}
