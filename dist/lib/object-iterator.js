"use strict";
import is from "./utils/types-check.js";
import { stringifyPath as strPath, stringifySimple as strSimple } from "./utils/stringify.js";
import { fTypeOf, sTypeOf } from "./utils/typeOf.js";
import { getValueAt } from "./utils/paths.js";
const iterableObjects = new Set(["Object", "Array", "Map", "Set", "Module"]);
/**
 * Default settings for deepIterate.
 * @type {deepIterateSettings}
 */
const defaultSettings = {
    iterateKeys: false,
    addIndexInSet: true,
    doNotIterate: {
        objectTypes: new Set([]),
        keyTypes: new Set([])
    }
};
/**
 * Recursively iterates over various data structures (Object, Array, Map and Set)
 * executing a callback on each element. Cycles are prevented by a WeakSet.
 * @param {iterableStructure} obj  - The object or structure to iterate.
 * @param {(key: any, value: any, path: any[]) => any} callback - Function to execute on each element. Skips iteration with return.
 * @param {deepIterateSettings} settings - Adjustment options for greater precision.
 * @param {WeakSet<iterableStructure>} visited - Set to keep track of objects already visited and avoid circular references.
 * @param {any[]} path - Array representing the current path in the structure.
 * @param {number} iterations - Total number of iterations.
 *
 * Cases handled:
 * - Regular objects: All their properties are traversed, including those with symbol type keys.
 * - Arrays: Their elements are traversed, adding the index to the path.
 * - Map: Iterates through its entries, adding the key to the path. Optionally, iterates over keys that are objects.
 * - Set: Its values are traversed, adding the key or an index to the path.
 */
function deepIterate(obj, callback, settings = defaultSettings, visited = new WeakSet(), path = [], iterations = 0) {
    (function checkParams() {
        if (!is.any_object(obj))
            throw new TypeError(`obj => The value ${strSimple(obj)} is not an object.
        
        It must be an instance of Object (plain object), Array, Map, or Set.`);
        if (!iterableObjects.has(sTypeOf(obj)))
            throw new TypeError(`obj => Cannot iterate ${sTypeOf(obj)} objects.
        They are not iterable or support has not been added.
            
        Accepted objects: Object, Array, Map, and Set.`);
        if (!is.function(callback))
            throw new TypeError(`callback => The value ${strSimple(callback)} is not a function.`);
        if (!is.plain_object(settings))
            throw new TypeError(`settings => The settings options must be a simple object.
        But a ${sTypeOf(settings)} was entered: ${strSimple(settings)}`);
        if (sTypeOf(visited) !== "WeakSet")
            throw new TypeError(`visited => The set of visited elements must be a WeakSet.
        But a ${strSimple(visited)} was entered.`);
        if (!Array.isArray(path))
            throw new TypeError(`path => The path must be an Array of keys.
        But a ${strSimple(path)} was entered.`);
        if (path.length === 0 && iterations > 0)
            throw new RangeError(`path => The keys array is empty.`);
    })();
    if (visited.has(obj))
        return;
    visited.add(obj);
    const invalidSettings = new Set();
    (function completeSettings() {
        if (!("iterateKeys" in settings))
            settings.iterateKeys = true;
        const { iterateKeys } = settings;
        if (typeof iterateKeys !== "boolean")
            invalidSettings.add([["iterateKeys"], iterateKeys]);
        if (!("addIndexInSet" in settings))
            settings.addIndexInSet = true;
        const { addIndexInSet } = settings;
        if (typeof addIndexInSet !== "boolean")
            invalidSettings.add([["addIndexInSet"], addIndexInSet]);
        if (!("doNotIterate" in settings))
            settings.doNotIterate = {
                objectTypes: new Set(), keyTypes: new Set()
            };
        if (!is.plain_object(settings.doNotIterate)) {
            invalidSettings.add([["doNotIterate"], settings.doNotIterate]);
            return;
        }
        const { doNotIterate } = settings;
        if (!("objectTypes" in settings.doNotIterate))
            settings.doNotIterate.objectTypes = new Set();
        const { objectTypes } = settings.doNotIterate;
        if (!Array.isArray(objectTypes) && sTypeOf(objectTypes) !== "Set")
            invalidSettings.add([["doNotIterate", "objectTypes"], objectTypes]);
        if (!("keyTypes" in settings.doNotIterate))
            settings.doNotIterate.keyTypes = new Set();
        const { keyTypes } = settings.doNotIterate;
        if (!Array.isArray(keyTypes) && sTypeOf(keyTypes) !== "Set")
            invalidSettings.add([["doNotIterate", "keyTypes"], keyTypes]);
    })();
    (function checkSettings() {
        let str = "";
        invalidSettings.forEach(val => str += `${strPath(val[0])} = ${strSimple(val[1])}\n`);
        if (invalidSettings.size !== 0)
            throw new TypeError(`${invalidSettings.size} options in the settings are not valid. 
            \n${str}`);
    })();
    settings.doNotIterate.objectTypes = new Set(settings.doNotIterate.objectTypes);
    settings.doNotIterate.keyTypes = new Set(settings.doNotIterate.keyTypes);
    // ========== Important data and functions ========== //
    const params = { obj, callback, settings, visited, path, iterations };
    const { iterateKeys, addIndexInSet, doNotIterate } = settings;
    /**
     * Checks if an object is iterable using deepIterate.
     * @param {object} obj
     * @returns {boolean}
     */
    function isValidIterable(obj) {
        return (typeof obj === "object") && (obj !== null)
            && (iterableObjects.has(sTypeOf(obj)));
    }
    /**
     * Checks whether an object should be iterated, relative to the *settings.doNotIterate* property.
     * @param {object} obj
     * @param {"key" | "value" | "key-value"} role
     * @returns {boolean}
     * - **"key"**: Checks if *iterateKeys* is true, or if *keyTypes* does not have the constructor (function or name).
     * - **"value"**: Check if *valueTypes* does not have the constructor (function or name).
     * - **"key-value"**: Checks if the constructor (function or name) is not in *keyTypes* or *valueTypes*.
     */
    function shouldIterate(obj, role) {
        role = String(role).trim().toLowerCase();
        if (role !== "key" && role !== "value" && role !== "key-value")
            throw new Error(`The specified role for the obj paramater is not valid.
                
                It must be: "key", "value" or "key-value"`);
        const { keyTypes, objectTypes } = settings.doNotIterate;
        const ignoredKey = (objKey) => (!is.object(objKey) ? true
            : (keyTypes.has(objKey.constructor) || keyTypes.has(sTypeOf(objKey)) || keyTypes.has(fTypeOf(objKey))));
        const ignoredValue = (objValue) => (!is.object(objValue) ? true
            : (objectTypes.has(objValue.constructor) || objectTypes.has(sTypeOf(objValue)) || objectTypes.has(fTypeOf(objValue))));
        if (role === "key") {
            return (iterateKeys === true && !ignoredKey(obj));
        }
        else if (role === "value") {
            return !ignoredValue(obj);
        }
        else {
            return (!ignoredKey(obj) || !ignoredValue(obj));
        }
    }
    /**
     * Call deepIterate with the current parameters to iterate a key or value.
     * It will only be iterated if the object is valid and no request was made not to iterate.
     * @param {typeof params} args - The parameters to pass to deepIterate.
     * @param {"key" | "value" | "key-value"} role - The role of the object to iterate.
     * @returns {void}
     */
    function iterateSubObject(args = params, role) {
        role = String(role).trim().toLowerCase();
        if (role !== "key" && role !== "value" && role !== "key-value")
            throw new TypeError(`The role is invalid: ${strSimple(role)}`);
        const { obj, callback, settings, visited, path, iterations } = args;
        if (isValidIterable(obj) && shouldIterate(obj, role)) {
            deepIterate(obj, callback, settings, visited, path, (iterations + 1));
        }
    }
    // ========== Ways to iterate structures ========== //
    // Special case: Map -- Optionally iterates over keys that are valid objects.
    if (obj instanceof Map) {
        obj.forEach((value, key) => {
            params.path = path.concat(is.Array(key) ? [key] : key);
            callback(key, value, params.path);
            params.obj = key;
            iterateSubObject(params, "key");
            params.obj = value;
            iterateSubObject(params, "value");
        });
        return;
    }
    // Special case: Set -- Optionally use an index as a key.
    if (obj instanceof Set) {
        let index = 0;
        obj.forEach((value, key) => {
            const _key = (addIndexInSet ? index : key);
            params.path = path.concat(Array.isArray(key) ? [key] : key);
            callback(_key, value, params.path);
            params.obj = value;
            iterateSubObject(params, "value");
            index++;
        });
        return;
    }
    // Case: Array ---------- Iterates valid objects.
    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            params.path = path.concat(index);
            callback(index, item, params.path);
            params.obj = item;
            iterateSubObject(params, "value");
        });
        return;
    }
    // Case: simple object - Includes properties with keys of type string and symbol.
    if (is.plain_object(obj)) {
        const stringKeys = Object.getOwnPropertyNames(obj);
        const symbolKeys = Object.getOwnPropertySymbols(obj);
        const keys = stringKeys.concat(symbolKeys);
        keys.forEach(key => {
            params.path = path.concat(key);
            const value = obj[key];
            callback(key, value, params.path);
            params.obj = value;
            iterateSubObject(params, "value");
        });
    }
}
/**
 * Get more information about each iteration in deepIterate by entering the parameters you got with the callback;
 * and optionally, the main object (*obj* parameter of deepIterate).
 * @param {any} key - Current key.
 * @param {any} value - Current value.
 * @param {any[]} path - Current array of keys.
 * @param {iterableStructure} obj - Main object (optional).
 * @returns {contextInfo} {Record<string, (string | number | Object)>}
 */
deepIterate.help = function (key, value, path, obj) {
    (function checkParams() {
        if (!Array.isArray(path))
            throw new TypeError(`path => The value ${strSimple(path)} is not an array.`);
        if (path.length === 0)
            throw new RangeError(`path => The array is empty.`);
        if (!is.object(obj) && obj !== undefined)
            throw new TypeError(`obj => The value ${strSimple(obj)} is not an object or it is a function.`);
        if (!iterableObjects.has(sTypeOf(obj)) && obj !== undefined)
            throw new TypeError(`obj => Values or objects of type ${sTypeOf(obj)} are not accepted.`);
    })();
    const parentPath = path.slice(0, (path.length - 1));
    const parentKey = (path.length > 1
        ? path[path.length - 2]
        : is.object(obj)
            ? obj : undefined);
    const constructorOf = (obj) => (!is.any_object(obj) ? undefined
        : !Object.getOwnPropertyNames(obj).includes("constructor")
            ? obj.constructor : undefined);
    const parentInfo = {
        depth: parentPath.length,
        path: parentPath.length > 0 ? parentPath : undefined,
        strPath: parentPath.length > 0 ? strPath(parentPath) : undefined,
        key: parentKey,
        keyType: parentPath.length > 0 ? sTypeOf(parentKey) : undefined,
        strKey: parentPath.length > 0 ? strSimple(parentKey) : undefined,
        constructor: undefined
    };
    const data = {
        depth: path.length,
        strPath: strPath(path),
        keyType: sTypeOf(key),
        strKey: strSimple(key),
        keyConstructor: constructorOf(key),
        valueType: sTypeOf(value),
        strValue: strSimple(value),
        valueConstructor: constructorOf(value),
        parent: parentInfo
    };
    if (!is.object(obj))
        return data;
    const parent = parentPath.length > 0 ? getValueAt(obj, parentPath) : obj;
    Object.assign(data.parent, {
        value: parent,
        valueType: sTypeOf(parent),
        strValue: strSimple(parent),
        constructor: constructorOf(parent),
        numOfEntries: is.object(parent) ? (is.Map(parent) || is.Set(parent)
            ? parent.size
            : Object.keys(parent).length) : undefined
    });
    return data;
};
export { deepIterate, defaultSettings };
