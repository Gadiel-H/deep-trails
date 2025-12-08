"use strict";

import { toFunctionString } from "./to-string/index.js";

const safeIntRegexp = /^\s*(?:[+-]?(?:0|[1-9]\d*)|0[xX][0-9a-fA-F]+)\s*$/;
const { MAX_SAFE_INTEGER } = Number;
const isNumInteger = Number.isInteger;

/** Object with functions to validate some types of data. */
export const checkers = {
    /**
     * Checks whether a value is an object, excluding functions.
     *
     * @example
     * isNoFnObject(Object)  // false
     * isNoFnObject(null)    // false
     * isNoFnObject([])      // true
     */
    isNoFnObject: <T>(obj: T): obj is Exclude<T, Function> & object =>
        obj != null && typeof obj === "object",

    /**
     * Checks whether a value is an object of any type.
     *
     * @example
     * isObject([ 0, 1 ])  // true
     * isObject(() => {})  // true
     * isObject(/^abc$/i)  // true
     * isObject(null)      // false
     */
    isObject: (obj: unknown): obj is object => {
        if (obj == null) return false;

        const type = typeof obj;
        return type === "object" || type === "function";
    },

    /**
     * Checks whether a value is a non-function object
     * and its prototype is `null` or `Object.prototype`.
     *
     * @example
     * isPlainObject({ key: "value" })     // true
     * isPlainObject(JSON.parse("{}"))     // true
     * isPlainObject(Object.create(null))  // true
     * isPlainObject(new Object())         // true
     */
    isPlainObject: <T>(obj: T): obj is Record<PropertyKey, any> => {
        if (obj == null || typeof obj !== "object") return false;

        const proto = Object.getPrototypeOf(obj);
        return proto === null || proto === Object.prototype;
    },

    /**
     * Checks whether a value is an integer of type "bigint", "number" or
     * "string" that can be converted with `Number`, `BigInt`, and `parseInt`.
     *
     * @example
     * isInteger(0)         // true
     * isInteger(252n)      // true
     * isInteger("-87 ")    // true
     * isInteger("0x34")    // true
     * isInteger("20e5")    // false
     */
    isInteger: (int: any): boolean => {
        const type = typeof int;

        if (type === "bigint") return true;

        if (type !== "string") return type === "number" && isNumInteger(int);

        return safeIntRegexp.test(int);
    },

    /**
     * Checks whether a value is ArrayLike.
     *
     * A value is considered ArrayLike if:
     * - It is a string or a non-function object.
     * - It has a "length" property that is a non-negative integer.
     * - Its length does not exceed `Number.MAX_SAFE_INTEGER`.
     * - It has the last index if its length is greater than 0.
     *
     * @example
     * const max = Number.MAX_SAFE_INTEGER;
     * isArrayLike("Some string")            // true
     * isArrayLike({ 0: "a", length: 1.5 })  // false (length not integer)
     * isArrayLike({ 0: "a", length: 2 })    // false (missing last index)
     * isArrayLike({ 0: 346, length: 1n })   // false (length of type "bigint")
     */
    isArrayLike: <V = any>(value: any): value is ArrayLike<V> => {
        const type = typeof value;

        if (type === "string") return true;
        if (!value || type !== "object") return false;

        const len = value.length;

        if (!isNumInteger(len) || len < 0) return false;
        if (len > MAX_SAFE_INTEGER) return false;

        return len === 0 || len - 1 in value;
    },

    // --- Function types

    /**
     * Checks whether a value is any function.
     *
     * @example
     * isFunction(class Trail {})  // true
     * isFunction(async () => {})  // true
     * isFunction(function () {})  // true
     */
    isFunction: (fn: unknown): fn is (...args: any[]) => any => typeof fn === "function",

    /**
     * Checks whether a value is an arrow function according to its string representation.
     *
     * @example
     * isArrowFunction((...args) => {})  // true
     * isArrowFunction(new Function())   // false
     * isArrowFunction(function () {})   // false
     */
    isArrowFunction: (fn: unknown): fn is (...args: any[]) => any => {
        if (typeof fn !== "function") return false;

        const string = toFunctionString(fn);
        return string.startsWith("[Arrow") || string.startsWith("[AsyncArrow");
    },

    /**
     * Checks whether a value is an asynchronous function according to its string representation.
     *
     * @example
     * isAsyncFunction(async () => {})         // true
     * isAsyncFunction(async function () {})   // true
     * isAsyncFunction(() => new Promise(cb))  // false
     * isAsyncFunction({ async() {} }.async)   // false
     */
    isAsyncFunction: (fn: unknown): fn is (...args: any[]) => Promise<any> => {
        if (typeof fn !== "function") return false;

        return toFunctionString(fn).startsWith("[Async");
    },

    /**
     * Checks whether a value is a generator function according to its string representation.
     *
     * @example
     * isGeneratorFunction(function* () {})        // true
     * isGeneratorFunction({ *fn() {} }.fn)        // true
     * isGeneratorFunction(async function* () {})  // true
     */
    isGeneratorFunction: (fn: unknown): fn is GeneratorFunction => {
        if (typeof fn !== "function") return false;

        const string = toFunctionString(fn);
        return string.startsWith("[Generator") || string.startsWith("[AsyncGenerator");
    },

    /**
     * Checks whether a value is a native function according to its string representation.
     *
     * @example
     * isNativeFunction(Array)             // true
     * isNativeFunction(Map)               // true
     * isNativeFunction((() => 0).bind())  // true
     */
    isNativeFunction: (fn: unknown): fn is Function => {
        if (typeof fn !== "function") return false;

        return toFunctionString(fn).startsWith("[Native");
    },

    /**
     * Checks wheter a value is a bound function according to its name and string representation.
     *
     * @example
     * isBoundFunction((() => 0).bind())     // true
     * isBoundFunction(String.bind())        // true
     * isBoundFunction(function bound() {})  // false
     */
    isBoundFunction: (fn: unknown): fn is Function =>
        isNativeFunction(fn) && fn.name.startsWith("bound ")
};

const { isNativeFunction } = checkers;
