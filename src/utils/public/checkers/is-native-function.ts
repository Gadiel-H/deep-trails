import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is a native function according to its string representation.
 *
 * @example
 * isNativeFunction(Array)             // true
 * isNativeFunction(Map)               // true
 * isNativeFunction((() => 0).bind())  // true
 *
 * @since 3.0.0-beta.1
 */
export const isNativeFunction = (value: unknown): value is Function => {
    if (typeof value !== "function") return false;

    return toFunctionString(value).startsWith("[Native");
};
