import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is a native function.
 *
 * Detection relies on source-based heuristics (native-code marker).
 *
 * @requires {@linkcode toFunctionString}
 *
 * @example
 * isNativeFunction(Array)             // true
 * isNativeFunction(Map)               // true
 * isNativeFunction((() => 0).bind())  // true
 *
 * @since 3.0.0
 */
export const isNativeFunction = (value: unknown): value is Function => {
    if (typeof value !== "function") return false;

    return toFunctionString(value).startsWith("[Native");
};
