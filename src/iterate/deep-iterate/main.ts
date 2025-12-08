"use strict";

// ----- Types -----
import type { Callback, Options, CoreParams, CallbackThis } from "../../types/deep-iterate/index";

// ----- Helpers -----
import { validateObject } from "../../__schemas/index.js";
import { defaultOptions } from "./helpers/default-options.js";
import { paramsSchema } from "./schemas/params-schema.js";
import { toPathString } from "../../utils/public/index.js";
import { createLog } from "./helpers/log-creators.js";

// ----- Core -----
import { makeIterator } from "./helpers/iterator-selector.js";
import { deepIterateCore } from "./core.js";

/**
 * Default options for deepIterate.
 * They are necessary when an option is not entered.
 *
 * @throws TypeError if some option is of invalid type.
 */
deepIterate.options = defaultOptions;

/**
 * Iterates deeply through the entries of a data structure or the own properties of a plain object.
 *
 * @param object - The object to iterate.
 * @param callback - Function to execute on each node.
 * @param options - Options to better control the traverse.
 *
 * @returns The arguments and visit log in a plain object.
 * @throws TypeError if the arguments are invalid.
 *
 * Type arguments:
 * - **R**: Root node.
 * - **K**: Keys.
 * - **V**: Child values.
 * - **P**: Parent values.
 *
 * @example
 * deepIterate(
 *     { a: { b: { c: [ "d", "f", "g" ] } } },
 *     function ({ path, depth }) {
 *         if (depth !== 4) return;
 *
 *         console.log(`Path - ${path} | Depth - ${depth}`);
 *     }
 * );
 */
export function deepIterate<R extends P, K = unknown, V = unknown, P extends object = object>(
    object: R,
    callback: Callback<P, K, V, R> = () => {},
    options: Partial<Options<P, K, V>> = deepIterate.options
): CallbackThis<R, K, V, P> {
    validateObject(
        { object, callback, options },
        paramsSchema,
        /// @ts-ignore
        options !== deepIterate.options ? { options: deepIterate.options } : {},
        "inputs in deepIterate"
    );

    /// @ts-ignore
    let __options: Options<P, K, V> = { ...options };

    const { pathType, callbackWrapper } = __options;
    const { exposeVisitLog, visitLogType } = __options;
    const visitLog = createLog[visitLogType]();

    let callbackOrigin: CoreParams<P, K, V>["cbAlias"];
    let __callback = callback;

    if (callbackWrapper) {
        __callback = callbackWrapper;
        callbackOrigin = "options.callbackWrapper";
    } else {
        __callback = callback;
        callbackOrigin = "The callback";
    }

    const params: CallbackThis<R, K, V, P> = {
        root: object,
        callback,
        options
    };

    __callback = __callback.bind(params);

    if (exposeVisitLog) params.visitLog = visitLog;

    const finishedSymbol = Symbol("FINISH"),
        iterator = makeIterator(object),
        rootPath = (pathType === "string" ? "" : []) as string | K[];

    try {
        if (!iterator || (iterator.size as number) <= 0) {
            throw finishedSymbol;
        }

        deepIterateCore<P>({
            object: object,
            callback: __callback,
            options: __options,
            visitLog: visitLog,

            visitsCounter: new Map([[object, 0]]),
            cbAlias: callbackOrigin,

            utils: {
                finishedSymbol,
                toPathStringOptions: toPathString.options
            },

            iterator: iterator,
            context: {
                value: object,
                depth: 0,
                path: rootPath,
                role: "root",
                visits: 0,
                index: -1,
                key: null,
                parentValue: null,
                size: iterator.size
            }
        });
    } catch (value) {
        if (value !== finishedSymbol) throw value;
    }

    params.visitLog = visitLog;

    return params;
}

Object.defineProperty(deepIterate, "options", {
    value: defaultOptions,
    writable: false,
    configurable: false,
    enumerable: true
});
