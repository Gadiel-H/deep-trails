import type { Validator } from "../types/index";
import { isInteger } from "../../utils/public/index.js";
import { toSimpleString as str } from "../../utils/public/index.js";

const isValidLimit = (num: number) =>
    num === Infinity || num === -Infinity || Number.isInteger(num);

/**
 * Returns a validator for integers between a given range.
 *
 * @remarks
 * - If no range is given, any integer is valid.
 * - The conversion method converts only valid strings, bigints, and numbers.
 *
 * @param min - Minimum limit: integer or `-Infinity`.
 * @param max - Maximum limit: integer or `+Infinity`.
 *
 * @throws `TypeError` if any of the limits is invalid.
 *
 * @internal
 */
export const integer = (min: number = -Infinity, max: number = Infinity): Validator<number> => {
    if (!isValidLimit(min) || !isValidLimit(max)) {
        throw new TypeError(
            `One or both of the limits is neither integer nor infinite.\n` +
                `    min = ${str(min)}\n` +
                `    max = ${str(max)}\n`
        );
    }

    if (max < min || min > max) {
        throw new RangeError(
            `One of the limits is not valid with respect to the other.\n` +
                `    min = ${min}\n` +
                `    max = ${max}\n`
        );
    }

    let type: string = "integer";

    if (min === max) {
        if (!Number.isInteger(min)) {
            const inf = min > 0 ? "+Infinity" : "-Infinity";
            throw new TypeError(
                `Both limits are the value ${inf}, and at least one is expected to be an integer.\n`
            );
        }

        type = String(min);
    } else if (min === 1 && max === Infinity) {
        type = "+integer";
    } else if (min === -Infinity && max === 1) {
        type = "-integer";
    } else {
        const hasMin = min !== -Infinity;
        const hasMax = max !== Infinity;

        if (hasMin && hasMax) type = `int >=${min} <=${max}`;
        else if (hasMin) type = `int >=${min}`;
        else if (hasMax) type = `int <=${max}`;
    }

    return {
        __test: (num: any): num is number => Number.isInteger(num) && num >= min && num <= max,
        __convert: (num) => (isInteger(num) ? Number(num) : num),
        __type: type,
        __description: `be an integer. Minimum: ${min}. Maximum: ${max}`
    };
};
