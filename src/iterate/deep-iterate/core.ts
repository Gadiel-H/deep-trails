"use strict";

// ----- Utils -----
import {
    isObject,
    typeOf,
    toPathString,
    toSimpleString,
    isNoFnObject
} from "../../utils/public/index.js";

// ----- Iterator -----
import { makeIterator } from "./helpers/iterator-selector.js";

// ----- Types -----
import type {
    Control,
    VisitLogMap,
    VisitLogArray,
    VisitLogSet,
    CoreParams,
    ChildContext,
    ChildBaseContext
} from "../../types/deep-iterate/index";

const { hasOwnProperty } = Object.prototype;
const { isInteger } = Number;
const { is } = Object;

/**
 * Recursively iterates over the nodes of a nested object, calling a callback at each one.
 * @internal
 */
export const deepIterateCore = <T extends object>(params: CoreParams<T>): void => {
    // ========== Check if should continue ========== //

    const { object, visitLog, options, utils } = params;
    const { iterator, visitsCounter, context } = params;
    const { visitLogType } = options;
    const pathStrOptions = utils.toPathStringOptions;

    let visits = visitsCounter.get(object) || 0;
    context.visits = visits;
    context.size = iterator.size;

    if (visits > 0) {
        const { onCircular } = options;

        if (onCircular === "skip-node") return;
        if (onCircular === "throw-error") {
            const { path, depth, role } = context;
            delete pathStrOptions.extraKey;

            throw new ReferenceError(
                `A circular node was found at:\n\n` +
                    `    path   =  ${toPathString(path, pathStrOptions)}\n` +
                    `    depth  =  ${depth}\n` +
                    `    role   =  ${role}\n\n` +
                    `    You can avoid this error by assigning "skip-node" to options.onCircular\n`
            );
        }

        const shouldContinue = (options.onCircular as Function)({ ...context }) === "iterate";

        if (!shouldContinue) return;
    }

    visits++;
    visitsCounter.set(object, visits);
    context.visits = visits;

    if (visitLog) {
        if (visitLogType === "array") {
            (visitLog as VisitLogArray<T>).push(context);
        } else if (visitLogType === "set" || visitLogType === "weakset") {
            (visitLog as VisitLogSet<T>).add(object);
        } else {
            const log = visitLog as VisitLogMap<T>;
            const history = log.get(object);

            if (history) history.push(context);
            else log.set(object, [context]);
        }
    }

    // ========== Get context and create state variables ========== //

    const { path: objPath, depth: objDepth, value: parentValue } = context;
    const { pathType, iterateKeys, iterateValues, onGetter } = options;
    const { callback } = params;
    const depth = objDepth + 1;

    const control: Control = {
        skipNode: false,
        skipValue: false,
        skipKey: false,

        stopParentAfterNode: false,
        stopParentNow: false,

        finishAfterNode: false,
        finishNow: false,

        setValue(newValue, forceDescriptor = false) {
            if (!(0 in arguments)) {
                return { ok: false, errorCode: "MISSING_VALUE" };
            }

            if (is(value, newValue)) {
                return { ok: false, errorCode: "SAME_VALUE" };
            }

            if (parentValue instanceof Set) {
                return { ok: false, errorCode: "CANNOT_CHANGE_SET" };
            }

            const propKey = key as PropertyKey;
            const parentWithSet = parentValue as T & { set?(key: any, value: any): unknown };

            if (iterator.source === "ownProperties") {
                const desc = Object.getOwnPropertyDescriptor(
                        parentValue,
                        propKey
                    ) as PropertyDescriptor,
                    configurable = Boolean(desc.configurable),
                    isReadonly = !Boolean(desc.writable),
                    canForceConfig = configurable && forceDescriptor;

                if (isReadonly && !canForceConfig) {
                    return { ok: false, errorCode: "READONLY_PROPERTY" };
                }

                if (isReadonly) {
                    const enumerable = Boolean(desc.enumerable);
                    const newDescriptor = {
                        value: newValue,
                        writable: true,
                        enumerable,
                        configurable
                    };
                    Object.defineProperty(parentValue, propKey, newDescriptor);
                }

                try {
                    parentValue[propKey] = newValue;
                } catch (error) {
                    return { ok: false, errorCode: "SETTER_ERROR", error };
                }
            } else if (
                !hasOwnProperty.call(parentWithSet, "set") &&
                typeof parentWithSet.set === "function"
            ) {
                parentWithSet.set(key, newValue);
            } else {
                return { ok: false, errorCode: "HAS_OWN_SET_METHOD" };
            }

            value = newValue;
            return { ok: true };
        }
    };

    let loopDone = iterator.size != null && iterator.size <= 0;

    let finishAfterLoop: boolean = false;

    /** Value of each node. */ let value: unknown;
    /** Key of each node.   */ let key: unknown;
    /** Index of each node. */ let index: number = -1;
    /** Path of each node.  */ let path: unknown[] | string;

    // ========== Iterate the object ========== //

    while (!loopDone) {
        const { done, value: entry } = iterator.next();

        loopDone = done as boolean;
        if (loopDone || !entry) break;

        key = entry[0];
        value = entry[1];
        index += 1;

        if (pathType === "array") {
            path = objPath.slice();
            (path as any[]).push(key);
        } else {
            pathStrOptions.extraKey = key;
            path = toPathString(objPath, pathStrOptions);
        }

        const childBaseCtx: ChildBaseContext<T> = {
            key,
            index,
            depth,
            path,
            parentValue
        };

        const childCtx = childBaseCtx as ChildContext<T>;

        if (3 in entry && options.onGetter === "catch-error") {
            childCtx.value = undefined;
            childCtx.getterError = Object.assign(
                new Error(
                    `Error reading "${toPathString(path, { notation: "mixed" })}" due to is getter`
                ),
                { cause: entry[3] }
            );
        } else if (2 in entry && typeof options.onGetter === "function") {
            const result = options.onGetter(childBaseCtx, entry[2]);

            if (!isNoFnObject(result)) {
                throw new TypeError(
                    `options.onGetter returned ${toSimpleString(result)}\n\n` +
                        `    Expected an object of type "{ value: V }" or "{ error: unknown }"\n`
                );
            }

            if (result && "error" in result) {
                childCtx.value = undefined;
                childCtx.getterError = Object.assign(
                    new Error(
                        `Error reading "${toPathString(path, { notation: "mixed" })}" due to is getter`
                    ),
                    { cause: result.error }
                );
            } else {
                childCtx.value = result.value;
                childCtx.getterError = null;
            }
        } else {
            childCtx.value = value;
            childCtx.getterError = null;
        }

        // ----- Callback execution -----

        try {
            (callback as any)(childCtx, context, control);
        } catch (caught) {
            let action = "",
                error = "";

            if (caught && caught instanceof Error) {
                action = "failed";
                error = `${caught.name}: ${caught.message}`;
            } else {
                action = "thrown this";
                error = toSimpleString(caught);
            }

            throw new Error(
                `${params.cbAlias} has ${action} whitin an object of type ${typeOf(object)}:\n\n` +
                    `    ${error}\n\n` +
                    `    At: ${toPathString(path)}\n`,
                // @ts-ignore
                { cause: caught }
            );
        }

        // ---- Check control state -----

        const { finishNow, finishAfterNode, stopParentNow } = control;

        if (finishNow) {
            finishAfterLoop = true;
            break;
        }
        if (finishAfterNode) {
            finishAfterLoop = loopDone = true;
        }
        if (stopParentNow) break;

        const { stopParentAfterNode, skipNode } = control;

        if (stopParentAfterNode) loopDone = true;

        if (skipNode) {
            control.skipNode = false;
            continue;
        }

        // ----- Check if should iterate -----

        // --- Key ---

        if (iterateKeys && !control.skipKey && isObject(key)) {
            control.skipKey = false;
            const k = key as T;
            const iterator = makeIterator(k, onGetter);
            const size = iterator?.size;
            const hasEmptySize = isInteger(size) ? (size as number) <= 0 : false;

            if (iterator && !hasEmptySize) {
                params.iterator = iterator;
                params.object = k;
                params.context = {
                    key,
                    value: k,
                    index,
                    depth,
                    path,
                    size: undefined,
                    role: "key",
                    parentValue,
                    visits: 0
                };

                deepIterateCore(params);
            }
        }

        // --- Value ---

        if (iterateValues && !control.skipValue && isObject(value)) {
            control.skipValue = false;
            const v = value as T;
            const iterator = makeIterator(v, onGetter);
            const size = iterator?.size;
            const hasEmptySize = isInteger(size) ? (size as number) <= 0 : false;

            if (iterator && !hasEmptySize) {
                params.iterator = iterator;
                params.object = v;
                params.context = {
                    key,
                    value: v,
                    index,
                    depth,
                    path,
                    size: undefined,
                    role: "value",
                    parentValue,
                    visits: 0
                };

                deepIterateCore(params);
            }
        }
    }

    if (finishAfterLoop) throw utils.finishedSymbol;
};
