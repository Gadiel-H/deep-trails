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
 * Default options argument for deepIterate.
 *
 * They are necessary when an option is not entered.
 *
 * @throws TypeError if some option is of invalid type.
 *
 * @since 3.0.0-beta.0
 */
deepIterate.options = defaultOptions;

/**
 * Iterates deeply through the entries of almost any data structure or object.
 *
 * @remarks
 * - Some types of objects are excluded: Date, Promise, RegExp, Error, WeakMap, WeakSet, and functions.
 * - Circular references are avoided by default, but you can change this behavior.
 * - You can get a visit log by changing the "visitLogType" option.
 * - This function performs a depth-first search (DFS).
 *
 * **Type parameters**:
 * - **R**: Root node.
 * - **K**: Keys.
 * - **V**: Child values.
 * - **P**: Parent values.
 *
 * @param object - The root node to start the iteration.
 * @param callback - Function to execute by each node before iterating it.
 * @param options - Options to customize traversal behavior. Defaults to `deepIterate.options`.
 *
 * @returns The arguments and visit log in a plain object.
 *
 * @throws TypeError if the arguments are invalid.
 *
 * @example
 * deepIterate(
 *     { a: { b: { c: [ "d", "f", "g" ] } } },
 *     (child) => {
 *         console.log(`${child.path} = ${child.value}`)
 *     },
 *     { pathType: "string" }
 * );
 *
 * @since 3.0.0-beta.0
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
        size = iterator?.size,
        rootPath = (pathType === "string" ? "" : []) as string | K[];

    try {
        const hasEmptySize = Number.isInteger(size) ? (size as any) <= 0 : false;
        if (!iterator || hasEmptySize) {
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
