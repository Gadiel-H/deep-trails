"use strict";

import type { Options } from "../../../types/deep-iterate/index";
import { toSimpleString } from "../../../utils/public/index.js";
import { optionsSchema } from "../schemas/options-schema.js";

const optionKeys = new Set(Reflect.ownKeys(optionsSchema));
const optionsList = [...optionKeys].map(String).join("\n      ");

/** Default options argument for `deepIterate`. @internal */
export const defaultOptions = new Proxy<Options<any, any, any>>(
    {
        iterateKeys: false,
        iterateValues: true,
        exposeVisitLog: true,
        pathType: "array",
        visitLogType: "null",
        callbackWrapper: null,
        maxParentVisits: 1,
        onCircular({ visits }) {
            return visits <= this.maxParentVisits;
        }
    },
    {
        set: (obj, key: string | symbol, val: unknown) => {
            if (!(key in optionsSchema)) {
                obj[key] = val;
                throw new TypeError(
                    `Cannot define ${toSimpleString(key)} in deepIterate.options because is not defined in the schema\n` +
                        `    The known options are:\n` +
                        `      ${optionsList}\n`
                );
            }

            const knownKey = key as keyof typeof optionsSchema;
            const schemaProp = optionsSchema[knownKey];
            const description = schemaProp.__description;
            const converted = schemaProp.__convert(val);

            if (!schemaProp.__test(converted)) {
                const valString = toSimpleString(val);
                throw new TypeError(
                    `Cannot assign ${valString} to deepIterate.options.${knownKey}\n` +
                        `    It must ${description}.\n`
                );
            }

            obj[key] = converted;
            return true;
        },
        deleteProperty: (obj, key: string | symbol) =>
            !optionKeys.has(key) ? delete obj[key] : false
    }
);
