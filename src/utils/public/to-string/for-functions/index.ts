"use strict";

import { typeOf } from "../../index.js";
import { analyzeFunctionType, safeStringify, NATIVE_CODE } from "./helpers.js";

/** Cache for function strings. */
const cache: WeakMap<Function, { string: string; name: string }> = new WeakMap();

/**
 * Creates a simple string describing a function, similar to `console.log`.
 *
 * Detects async and generator functions by comparing their Object.prototype.toString
 * tag and constructor name, or using source-based heuristics if that fails.
 *
 * For other function types, detection relies only on heuristics.
 *
 * Class syntax and native functions are checked first.
 *
 * @remarks
 * - The name is represented as anonymous for empty names,
 * "[name error]" if name access fails, or otherwise the actual name.
 * - If the type cannot be detected, it falls back to "Function".
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
 * fnString(async () => {})           // "[AsyncArrowFunction (anonymous)]"
 * fnString(function* () {})          // "[GeneratorFunction (anonymous)]"
 * fnString(function name() {})       // "[Function: name]"
 * fnString(async function() {})      // "[AsyncFunction (anonymous)]"
 * fnString(Proxy)                    // "[NativeFunction: Proxy]"
 * fnString(class D extends Date {})  // "[class D]"
 * fnString((async x => x).bind())    // "[NativeFunction: bound ]"
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
        fullString = safeStringify(func),
        analysis = analyzeFunctionType(fullString, func);

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
