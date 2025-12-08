import type { Schema, Dictionary } from "./index";

/**
 * Object with methods and properties to validate a type of data.
 * @internal
 */
export type Validator<T> = {
    __test: (value: unknown) => value is T;
    __convert: <V>(value: V) => T | V;
    __description: string;
    __type: string;
    __subSchema?: T extends Dictionary ? Schema<T> : never;
};
