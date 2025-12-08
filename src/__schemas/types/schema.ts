import type { Dictionary, Validator } from "./index";

/**
 * Object with validators to describe how the values ​​of the properties of an object should be.
 * @internal
 */
export type Schema<T extends Dictionary> = {
    readonly [K in keyof T]: Readonly<
        Validator<T[K]> & (T[K] extends Dictionary ? { __subSchema: Schema<T[K]> } : {})
    >;
};
