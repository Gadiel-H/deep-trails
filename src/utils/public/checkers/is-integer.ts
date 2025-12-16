const safeIntRegexp = /^\s*(?:[+-]?(?:0|[1-9]\d*)|0[xX][0-9a-fA-F]+)\s*$/;
const { isInteger: isNumInteger } = Number;

/**
 * Checks whether a value is an integer of type "bigint", "number" or
 * "string" that can be converted with `Number`, `BigInt`, and `parseInt`.
 *
 * @example
 * isInteger(0)         // true
 * isInteger(252n)      // true
 * isInteger("-87 ")    // true
 * isInteger("0x34")    // true
 * isInteger("20e5")    // false
 */
export const isInteger = (int: any): boolean => {
    const type = typeof int;

    if (type === "bigint") return true;

    if (type !== "string") return type === "number" && isNumInteger(int);

    return safeIntRegexp.test(int);
};
