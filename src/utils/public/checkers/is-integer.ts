const safeIntRegexp = /^\s*(?:[+-]?(?:0|[1-9]\d*)|0[xX][0-9a-fA-F]+)\s*$/;
const { isInteger: isNumInteger } = Number;

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
 * @since 3.0.0-beta.1
 */
export const isInteger = (int: unknown): int is bigint | number | string => {
    const type = typeof int;

    if (type === "bigint") return true;

    if (type !== "string") return type === "number" && isNumInteger(int);

    return safeIntRegexp.test(int as string);
};
