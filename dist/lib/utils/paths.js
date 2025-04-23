"use strict";
import is from "./types-check.js";
import { sTypeOf } from "./typeOf.js";
import { stringifySimple as strSimple, stringifyPath as strPath } from "./stringify.js";
/**
 * Gets the value of a given path in an object based on an array of keys.
 * @param {object} obj - The object from which the value is obtained.
 * @param {any[]} path - Array of keys representing the path to the property.
 * @returns {any | Error}
 */
function getValueAt(obj, path) {
    (function checkParams() {
        if (!is.any_object(obj))
            throw new TypeError(`obj => The value ${strSimple(obj)} is not an object.`);
        if (!Array.isArray(path))
            throw new TypeError(`path => The value ${strSimple(path)} is not an array.`);
        if (path.length === 0)
            throw new RangeError(`path => The array is empty.`);
    })();
    let currentObj;
    let previousObj = obj;
    let currentPath = [];
    let previousPath = [];
    for (let i = 0; i < path.length; i++) {
        const currentKey = path[i];
        const prevType = sTypeOf(previousObj);
        currentPath = previousPath.concat(currentKey);
        if (!is.any_object(previousObj))
            throw new TypeError(`The previous value ${strSimple(previousObj)} is not an object.
            Therefore, the specified path cannot be searched.
            
            previousPath = ${strPath(previousPath)}
            providedPath = ${strPath(path)}`);
        if (prevType === "Map" || prevType === "WeakMap") {
            if (!previousObj.has(currentKey))
                throw new Error(`The key ${strSimple(currentKey)} doesn't exists at the previous ${sTypeOf(previousObj)} object.
            
            currentPath = ${strPath(currentPath)}
            providedPath  = ${strPath(path)}`);
            currentObj = previousObj.get(currentKey);
        }
        else if (prevType === "Set" || prevType === "WeakSet") {
            if (!previousObj.has(currentKey))
                throw new Error(`The key-value ${strSimple(currentKey)} doesn't exists at previous ${sTypeOf(previousObj)} object.
                
                currentPath = ${strPath(currentPath)}
                providedPath = ${strPath(path)}`);
            currentObj = currentKey;
        }
        else {
            try {
                currentObj = previousObj[currentKey];
            }
            catch (_a) {
                throw new Error(`The specified path does not exist in the provided ${sTypeOf(obj)} object.
                    
                     currentPath = ${strPath(currentPath)}
                     providedPath = ${strPath(path)}`);
            }
            ;
        }
        previousObj = currentObj;
        previousPath = currentPath;
    }
    return previousObj;
}
/**
 * Checks if a path exists on an object.
 * @requires getValueAt
 * @param {object} obj - Object.
 * @param {any[]} path - Array of keys.
 * @returns {boolean}
 */
function pathExistsAt(obj, path) {
    try {
        getValueAt(obj, path);
        return true;
    }
    catch (_a) {
        return false;
    }
    ;
}
/**
 * Adds or modifies a value at a certain path within an object.
 * @requires getValueAt
 * @param {object} target - Object whose path will change value.
 * @param {any[]} path - Path of the property where the value will be saved.
 * @param {any} value - Value to be set.
 * @returns {void | Error}
 */
function setValueAt(target, path, value) {
    (function checkParams() {
        if (!is.any_object(target))
            throw new TypeError(`target => The value ${strSimple(target)} is not an object.`);
        if (!Array.isArray(path))
            throw new TypeError(`path => The value ${strSimple(path)} is not an array.`);
        if (path.length === 0)
            throw new RangeError(`path => The keys array is empty.`);
        if (!pathExistsAt(target, path))
            throw new Error(`target | path => The path ${strPath(path)} does not exists at the provided target ${strSimple(target)}.`);
    })();
    let lastKey = path[path.length - 1];
    let obj = target;
    if (path.length > 1) {
        const pathCopy = path.slice(0, (path.length - 1));
        obj = getValueAt(target, pathCopy);
    }
    if (sTypeOf(obj) === "Set") {
        obj.add(value);
    }
    else if (sTypeOf(obj) === "Map") {
        obj.set(lastKey, value);
    }
    else {
        try {
            obj[lastKey] = value;
        }
        catch (_a) {
            throw new Error(`The path ${strPath(path)} could not be obtained at the ${sTypeOf(obj)} object.
                It does not exist, or the object is invalid.`);
        }
    }
}
export { getValueAt, setValueAt, pathExistsAt };
