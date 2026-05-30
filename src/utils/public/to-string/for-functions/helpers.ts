"use strict";

import { typeOf } from "../../index.js";

/** Analyzes function source to determine its type. */
interface FunctionAnalysis {
    isAsync: boolean;
    isGenerator: boolean;
    isArrow: boolean;
    isClass: boolean;
}

const functionToString = Function.prototype.toString,
    CLASS_START = /^class[\s{]/,
    WHITESPACE = /\s+/g,
    BLOCK_COMMENTS = /\/\*[\s\S]*?\*\//g,
    LINE_COMMENTS = /\/\/.*/g;

/** @internal */
export const NATIVE_CODE = /\{\s*\[native code\]\s*\}/;

/** @internal @inline */
export type AnyFunction = (...args: any[]) => any;

function isOfType(func: AnyFunction, expected: string, stringTag: string): boolean {
    try {
        return func.constructor.name === expected && stringTag === expected;
    } catch {
        return false;
    }
}

/** @internal */
export function safeStringify(func: AnyFunction): string {
    try {
        return functionToString.call(func).trim();
    } catch {
        return "[uninspectable function]";
    }
}

/** @internal */
export function analyzeFunctionType(fullString: string, func: AnyFunction): FunctionAnalysis {
    // Sanitize the string
    const withoutComments = fullString.replace(BLOCK_COMMENTS, "").replace(LINE_COMMENTS, "");
    const hasPrototype = "prototype" in func;

    if (hasPrototype && CLASS_START.test(withoutComments)) {
        return { isAsync: false, isGenerator: false, isArrow: false, isClass: true };
    }

    const withoutSpaces = withoutComments.replace(WHITESPACE, "");
    const type = typeOf(func, false);

    const isAsyncGenerator =
        isOfType(func, "AsyncGeneratorFunction", type) ||
        withoutSpaces.startsWith("async*") ||
        withoutSpaces.startsWith("asyncfunction*");

    const isAsync = isAsyncGenerator || isOfType(func, "AsyncFunction", type);

    const isGenerator =
        isAsyncGenerator ||
        withoutSpaces[0] === "*" ||
        isOfType(func, "GeneratorFunction", type) ||
        withoutSpaces.startsWith("function*");

    const isArrow =
        !isGenerator &&
        (withoutSpaces[0] === "(" ||
            (!hasPrototype &&
                !("arguments" in func) &&
                !("callers" in func) &&
                fullString.includes("=>")));

    return { isAsync, isGenerator, isArrow, isClass: false };
}
