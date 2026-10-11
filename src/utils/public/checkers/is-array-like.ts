const { MAX_SAFE_INTEGER } = Number;

/**
 * Checks whether a value is array-like.
 *
 * A value is considered array-like if:
 * - It is a string or a non-function object.
 * - It has a "length" property that is a non-negative integer.
 * - Its length does not exceed `Number.MAX_SAFE_INTEGER` (only for objects).
 *
 * @example
 * isArrayLike("Some string")            // true
 * isArrayLike({ 0: "a", length: 1.5 })  // false (length not integer)
 * isArrayLike({ 0: "a", length: 2 })    // true
 * isArrayLike({ 0: 346, length: 1n })   // false (length of type "bigint")
 *
 * @since 3.0.0
 */
export const isArrayLike = <T>(
    value: T
): value is Exclude<T, Function> & (string | (object & ArrayLike<unknown>)) => {
    if (value == null) return false;

    const type = typeof value;

    if (type === "string") return true;
    if (type !== "object") return false;

    let len: number | null = null;
    try {
        len = (value as any).length;
    } catch {}

    if (typeof len !== "number") return false;

    if (len < 0 || len % 1 !== 0) return false;

    return len <= MAX_SAFE_INTEGER;
};
