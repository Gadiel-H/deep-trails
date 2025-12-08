"use strict";

import { checkers, toPathString, toSimpleString } from "../utils/public/index.js";
import { isSchema } from "./record-schema.js";
import type { Schema, Dictionary } from "./types/index";
const { isNoFnObject } = checkers;

/** @internal */
type InvalidsList = [path: string, type: string, value: unknown][];

/**
 * Ensures that an object is valid based on a schema.
 * Uses `throwInvalids` if there are invalid properties.
 * @internal
 */
export function validateObject<T extends Dictionary>(
    object: Partial<T> | T,
    schema: Schema<T>,
    defaultObject: T | {},
    title: string
): T | never {
    const invalids: InvalidsList = [];
    let total = 0;

    if (!isSchema(schema)) {
        throw new TypeError(
            `${toSimpleString(schema)} is not a schema or is not known.\n` +
                "    If is valid, record it with `recordSchema`.\n"
        );
    }

    getInvalidProperties(object, schema, defaultObject, []);

    function getInvalidProperties(
        __object: T | Partial<T>,
        __schema: Schema<any>,
        __defaults: T | {},
        __currentPath: any[]
    ): void {
        type SchemaKeys = (keyof typeof __schema)[];
        const keys = Reflect.ownKeys(__schema) as SchemaKeys;

        for (const key of keys) {
            total++;

            const prop = __schema[key as any];
            const subSchema = prop.__subSchema;

            let value = __object[key];

            if (!(key in __object)) {
                value = prop.__convert(__defaults[key]);
                (__object as any)[key] = value;
            } else {
                value = prop.__convert(value);
            }

            if (!prop.__test(value)) {
                invalids.push([
                    toPathString(__currentPath, {
                        extraKey: key,
                        useBrackets: false
                    }),
                    prop.__type,
                    value
                ]);
            }

            if (subSchema && isNoFnObject(value) && isSchema(subSchema)) {
                getInvalidProperties(value, subSchema, __defaults ? __defaults[key] : undefined, [
                    ...__currentPath,
                    key
                ]);
            }
        }
    }

    if (invalids.length === 0) return object as T;

    throwInvalids(invalids, total, title);
}

/** Displays invalid properties by throwing a `TypeError`. @internal */
function throwInvalids(
    invalidProperties: InvalidsList,
    totalProperties: number,
    title: string
): never {
    const len = invalidProperties.length;
    const invalidsStrings: string[] = [];

    let i = -1;
    while (++i < len) {
        const [name, type, value] = invalidProperties[i];
        const string = `${name}: ${type} = ${toSimpleString(value)}\n`;
        invalidsStrings[i] = string;
    }

    throw new TypeError(
        `${len} of ${totalProperties} ${title} are invalid.\n\n` +
            "<field>: <expected type> = <received value>\n\n\n" +
            `${invalidsStrings.join("\n")}`
    );
}
