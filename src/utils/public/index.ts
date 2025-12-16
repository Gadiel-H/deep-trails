import * as _checkers from "./checkers/index.js";
export { typeOf } from "./type-of.js";
export * from "./checkers/index.js";
export * from "./to-string/index.js";

/**
 * Object with some util type checkers.
 *
 * **It will be removed in stable version 3.0.0.**
 * You can migrate by importing them from `utils` or "deep-trails/utils".
 *
 * @deprecated
 */
export const checkers = _checkers;
