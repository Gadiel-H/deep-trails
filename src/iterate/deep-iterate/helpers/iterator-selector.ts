"use strict";

import { type Options } from "../../../types/deep-iterate/index";
import { isArrayLike, typeOf } from "../../../utils/public/index.js";
import { getterWrapper } from "./getter-wrapper.js";
import { LightPropsIterator } from "./light-props-iterator.js";

const arrayKeys = Array.prototype.keys;
const arrayValues = Array.prototype[Symbol.iterator];
const arrayEntries = Array.prototype.entries;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasEntries = (obj: any): obj is { entries: Function } =>
    typeof obj.entries === "function" && !hasOwnProperty.call(obj, "entries");

/** @internal */
type InternalEntriesIterator = Iterator<
    any,
    any,
    [key: unknown, value: unknown, desc?: PropertyDescriptor, error?: unknown] | null
> & { size: number | undefined };

/**
 * Returns an entries iterator for an object of an accepted type, or null otherwise.
 * @internal
 */
export function makeIterator<T extends object>(
    object: T,
    onGetter: Options<T, any, any>["onGetter"]
): InternalEntriesIterator | null {
    if (typeof object === "function") return null;

    const type = typeOf(object);

    if (
        type === "WeakSet" ||
        type === "WeakMap" ||
        type === "Date" ||
        type === "RegExp" ||
        type === "Promise" ||
        object instanceof Error
    ) {
        return null;
    }

    let iterator: InternalEntriesIterator | null = null;

    if (isArrayLike(object)) {
        if (onGetter === "execute") {
            return arrayEntries.call(object) as any as InternalEntriesIterator;
        }

        iterator = arrayKeys.call(object) as any as InternalEntriesIterator;
        iterator.size = object.length;
    } else if (hasEntries(object)) {
        try {
            iterator = object.entries() as InternalEntriesIterator;
            iterator.size = undefined;
        } catch {
            return null;
        }

        if (object instanceof Map || object instanceof Set) {
            iterator.size = object.size;
        }

        return iterator;
    } else {
        if (onGetter === "execute") {
            return LightPropsIterator(object) as any as InternalEntriesIterator;
        }

        const keys = Reflect.ownKeys(object);

        iterator = arrayValues.call(keys) as any as InternalEntriesIterator;
        iterator.size = keys.length;
    }

    // Wrap the iterator to handle getters and errors
    const getKey = iterator.next.bind(iterator);

    iterator.next = () => {
        const keyResult = getKey(),
            done = keyResult.done as boolean,
            key = keyResult.value;

        if (done) return { done: true, value: null };

        const desc = Object.getOwnPropertyDescriptor(object, key) as PropertyDescriptor;
        const { get } = desc;

        if (!get) {
            return { done, value: [key, object[key]] };
        }

        if (onGetter === "catch-error") {
            const { value, error } = getterWrapper({ parentValue: object }, { get });

            if (error) {
                return { done, value: [key, undefined, desc, error] };
            }

            return { done, value: [key, value] };
        }

        return { done, value: [key, undefined, desc] };
    };

    return iterator;
}
