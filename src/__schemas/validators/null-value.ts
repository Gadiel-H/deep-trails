import type { Validator } from "../types/index";

/** @internal */
export const nullValue = (): Validator<null> => ({
    __test: (val): val is null => val === null,
    __convert: (val) => (val === null ? null : val),
    __type: "null",
    __description: "be null"
});
