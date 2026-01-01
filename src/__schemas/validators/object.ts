import { isNoFnObject } from "../../utils/public/index.js";
import type { Dictionary, Schema, Validator } from "../types/index";

/** @internal */
export const object = <T extends Dictionary>(
    schema: Schema<T>,
    checker = isNoFnObject,
    typeAlias: string = "object"
): Validator<T> => ({
    __test: checker as any,
    __convert: (val) => val,
    __description: `be of type "${typeAlias}"`,
    __type: typeAlias,
    __subSchema: schema as any
});
