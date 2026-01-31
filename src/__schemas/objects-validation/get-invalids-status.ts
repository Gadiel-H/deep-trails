"use strict";

import type { Schema, InvalidsList } from "../types/index.js";
import { isSchema } from "../record-schema.js";
import { isNoFnObject, toPathString, toSimpleString } from "../../utils/public/index.js";

const notProvided = Symbol("NOT-PROVIDED");

/**
 * Recursively checks an object based on a schema and collects invalid properties.
 *
 * @param object - The object to validate.
 * @param schema - The schema to validate against.
 * @param defaults - Default values for the object properties.
 * @param status - An object to keep track of the validation status.
 * @returns The updated status object containing total properties checked and invalids list.
 *
 * @internal
 */
export function getInvalidsStatus<T extends object>(
    object: T | Partial<T>,
    schema: Schema<T>,
    defaults: T | Partial<T> | null,
    status: {
        totalProps: number;
        currentPath: string;
        invalidsList: InvalidsList;
    }
): typeof status {
    const parentPath = status.currentPath;

    type Key = keyof typeof schema;
    const schemaKeys = new Set(Reflect.ownKeys(schema)) as Set<Key>;

    for (const key of schemaKeys) {
        status.totalProps++;

        const validator = schema[key];
        const subSchema = validator.__subSchema;

        let value: unknown = notProvided;
        let valueString: string = "<not provided>";
        let path = "";

        if (key in object) {
            value = object[key];
        } else if (defaults && key in defaults) {
            value = object[key] = defaults[key];
        }

        if (value !== notProvided) {
            value = validator.__convert(value);
            valueString = toSimpleString(value);
        }

        if (value === notProvided || !validator.__test(value)) {
            const type = validator.__type;
            path = toPathString(status.currentPath, {
                extraKey: key,
                useBrackets: false
            });

            status.invalidsList.push([path, type, valueString]);
        }

        if (subSchema && isNoFnObject(value) && isSchema(subSchema)) {
            let nextDefaults = defaults?.[key] || null;

            status.currentPath =
                path.length > 0
                    ? path
                    : toPathString(status.currentPath, {
                          extraKey: key,
                          useBrackets: false
                      });

            getInvalidsStatus(value, subSchema, nextDefaults, status);
        }
    }

    const objKeys = Reflect.ownKeys(object);

    for (const key of objKeys) {
        if (!schemaKeys.has(key as any)) {
            const valueString = toSimpleString(object[key]);
            const path = toPathString(parentPath, {
                extraKey: key,
                useBrackets: false
            });

            status.invalidsList.push([path, "unexpected", valueString]);
        }
    }

    return status;
}
