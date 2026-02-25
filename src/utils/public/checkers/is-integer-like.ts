const safeIntRegexp = /^\s*(?:[+-]?(?:0|[1-9]\d*)|0[xX][0-9a-fA-F]+)\s*$/;
const { isInteger: isNumInteger } = Number;

/**
 * Checks whether a value is an integer of type "bigint", "number" or "string"
 * that can be converted using `Number`, `BigInt`, and `parseInt`, getting the same integer.
 *
 * @example
 * isIntegerLike(0)        // true
 * isIntegerLike(252n)     // true
 * isIntegerLike("-87 ")   // true
 * isIntegerLike("0x34")   // true
 * isIntegerLike("20e5")   // false (BigInt fails, parseInt returns 20)
 *
 * @since 3.0.0-beta.3
 */
export const isIntegerLike = (value: unknown): value is bigint | number | string => {
    const type = typeof value;

    if (type === "bigint") return true;

    if (type === "string") return safeIntRegexp.test(value as string);

    return type === "number" && isNumInteger(value);
};
