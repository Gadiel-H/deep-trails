import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is a generator function according to its string representation (Symbol "*").
 *
 * @example
 * isGeneratorFunction(function* () {})        // true
 * isGeneratorFunction({ *fn() {} }.fn)        // true
 * isGeneratorFunction(async function* () {})  // true
 *
 * @since 3.0.0-beta.1
 */
export const isGeneratorFunction = (value: unknown): value is GeneratorFunction => {
    if (typeof value !== "function") return false;

    const string = toFunctionString(value);
    return string.startsWith("[Generator") || string.startsWith("[AsyncGenerator");
};
