"use strict";

import { checkers, typeOf } from "../utils/public/index.js";
import type { Schema, InputSchema, Dictionary } from "./types/index";

const { isPlainObject } = checkers;
const knownSchemas = new WeakSet();

/** Checks whether an object is a known schema. @internal */
export const isSchema = (schema: object): schema is Schema<any> => knownSchemas.has(schema);

/**
 * Records a schema and completes its missing properties and sub-schemas.
 * @internal
 */
export function recordSchema<T extends Dictionary>(schema: InputSchema<T>): Schema<T> {
    if (!isPlainObject(schema)) {
        throw new TypeError(`Expected a plain object as schema. Received ${typeOf(schema)}\n`);
    }

    type SchemaArg = typeof schema;
    type SchemaKeys = (keyof SchemaArg)[];

    for (const key of Reflect.ownKeys(schema) as SchemaKeys) {
        type SubSchema = Schema<SchemaArg[typeof key]>;
        const schemaProp = schema[key];
        const subSchema = schemaProp.__subSchema as SubSchema | undefined;
        const type = schemaProp.__type;

        if (!("__convert" in schemaProp)) {
            schemaProp.__convert = (value) => value;
        }

        if (!("__description" in schemaProp)) {
            schemaProp.__description = `be of type ${type}`;
        }

        if (isPlainObject(subSchema)) {
            recordSchema(subSchema as InputSchema<T>);
        }
    }

    knownSchemas.add(schema as Schema<T>);

    return schema as Schema<T>;
}
