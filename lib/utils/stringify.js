"use strict";

import is from "./types-check.js";


/**
 * Convierte un valor a string de forma simple.  
 * @param {any} value
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
 * Convierte una ruta (array) a string de forma simple.
 * @requires stringifySimple
 * @param {any[]} path - Array de claves (ruta).
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
