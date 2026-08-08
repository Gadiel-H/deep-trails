"use strict";

import type { Options, LightEntriesIterator } from "../../../types/deep-iterate/index";
import { isArrayLike } from "../../../utils/public/index.js";
import { getterWrapper } from "./getter-wrapper.js";
import { LightPropsIterator } from "./light-props-iterator.js";

const arrayKeys = Array.prototype.keys;
const arrayValues = Array.prototype[Symbol.iterator];
const arrayEntries = Array.prototype.entries;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasEntries = (obj: any): obj is { entries: () => LightEntriesIterator } =>
    typeof obj.entries === "function" && !hasOwnProperty.call(obj, "entries");

type KeysIterator = Iterator<PropertyKey, null | undefined, never> & {
    size?: number;
    source?: LightEntriesIterator["source"];
};

/**
 * Returns an entries iterator for an object of an accepted type, or null otherwise.
 * @internal
 */
export function makeIterator<T extends object>(
    object: T,
    onGetter: Options<T, any, any>["onGetter"]
): LightEntriesIterator | null {
    if (typeof object === "function") return null;

    if (
        object instanceof WeakSet ||
        object instanceof WeakMap ||
        object instanceof Date ||
        object instanceof RegExp ||
        object instanceof Promise ||
        object instanceof Error
    ) {
        return null;
    }

    let keysIter: KeysIterator;

    if (isArrayLike(object)) {
        if (onGetter === "execute") {
            const iter = arrayEntries.call(object) as LightEntriesIterator;
            iter.size = object.length;
            iter.source = "ownProperties";
            return iter;
        }

        keysIter = arrayKeys.call(object) as KeysIterator;
        keysIter.size = object.length;
    } else if (hasEntries(object)) {
        let iter: LightEntriesIterator;

        try {
            iter = object.entries();
        } catch {
            return null;
        }

        if (object instanceof Map || object instanceof Set) {
            iter.size = object.size;
        }

        iter.source = "entriesMethod";

        return iter;
    } else {
        if (onGetter === "execute") {
            return LightPropsIterator(object);
        }

        const keys = Reflect.ownKeys(object);

        keysIter = arrayValues.call(keys);
        keysIter.size = keys.length;
        keysIter.source = "ownProperties";
    }

    // Wrap the iterator to handle getters and errors
    const getKey = keysIter.next.bind(keysIter);
    const entriesIter = keysIter as LightEntriesIterator;

    entriesIter.next = () => {
        const keyResult = getKey(),
            done = keyResult.done as boolean,
            key = keyResult.value;

        if (done || key == null) return { done: true, value: null };

        const desc = Object.getOwnPropertyDescriptor(object, key) as PropertyDescriptor;
        const { get } = desc;

        if (!get) {
            return { done, value: [key, object[key]] };
        }

        const descWithGet = desc as PropertyDescriptor & { get: Function };

        if (onGetter === "catch-error") {
            const { value, error } = getterWrapper({ parentValue: object }, { get });

            if (error) {
                return { done, value: [key, undefined, descWithGet, error] };
            }

            return { done, value: [key, value] };
        }

        return { done, value: [key, undefined, descWithGet] };
    };

    return entriesIter;
}
