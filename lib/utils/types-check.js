"use strict";

/**
 * Validación básica de tipos. 
 * @private
 * @type {Record<string, ((value: any) => boolean)>}
 */
const is = {
    "object":       obj  => (typeof obj === "object") && (obj !== null),
    "function":     fn   => (typeof fn === "function"),
    "any_object":   obj  => self.object(obj) || self.function(obj),
    "boolean":      bool => (typeof bool === "boolean"),
    "undefined":    val  => (typeof val === "undefined"),
    "string":       str  => (typeof str === "string"),
    "Array":        Array.isArray,
    "Set":          set  => self.object(set) && (set instanceof Set),
    "Map":          map  => self.object(map) && (map instanceof Map),
    "Object":       obj  => self.object(obj) && (obj instanceof Object),
    "plain_object": obj  => self.Object(obj) && (Object.getPrototypeOf(obj) === Object.prototype)
};

const self = is;

export default is;
