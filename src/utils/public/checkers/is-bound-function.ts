import { isNativeFunction } from "../index.js";

/**
 * Checks wheter a value is a bound function according to its name and string representation.
 *
 * @example
 * isBoundFunction((() => 0).bind())     // true
 * isBoundFunction(String.bind())        // true
 * isBoundFunction(function bound() {})  // false
 */
export const isBoundFunction = (fn: unknown): fn is Function =>
    isNativeFunction(fn) && fn.name.startsWith("bound ");
