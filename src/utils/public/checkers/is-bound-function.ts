import { isNativeFunction } from "../index.js";

const objHasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Checks whether a value is a bound function.
 *
 * Detection relies on the result of `isNativeFunction`,
 * the name and the absence of "prototype" as own property.
 *
 * @requires {@linkcode isNativeFunction}
 *
 * @remarks
 * At runtime the function could have "prototype" as a property inherited from a modified prototype.
 *
 * @example
 * isBoundFunction((() => 0).bind())              // true
 * isBoundFunction(String.bind())                 // true
 * isBoundFunction({ ["bound "](){} }["bound "])  // false (it's not native)
 *
 * @since 3.0.0
 */
export const isBoundFunction = <T>(
    value: T
): value is T & Function & { readonly name: `bound ${string}`; prototype: never } => {
    if (!isNativeFunction(value)) return false;

    try {
        const name = value.name;

        if (typeof name !== "string" || !name.startsWith("bound ")) return false;

        return !objHasOwnProperty.call(value, "prototype");
    } catch {
        return false;
    }
};
