import { isNativeFunction } from "../index.js";

/**
 * Checks wheter a value is a bound function according to its name and string representation.
 *
 * @example
 * isBoundFunction((() => 0).bind())     // true
 * isBoundFunction(String.bind())        // true
 * isBoundFunction(function bound() {})  // false (it's not native)
 *
 * @since 3.0.0-beta.1
 */
export const isBoundFunction = (value: unknown): value is Function =>
    isNativeFunction(value) && value.name.startsWith("bound ");
