import type { Validator } from "../types/index";

/** @internal */
export const boolean = (): Validator<boolean> => ({
    __type: "boolean",
    __convert: (val) => val,
    __test: (val) => typeof val === "boolean",
    __description: `be of type "boolean"`
});
