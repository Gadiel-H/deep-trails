import type { Dictionary, PartialValidator, Validator } from "./index";

/** Initial scheme to be recorded. @internal */
export type InputSchema<T extends Dictionary> = {
    [K in keyof T]: PartialValidator<T[K]> | Validator<T[K]>;
};
