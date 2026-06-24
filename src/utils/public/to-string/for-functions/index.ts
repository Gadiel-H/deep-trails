"use strict";

import { typeOf } from "../../index.js";
import { analyzeFunctionType, safeStringify, NATIVE_CODE, type AnyFunction } from "./helpers.js";

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
 * @since 3.0.0
 */
export function toFunctionString(func: Function): string {
    if (typeof func !== "function") {
        throw new TypeError(`Expected a function. Received ${typeOf(func)}.\n`);
    }

    let name = "[temporal name]",
        nameRead = true;

    try {
        name = func.name;
    } catch {
        nameRead = false;
    }

    if (nameRead) {
        const cached = cache.get(func);

        if (cached && cached.name === name) return cached.string;
    }

    const isAnonymous = name === "",
        finalName = isAnonymous ? "(anonymous)" : String(name),
        realFn = func as AnyFunction,
        fullString = safeStringify(realFn),
        analysis = analyzeFunctionType(fullString, realFn);

    if (analysis.isClass) {
        const string = `[class ${!nameRead ? "[name error]" : finalName}]`;
        cache.set(func, { string, name });
        return string;
    }

    const nameString = !nameRead
        ? " [name error]"
        : isAnonymous
          ? " (anonymous)"
          : `: ${finalName}`;

    if (NATIVE_CODE.test(fullString)) {
        const string = `[NativeFunction${nameString}]`;
        cache.set(func, { string, name });
        return string;
    }

    const { isAsync, isGenerator, isArrow } = analysis;
    let type = "Function";

    if (isAsync && isGenerator) type = "AsyncGeneratorFunction";
    else if (isGenerator) type = "GeneratorFunction";
    else if (isAsync && isArrow) type = "AsyncArrowFunction";
    else if (isAsync) type = "AsyncFunction";
    else if (isArrow) type = "ArrowFunction";

    const string = `[${type}${nameString}]`;
    cache.set(func, { string, name });
    return string;
}
