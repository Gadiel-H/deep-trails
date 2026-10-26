import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is an arrow function, async or not.
 *
 * Detection relies on the string created by `toFunctionString`
 * and the absence of "prototype" as own property.
 *
 * @requires {@linkcode toFunctionString}
 *
 * @remarks
 * - For async arrow functions (having the "async" keyword), the maximum level of nested parentheses is 3.
 * - At runtime the function could have "prototype" as a property inherited from a modified prototype.
 *
 * @example
 * isArrowFunction((...args) => {})   // true
 * isArrowFunction(function () {})    // false
 * isArrowFunction((() => 0).bind())  // false (detected as native)
 * isArrowFunction(new Function())    // false (returns a normal function)
 *
 * isArrowFunction(async(a=(1+(2+(3))))=>{})      // true
 * isArrowFunction(async(a=(1+(2+(3+(4)))))=>{})  // false (due to nested parentheses limit)
 *
 * @since 3.0.0
 */
export const isArrowFunction = <T>(
    value: T
): value is T & ((...args: unknown[]) => unknown) & { prototype: never } => {
    if (typeof value !== "function") return false;

    const string = toFunctionString(value);
    return string.startsWith("[Arrow") || string.startsWith("[AsyncArrow");
};
