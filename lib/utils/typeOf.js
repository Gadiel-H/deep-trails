"use strict";

import { stringifySimple as strSimple } from "./stringify.js";


/**
 * Detecta el tipo de un valor, o el nombre de su constructor si es un objeto.  
 * @param   {any} value - Valor cuyo tipo se va a obtener.
 * @param   {"short" | "full"} strLength - Longitud de la string (solo funciona con objetos).
 * @returns {string | Error} `undefined | "<type>" | "<Class>" | "[object <Class>]"`
 */
function typeOf(value, length = "full") {
    if (length === undefined || length === null) strLength = "full";

    const strLength = String(length).trim().toLowerCase();

    if (strLength !== "full" && strLength !== "short") throw new Error(
        "Invalid value for the length parameter: " + strSimple(length)
        + "\n\tExpected: " + '"short" or "full"'
    );

    const simpleType = typeof value;

    if (value === null) return "null";
    if (simpleType !== "object") return simpleType;

    const objectType = Object.prototype.toString.call(value);
    return (
        strLength === "full" ? objectType
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
