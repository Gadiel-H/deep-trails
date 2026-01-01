import type { Validator } from "../types/index";
import { isFunction } from "../../utils/public/index.js";

/** @internal */
export const anyFunction = (): Validator<(...args: any[]) => any> => ({
    __test: isFunction,
    __convert: (fn) => fn,
    __type: "Function",
    __description: "be a function"
});
