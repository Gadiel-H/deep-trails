import type { Validator } from "../types/index";
import { checkers } from "../../utils/public/index.js";

/** @internal */
export const anyFunction = (): Validator<(...args: any[]) => any> => ({
    __test: checkers.isFunction,
    __convert: (fn) => fn,
    __type: "Function",
    __description: "be a function"
});
