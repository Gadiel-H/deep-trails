import type { Validator } from "../types/index";

/**
 * Returns a validator for the `null` value.
 * @internal
 */
export const nullValue = (): Validator<null> => ({
    __test: (val) => val === null,
    __convert: (val) => val,
    __type: "null",
    __description: "be the null value"
});
