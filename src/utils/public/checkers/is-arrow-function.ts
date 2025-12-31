import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is an arrow function according to its string representation.
 *
 * @example
 * isArrowFunction((...args) => {})   // true
 * isArrowFunction((() => 0).bind())  // false
 * isArrowFunction(new Function())    // false
 * isArrowFunction(function () {})    // false
 *
 * @since 3.0.0-beta.1
 */
export const isArrowFunction = (value: unknown): value is (...args: any[]) => any => {
    if (typeof value !== "function") return false;

    const string = toFunctionString(value);
    return string.startsWith("[Arrow") || string.startsWith("[AsyncArrow");
};
