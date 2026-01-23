import type { Validator } from "../types/index";

/**
 * Returns a validator for booleans.
 * @internal
 */
export const boolean = (): Validator<boolean> => ({
    __type: "boolean",
    __convert: (val) => val,
    __test: (val) => typeof val === "boolean",
    __description: `be of type "boolean"`
});
