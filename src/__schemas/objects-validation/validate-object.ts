"use strict";

import type { Schema, Dictionary } from "../types/index";
import { isSchema } from "../record-schema.js";
import { toSimpleString } from "../../utils/public/index.js";
import { throwInvalids, getInvalidsStatus } from "./index.js";

/**
 * Ensures that an object is valid based on a schema.
 *
 * @remarks
 * - Uses {@linkcode throwInvalids} if there are invalid properties.
 * - Uses {@linkcode getInvalidsStatus} to check the object.
 * - Fills missing properties from `defaultObject`.
 * - Tries converting properties to the correct type.
 *
 * @example
 * const schema   = { name: string(),  id: string() };
 * const defaults = { name: "unknown", id: "000"    };
 * const object   = { name: null };
 * const title    = "fields in the user data";
 *
 * validateObject(object, schema, defaults, title);
 * // TypeError: 1 of 2 fields in the user data are invalid.
 * //
 * // <field>: <expected type> = <received value>
 * //
 * //
 * // name: string = null
 * //
 * @internal
 */
export function validateObject<T extends Dictionary>(
    object: Partial<T> | T,
    schema: Schema<T>,
    defaultObject: T | {},
    title: string
): asserts object is T {
    if (!isSchema(schema)) {
        throw new TypeError(
            `${toSimpleString(schema)} is not a schema or is not known.\n` +
                "    If is valid, record it with `recordSchema`.\n"
        );
    }

    const { invalidsList, totalProps } = getInvalidsStatus(object, schema, defaultObject, {
        totalProps: 0,
        currentPath: [],
        invalidsList: []
    });

    if (invalidsList.length > 0) {
        throwInvalids(invalidsList, totalProps, title);
    }
}
