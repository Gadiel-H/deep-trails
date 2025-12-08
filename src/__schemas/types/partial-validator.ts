import type { Dictionary, Validator, InputSchema, Schema } from "./index";

/** Validator with the most important properties and methods. @internal */
export type PartialValidator<T> = Partial<Validator<T>> & {
    __type: string;
} & (T extends Dictionary
        ? {
              __test: (value: unknown) => value is Dictionary;
              __subSchema?: InputSchema<T> | Schema<T>;
          }
        : {
              __test: (value: unknown) => value is T;
          });
