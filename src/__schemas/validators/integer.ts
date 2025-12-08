import type { Validator } from "../types/index";
import { checkers } from "../../utils/public/index.js";

const { isInteger } = checkers;
const isValidLimit = (num: number) =>
    num === Infinity || num === -Infinity || Number.isInteger(num);

/** @internal */
export const integer = (min: number = -Infinity, max: number = Infinity): Validator<number> => {
    if (!isValidLimit(min) || !isValidLimit(max)) {
        throw new TypeError(
            `One or both of the limits is neither integer nor infinite.\n` +
                `    min = ${min}\n` +
                `    max = ${max}\n`
        );
    }

    if (max < min || min > max) {
        throw new RangeError(
            `One of the limits is not valid with respect to the other.\n` +
                `    min = ${min}\n` +
                `    max = ${max}\n`
        );
    }

    const __type: string =
        min !== -Infinity && max !== Infinity
            ? `int, >= ${min}, <= ${max}`
            : min !== -Infinity
              ? `int, >= ${min}`
              : max !== Infinity
                ? `int, <= ${max}`
                : "integer";

    return {
        __test: (num: any): num is number => Number.isInteger(num) && num >= min && num <= max,
        __convert: (num) => (isInteger(num) ? Number(num) : num),
        __type: __type,
        __description: `be an integer. Minimum: ${min}. Maximum: ${max}`
    };
};
