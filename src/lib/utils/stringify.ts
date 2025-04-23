"use strict";

import is from "./types-check.js";


/**
 * Converts a value to a string in a simple way.  
 * @param {any} value - Any value.
 * @returns {string} `"<value>" | ""<string>"" | "[Function: <name>]" | "[object <Class>]"`
 */
function stringifySimple(value) {
    if (!is.any_object(value)) return (
        is.string(value) ? `"${value}"` : String(value)
    );

    if (is.function(value)) return (
        value.name.trim() !== ""
            ? `[Function: ${value.name}]`
            : "[Function: anonymous]"
    );

    return Object.prototype.toString.call(value);
}


/**
 * Converts a path (array) to a string in a simple way.
 * @requires stringifySimple
 * @param {any[]} path - Any array.
 * @returns {string | Error}
 * @example stringifyPath([ "a", 0, new Set() ]);  // "["a"][0][[object Set]]"
 */
function stringifyPath(path) {
    (function checkParams() {
        if (!Array.isArray(path)) throw new TypeError(
            `path => The value ${stringifySimple(path)} is not an array.`
        );

        if (path.length === 0) throw new RangeError(
            `path => The array is empty.`
        );
    })();

    return path.map(key => `[${stringifySimple(key)}]`).join("");
}


export {
    stringifySimple,
    stringifyPath
};
