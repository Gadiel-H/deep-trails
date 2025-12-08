"use strict";

import { recordSchema, validators } from "../../../__schemas/index.js";
import type { Options } from "../../../types/deep-iterate/index";

const { string, boolean, integer, anyFunction, nullValue, typeUnion } = validators;

const checkBoolean = boolean();

/** deepIterate options schema. @internal */
export const optionsSchema = recordSchema<Options<object>>({
    iterateKeys: checkBoolean,
    iterateValues: checkBoolean,
    exposeVisitLog: checkBoolean,
    maxParentVisits: typeUnion([
        integer(0, Infinity),
        {
            __test: (val): val is number => val === Infinity,
            __type: "+Infinity",
            __description: "be the value Infinity"
        }
    ]),
    pathType: string(["array", "string"]),
    visitLogType: string(["set", "map", "array", "weakset", "weakmap", "null"]),
    callbackWrapper: typeUnion([nullValue(), anyFunction()])
});
