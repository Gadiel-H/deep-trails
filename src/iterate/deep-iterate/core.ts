"use strict";

// ----- Utils -----
import { isObject, typeOf, toPathString, toSimpleString } from "../../utils/public/index.js";

// ----- Iterator -----
import { makeIterator } from "./helpers/iterator-selector.js";

// ----- Types -----
import type {
    Control,
    VisitLogMap,
    VisitLogArray,
    VisitLogSet,
    CoreParams
} from "../../types/deep-iterate/index";

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
    const { maxParentVisits, visitLogType } = options;
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

        const shouldContinue = (options.onCircular as Function)({ ...context });

        if (!shouldContinue) return;
    }

    if (visits >= maxParentVisits) return;

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
    const { pathType, iterateKeys, iterateValues } = options;
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

        useEntry(newKey, newValue) {
            let code = 0;

            if (1 in arguments && !is(newValue, value)) code += 1;

            if (0 in arguments && !is(newKey, key)) code += 2;

            if (code === 0) return 0;

            newEntry = [newKey, newValue];
            newEntryCode = code as any;

            return newEntryCode;
        }
    };

    let loopDone = iterator.size != null && iterator.size <= 0;

    let finishAfterLoop: boolean = false;

    /** Obtained code on calling `control.useEntry`. */
    let newEntryCode: 0 | 1 | 2 | 3 = 0;

    /** Entry to use after calling `control.useEntry`. */
    let newEntry: [unknown, unknown] | null = null;

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

        if (pathType === "array") path = objPath.concat(key as any);
        else {
            pathStrOptions.extraKey = key;
            path = toPathString(objPath, pathStrOptions);
        }

        // ----- Callback execution -----

        try {
            (callback as any)({ key, value, index, depth, path, parentValue }, context, control);
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
                    `    At: ${toPathString(path)}\n`
            );
        }

        // ---- Check control state -----

        if (newEntry) {
            const newKey = newEntry[0],
                newValue = newEntry[1],
                code = newEntryCode;

            newEntry = null;
            newEntryCode = 0;

            if (code >= 1) value = newValue;
            if (code >= 2) {
                key = newKey;
                if (pathType === "array") {
                    (path as any[])[path.length - 1] = key;
                } else {
                    pathStrOptions.extraKey = key;
                    path = toPathString(objPath, pathStrOptions);
                }
            }
        }

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
            const iterator = makeIterator(k);
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
            const iterator = makeIterator(v);
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
