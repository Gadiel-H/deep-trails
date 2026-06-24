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
    objectCtorString = functionToString.call(Object),
    CLASS_START = /^class[\s{]/,
    ARROW_FUNCTION =
        /^(?:async\s*)?(?:[a-zA-Z_$][\w$]*|\((?:[^()]*|\((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*\))*\))\s*=>/,
    WHITESPACE = /\s+/g,
    BLOCK_COMMENTS = /\/\*[\s\S]*?\*\//g,
    LINE_COMMENTS = /\/\/.*/g;

/** @internal */
export const NATIVE_CODE = new RegExp(
    `^${objectCtorString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/Object/g, "[^\\(\\)]*?")}$`
);

function isOfType(func: Function, expected: string, stringTag: string): boolean {
    try {
        return func.constructor.name === expected && stringTag === expected;
    } catch {
        return false;
    }
}

/** @internal */
export function safeStringify(func: Function): string {
    try {
        return functionToString.call(func).trim();
    } catch {
        return "[uninspectable function]";
    }
}

/** @internal */
export function analyzeFunctionType(fullString: string, func: Function): FunctionAnalysis {
    // Sanitize the string
    const withoutComments = fullString.replace(BLOCK_COMMENTS, "").replace(LINE_COMMENTS, "");
    const hasPrototype = "prototype" in func;

    if (hasPrototype && CLASS_START.test(withoutComments)) {
        return { isAsync: false, isGenerator: false, isArrow: false, isClass: true };
    }

    const withoutSpaces = withoutComments.replace(WHITESPACE, "");
    const type = typeOf(func, false);

    let isArrow = withoutSpaces[0] === "(";

    const isAsyncGenerator =
        !isArrow &&
        (isOfType(func, "AsyncGeneratorFunction", type) ||
            withoutSpaces.startsWith("async*") ||
            withoutSpaces.startsWith("asyncfunction*"));

    const isAsync = isAsyncGenerator || isOfType(func, "AsyncFunction", type);

    const isGenerator =
        !isArrow &&
        (isAsyncGenerator ||
            withoutSpaces[0] === "*" ||
            isOfType(func, "GeneratorFunction", type) ||
            withoutSpaces.startsWith("function*"));

    isArrow ||= !isGenerator && !hasPrototype && ARROW_FUNCTION.test(withoutComments);

    return { isAsync, isGenerator, isArrow, isClass: false };
}
