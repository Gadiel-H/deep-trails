import { isPlainObject } from "../../utils/public/index.js";
import type { Dictionary, Schema, Validator } from "../types/index";

/**
 * Returns a validator with a schema for plain objects.
 * @internal
 */
export const plainObject = <T extends Dictionary = {}>(
    schema: Schema<T>,
    typeAlias: string = "plain object"
): Validator<T> => ({
    __test: isPlainObject,
    __convert: (val) => val,
    __description: `be of type "${typeAlias}"`,
    __type: typeAlias,
    __subSchema: schema as any
});
