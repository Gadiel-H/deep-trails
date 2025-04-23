"use strict";

/**
 * Basic validation of existing types and some instances (Object, Array, Map and Set).
 * @type {Record<string, ((value: any) => boolean)>}
 */
const is = {
    // Main types
    "string":       str  => (typeof str === "string"),
    "number":       num  => (typeof num === "number"),
    "boolean":      bool => (typeof bool === "boolean"),
    "null":         val  => (val === null),
    "undefined":    val  => (typeof val === "undefined"),
    "symbol":       sym  => (typeof sym === "symbol"),
    "bigint":       big  => (typeof big === "bigint"),
    "object":       obj  => (typeof obj === "object") && (obj !== null),
    "function":     fn   => (typeof fn === "function"),

    // Other indirect types
    "plain_object": obj  => self.Object(obj) && (Object.getPrototypeOf(obj) === Object.prototype),
    "any_object":   obj  => self.object(obj) || self.function(obj),
    
    // Instances
    "Array":        Array.isArray,
    "Set":          set  => self.object(set) && (set instanceof Set),
    "Map":          map  => self.object(map) && (map instanceof Map),
    "Object":       obj  => self.object(obj) && (obj instanceof Object)
};

const self = is;

export default is;
