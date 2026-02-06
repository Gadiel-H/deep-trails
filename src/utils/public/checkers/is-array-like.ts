const { MAX_SAFE_INTEGER } = Number;

/**
 * Checks whether a value is array-like.
 *
 * A value is considered array-like if:
 * - It is a string or a non-function object.
 * - It has a "length" property that is a non-negative integer.
 * - Its length does not exceed `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * isArrayLike("Some string")            // true
 * isArrayLike({ 0: "a", length: 1.5 })  // false (length not integer)
 * isArrayLike({ 0: "a", length: 2 })    // true
 * isArrayLike({ 0: 346, length: 1n })   // false (length of type "bigint")
 *
 * @since 3.0.0-beta.3
 */
export const isArrayLike = <V = any>(value: any): value is ArrayLike<V> => {
    if (value == null) return false;

    const type = typeof value;

    if (type === "string") return true;
    if (type !== "object") return false;

    const len = value.length;

    if (typeof len !== "number") return false;

    if (len < 0 || len % 1 !== 0) return false;

    return len <= MAX_SAFE_INTEGER;
};
