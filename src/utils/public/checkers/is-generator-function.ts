import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is a generator function according to its string representation.
 *
 * @example
 * isGeneratorFunction(function* () {})        // true
 * isGeneratorFunction({ *fn() {} }.fn)        // true
 * isGeneratorFunction(async function* () {})  // true
 */
export const isGeneratorFunction = (fn: unknown): fn is GeneratorFunction => {
    if (typeof fn !== "function") return false;

    const string = toFunctionString(fn);
    return string.startsWith("[Generator") || string.startsWith("[AsyncGenerator");
};
