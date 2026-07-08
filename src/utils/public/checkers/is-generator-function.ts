import { toFunctionString } from "../index.js";

/**
 * Checks whether a value is a generator function.
 *
 * Detection compares the constructor name and Object.prototype.toString tag,
 * falling back to source-based heuristics (presence of "*").
 *
 * @requires {@linkcode toFunctionString}
 *
 * @example
 * isGeneratorFunction(function* () {})           // true
 * isGeneratorFunction({ *fn() {} }.fn)           // true
 * isGeneratorFunction(async function* () {})     // true
 * isGeneratorFunction((function* () {}).bind())  // false (detected as native)
 *
 * @since 3.0.0
 */
export const isGeneratorFunction = (value: unknown): value is GeneratorFunction => {
    if (typeof value !== "function") return false;

    const string = toFunctionString(value);
    return string.startsWith("[Generator") || string.startsWith("[AsyncGenerator");
};
