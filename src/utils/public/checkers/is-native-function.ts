import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is a native function according to its string representation.
 *
 * @example
 * isNativeFunction(Array)             // true
 * isNativeFunction(Map)               // true
 * isNativeFunction((() => 0).bind())  // true
 */
export const isNativeFunction = (fn: unknown): fn is Function => {
    if (typeof fn !== "function") return false;

    return toFunctionString(fn).startsWith("[Native");
};
