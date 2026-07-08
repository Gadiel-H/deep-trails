import { isNativeFunction } from "../index.js";

/**
 * Checks whether a value is a bound function.
 *
 * Detection relies on source-based heuristics (native-code marker) and name.
 *
 * @requires {@linkcode isNativeFunction}
 *
 * @example
 * isBoundFunction((() => 0).bind())              // true
 * isBoundFunction(String.bind())                 // true
 * isBoundFunction({ ["bound "](){} }["bound "])  // false (it's not native)
 *
 * @since 3.0.0
 */
export const isBoundFunction = (value: unknown): value is Function => {
    if (!isNativeFunction(value)) return false;

    try {
        const name = value.name;
        return typeof name === "string" && name.startsWith("bound ");
    } catch {
        return false;
    }
};
