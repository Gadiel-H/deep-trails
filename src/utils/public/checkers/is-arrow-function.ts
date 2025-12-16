import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is an arrow function according to its string representation.
 *
 * @example
 * isArrowFunction((...args) => {})  // true
 * isArrowFunction(new Function())   // false
 * isArrowFunction(function () {})   // false
 */
export const isArrowFunction = (fn: unknown): fn is (...args: any[]) => any => {
    if (typeof fn !== "function") return false;

    const string = toFunctionString(fn);
    return string.startsWith("[Arrow") || string.startsWith("[AsyncArrow");
};
