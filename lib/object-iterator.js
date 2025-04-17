"use strict";

import is from "./utils/types-check.js";
import { stringifyPath as strPath, stringifySimple as strSimple } from "./utils/stringify.js";
import { fTypeOf, sTypeOf } from "./utils/typeOf.js";
import { getValueAt } from "./utils/paths.js";


const iterableObjects = new Set([
    "Object", "Array", "Map", "Set", "Module"
]);


/**
 * @typedef { (Object | Array<any> | Set<any> | Map<any, any>) } iterableObject
 */


/**
 * @typedef { (key: any, value: any, path: any[]) => any } deepIterateCallback
 */


/**
 * @typedef {Object} deepIterateSettings
 * @property {boolean} iterateKeys
 * @property {boolean} addIndexInSet
 * @property {{
 *     keyTypes: Set<string | Function> | (string | Function)[],
 *     objectTypes: Set<string | Function> | (string | Function)[]
 * }} doNotIterate
 */


/**
 * Ajustes predeterminados para deepIterate.
 * @type {deepIterateSettings}
 */
const defaultSettings = {
    // Confirma si se van a iterar las claves (no aplica para instancias de Set)
    iterateKeys: false,
    // Confirma si en Sets se agregará un índice como clave en vez de el valor del elemento.
    addIndexInSet: true,
    // Omitir iteración para ciertos tipos de objetos
    doNotIterate: {
        // Tipos de objetos para no iterarlos.
        objectTypes: new Set([]),
        // Tipos de claves para no iterarlas.
        keyTypes: new Set([])
    }
};



/**
 * Itera recursivamente sobre cualquier estructura de datos (Object, Array, Map y Set)
 * ejecutando un callback en cada elemento. Se previenen ciclos mediante un WeakSet.
 *
 * @param {iterableObject} obj  - El objeto o estructura a iterar.
 * @param {(key: any, value: any, path: any[]) => any} callback - Función a ejecutar en cada elemento. Se invoca con (key, value, path).
 * @param {deepIterateSettings} settings - Opciones de ajustes para mayor precisión.
 * @param {WeakSet<object>} visited - Conjunto para llevar registro de objetos ya visitados y evitar referencias circulares.
 * @param {any[]} path - Array que representa la ruta actual (camino) en la estructura.
 * @param {number} iterations - Cantidad total de iteraciones.
 * @returns {void}
 * 
 * Casos manejados:
 * - Objetos regulares: Se recorren todas sus propiedades, incluyendo aquellas con claves de tipo symbol.
 * - Arrays: Se recorren sus elementos, añadiendo el índice a la ruta.
 * - Map: Se recorren sus entradas, agregando la clave a la ruta. También se itera opcionalmente sobre claves que sean objetos.
 * - Set: Se recorren sus valores, agregando la clave o un índice a la ruta.
 */
function deepIterate(
    obj,
    callback,
    settings = defaultSettings,
    visited = new WeakSet(),
    path = [],
    iterations = 0
) {
    // ========== Prevención de errores y ciclos ========== //

    (function checkParams() {
        if (!is.any_object(obj)) throw new TypeError(
            `obj => The value ${strSimple(obj)} is not an object.
        
        It must be an instance of Object (plain object), Array, Map, or Set.`
        );

        if (!iterableObjects.has(sTypeOf(obj))) throw new TypeError(
            `obj => Cannot iterate ${sTypeOf(obj)} objects.
        They are not iterable or support has not been added.
            
        Accepted objects: Object, Array, Map, and Set.`
        );

        if (!is.function(callback)) throw new TypeError(
            `callback => The value ${strSimple(callback)} is not a function.`
        );

        if (!is.plain_object(settings)) throw new TypeError(
            `settings => The settings options must be a simple object.
        But a ${sTypeOf(settings)} was entered: ${strSimple(settings)}`
        );

        if (sTypeOf(visited) !== "WeakSet") throw new TypeError(
            `visited => The set of visited elements must be a WeakSet.
        But a ${strSimple(visited)} was entered.`
        );

        if (!Array.isArray(path)) throw new TypeError(
            `path => The path must be an Array of keys.
        But a ${strSimple(path)} was entered.`
        );

        if (path.length === 0 && iterations > 0) throw new RangeError(
            `path => The keys array is empty.`
        );
    })();


    if (visited.has(obj)) return;
    visited.add(obj);



    // ========== Autocompletado de los ajustes ========== //

    const invalidSettings = new Set();

    (function completeSettings() {
        if (!("iterateKeys" in settings)) settings.iterateKeys = true;
        const { iterateKeys } = settings;
        if (typeof iterateKeys !== "boolean") invalidSettings.add([["iterateKeys"], iterateKeys]);

        if (!("addIndexInSet" in settings)) settings.addIndexInSet = true;
        const { addIndexInSet } = settings;
        if (typeof addIndexInSet !== "boolean") invalidSettings.add([["addIndexInSet"], addIndexInSet]);

        if (!("doNotIterate" in settings)) settings.doNotIterate = {
            objectTypes: new Set(), keyTypes: new Set()
        };

        if (!is.plain_object(settings.doNotIterate)) {
            invalidSettings.add([["doNotIterate"], settings.doNotIterate]);
            return;
        }

        const { doNotIterate } = settings;

        if (!("objectTypes" in settings.doNotIterate)) settings.doNotIterate.objectTypes = new Set();
        const { objectTypes } = settings.doNotIterate;
        if (!Array.isArray(objectTypes) && sTypeOf(objectTypes) !== "Set") invalidSettings.add([["doNotIterate", "objectTypes"], objectTypes]);

        if (!("keyTypes" in settings.doNotIterate)) settings.doNotIterate.keyTypes = new Set();
        const { keyTypes } = settings.doNotIterate;
        if (!Array.isArray(keyTypes) && sTypeOf(keyTypes) !== "Set") invalidSettings.add([["doNotIterate", "keyTypes"], keyTypes]);

    })();

    let str = "";
    [...invalidSettings].forEach(val => str += `${strPath(val[0])} = ${strSimple(val[1])}\n`);

    if (invalidSettings.size !== 0) throw new Error(
        `${invalidSettings.size} options in the settings are not valid. 
${str}`
    );

    settings.doNotIterate.objectTypes = new Set(settings.doNotIterate.objectTypes);
    settings.doNotIterate.keyTypes = new Set(settings.doNotIterate.keyTypes);


    // ========== Datos y funciones importantes ========== //

    const params = { obj, callback, settings, visited, path, iterations };
    const { iterateKeys, addIndexInSet, doNotIterate } = settings;

    /**
     * Comprueba si un objeto es iterable mediante deepIterate.
     * @param {object} obj 
     */
    function isValidIterable(obj) {
        return (typeof obj === "object") && (obj !== null)
            && (iterableObjects.has(sTypeOf(obj)))
    }

    /**
     * Llama a deepIterate con los parámetros actuales para iterar una clave o un valor.
     * @param {typeof params} args
     * @returns {void}
     */
    function iterateSubObject(args = params) {
        const { obj, callback, settings, visited, path, iterations } = args;

        if (isValidIterable(obj)) {
            deepIterate(obj, callback, settings, visited, path, (iterations + 1));
        }
    }

    /**
     * Comprueba si se pidió no iterar un objeto, respecto a la propiedad *settings.doNotIterate*.  
     * @param {object} obj
     * @param {"key" | "value" | "key-value"} role
     * @returns {boolean}
     * - **"key"**: Se revisa si *iterateKeys* no es true, o si *keyTypes* tiene el constructor (función o nombre).
     * - **"value"**: Se revisa si *valueTypes* tiene el constructor (función o nombre).
     * - **"key-value"**: Se revisa si el constructor (función o nombre) está en *keyTypes* o en *valueTypes*.
     */
    function shouldNotIterate(obj, role) {

        role = String(role).trim().toLowerCase();

        if (role !== "key" && role !== "value" && role !== "key-value") throw new Error(
            `The specified role for the obj paramater is not valid.
            
            It must be: "key", "value" or "key-value"`
        );

        const { keyTypes, objectTypes } = settings.doNotIterate;

        const ignoredKey = (objKey) => (
            !is.object(objKey) ? true
                : (keyTypes.has(objKey.constructor) || keyTypes.has(sTypeOf(objKey)) || keyTypes.has(fTypeOf(objKey)))
        );

        const ignoredValue = (objValue) => (
            !is.object(objValue) ? true
                : (objectTypes.has(objValue.constructor) || objectTypes.has(sTypeOf(objValue)) || objectTypes.has(fTypeOf(objValue)))
        );

        if (role === "key") {
            return (iterateKeys !== true || ignoredKey(obj));
        } else if (role === "value") {
            return ignoredValue(obj);
        } else {
            return (ignoredKey(obj) || ignoredValue(obj));
        }
    }



    // ========== Formas de iterar sobre las estructuras ========== //

    // Caso especial: Map --- Opcionalmente se iteran las claves que sean objetos válidos
    if (obj instanceof Map) {
        obj.forEach((value, key) => {
            params.path = path.concat(is.Array(key) ? [key] : key);
            callback(key, value, params.path);

            params.obj = key;
            if (!shouldNotIterate(key, "key")) iterateSubObject(params);

            params.obj = value;
            if (!shouldNotIterate(value, "value")) iterateSubObject(params);
        });
        return;
    }

    // Caso especial: Set --- Opcionalmente se usa un índice como clave
    if (obj instanceof Set) {
        let index = 0;
        obj.forEach((value, key) => {
            const _key = (addIndexInSet ? index : key);
            params.path = path.concat(Array.isArray(key) ? [key] : key);

            callback(_key, value, params.path);

            params.obj = value;
            if (!shouldNotIterate(value, "value")) iterateSubObject(params);
            index++;
        });
        return;
    }

    // Caso: Array ---------- Se iteran los objetos válidos
    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            params.path = path.concat(index);
            callback(index, item, params.path);

            params.obj = item;
            if (!shouldNotIterate(item, "value")) iterateSubObject(params);
        });
        return;
    }

    // Caso: objeto simple -- Incluye propiedades con claves de tipo string y symbol
    if (is.plain_object(obj)) {
        const stringKeys = Object.getOwnPropertyNames(obj),
            symbolKeys = Object.getOwnPropertySymbols(obj),
            keys = stringKeys.concat(symbolKeys);

        keys.forEach(key => {
            params.path = path.concat(key);
            const value = obj[key];

            callback(key, value, params.path);

            params.obj = value;
            if (!shouldNotIterate(value, "value")) iterateSubObject(params);
        });
    }
}




/**
 * Obtén más información sobre cada iteración en deepIterate ingresando los parámetros que obtuviste con el callback.  
 * @public
 * @param {any} key - Clave actual.
 * @param {any} value - Valor actual.
 * @param {any[]} path - Array actual de claves.
 * @param {object} obj - Objeto principal (opcional pero habrá menos datos).
 * @returns {Record<string, (string | number | Object)>}
 */
deepIterate.help = function (key, value, path, obj) {

    (function checkParams() {
        if (!Array.isArray(path)) throw new TypeError(
            `path => The value ${strSimple(path)} is not an array.`
        );

        if (path.length === 0) throw new RangeError(
            `path => The array is empty.`
        );

        if (!is.object(obj) && obj !== undefined) throw new TypeError(
            `obj => The value ${strSimple(obj)} is not an object or it is a function.`
        );

        if (!iterableObjects.has(sTypeOf(obj)) && obj !== undefined) throw new TypeError(
            `obj => Values or objects of type ${sTypeOf(obj)} are not accepted.`
        );
    })();

    const parentPath = path.slice(0, (path.length - 1));

    const parentKey = (
        path.length > 1
            ? path[path.length - 2]
            : is.object(obj)
                ? obj : undefined
    );


    /**
     * @param {object} obj 
     * @returns {Function | undefined}
     */
    const constructorOf = (obj) => (
        !is.any_object(obj) ? undefined
            : !Object.getOwnPropertyNames(obj).includes("constructor")
                ? obj.constructor : undefined
    );

    const data = {
        depth: path.length,
        keyType: sTypeOf(key),
        valueType: sTypeOf(value),
        valueConstructor: constructorOf(value),
        keyConstructor: constructorOf(key),
        strValue: strSimple(value),
        strKey: strSimple(key),
        strPath: strPath(path),

        parent: {
            constructor: undefined,
            key: parentKey,
            strKey: parentPath.length > 0 ? strSimple(parentKey) : undefined,
            keyType: parentPath.length > 0 ? sTypeOf(parentKey) : undefined,
            path: parentPath.length > 0 ? parentPath : undefined,
            strPath: parentPath.length > 0 ? strPath(parentPath) : undefined,
            depth: parentPath.length
        }
    };

    if (!is.object(obj)) return data;

    const parent = parentPath.length > 0 ? getValueAt(obj, parentPath) : obj;

    Object.assign(data.parent, {
        value: parent,
        constructor: constructorOf(parent),
        numOfEntries: is.object(parent) ? (
            is.Map(parent) || is.Set(parent)
                ? parent.size
                : Object.keys(parent).length
        ) : undefined,
        valueType: sTypeOf(parent),
        strValue: strSimple(parent)
    });

    return data;
};



export {
    deepIterate,
    defaultSettings
};
