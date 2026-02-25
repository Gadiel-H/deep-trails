import { isIntegerLike } from "./index.js";

/**
 * Checks whether a value is an integer of type "bigint", "number" or "string"
 * that can be converted using `Number`, `BigInt`, and `parseInt`, getting the same integer.
 *
 * @example
 * isInteger(0)         // true
 * isInteger(252n)      // true
 * isInteger("-87 ")    // true
 * isInteger("0x34")    // true
 * isInteger("20e5")    // false (BigInt fails, parseInt returns 20)
 *
 * @deprecated since v3.0.0-beta.3
 *
 * This function is an alias of `isIntegerLike` and will be removed in v3.0.0.
 * Use {@linkcode isIntegerLike} instead.
 *
 * @since 3.0.0-beta.1
 */
export const isInteger = isIntegerLike;
