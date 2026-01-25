"use strict";

import type { Schema, InvalidsList } from "../types/index.js";
import { isSchema } from "../record-schema.js";
import { isNoFnObject, toPathString } from "../../utils/public/index.js";

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
    type Key = keyof typeof schema;
    const keys = Reflect.ownKeys(schema) as Key[];

    for (const key of keys) {
        status.totalProps++;

        const validator = schema[key];
        const subSchema = validator.__subSchema;

        let value = object[key];
        let path = "";

        if (!(key in object)) {
            if (defaults && key in defaults) {
                value = validator.__convert(defaults[key]);
            }

            object[key] = value;
        } else {
            value = validator.__convert(value);
        }

        if (!validator.__test(value)) {
            const type = validator.__type;
            path = toPathString(status.currentPath, {
                extraKey: key,
                useBrackets: false
            });

            status.invalidsList.push([path, type, value]);
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

    return status;
}
