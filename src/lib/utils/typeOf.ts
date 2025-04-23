"use strict";

import { stringifySimple as strSimple } from "./stringify.js";


/**
 * Detects the type of a value, or the name of its constructor if it is an object.  
 * @param   {any} value - Any value.
 * @param   {"short" | "full"} strLength - String length (only works with objects).
 * @returns {string | Error} `undefined | "<type>" | "<Class>" | "[object <Class>]"`
 */
function typeOf(value, strLength = "full") {
    if (strLength === undefined || strLength === null) strLength = "full";

    const length = String(strLength).trim().toLowerCase();

    if (length !== "full" && length !== "short") throw new Error(
        "Invalid value for the length parameter: " + strSimple(length)
        + "\n\tExpected: " + '"short" | "full"'
    );

    const simpleType = typeof value;

    if (value === null) return "null";
    if (simpleType !== "object") return simpleType;

    const objectType = Object.prototype.toString.call(value);
    return (
        length === "full" ? objectType
            : objectType.replace("[object ", "").replace("]", "")
    );
}


/**
 * "Full type of"  
 * @requires typeOf
 * @returns {string} `"<type>" | "[object <Class>]"`
 */
const fTypeOf = (value) => typeOf(value, "full");


/**
 * "Short type of"
 * @requires typeOf
 * @returns {string} `"<type>" | "<Class>"`
 */
const sTypeOf = (value) => typeOf(value, "short");


export { typeOf, fTypeOf, sTypeOf };
