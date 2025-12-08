"use strict";

import { deepIterate, utils } from "deep-trails";
const { toSimpleString, toPathString } = utils;

const data = {
    config: {
        mode: "automatic",

        retries: 3,

        flags: ["safe", { name: "debug", enabled: true }],

        options: new Map([
            ["logLevel", "verbose"],

            ["cache", false]
        ])
    },

    data: new Set(["item1", "item2", [9, 5], null, { type: "custom" }]),

    metadata: {
        timestamp: new Date(),

        valid: true
    }
};

data.strangeNode = data;

let calls = 0;
console.log(toSimpleString(data));

deepIterate(
    data,
    function (child, parent, control) {
        calls += 1;

        // Data about the current node.
        const { key, depth, index } = child;
        let value = child.value;

        // The log of visited parent nodes
        const { visitLog: log } = this;

        // ===== Controling the traverse =====
        {
            // Iterating only nodes that do not exceed a specific depth
            control.skipNode = depth >= 5;

            // Stop iterating about the parent in the tenth child.
            control.stopParentNow = index === 10;

            // Finishing the traverse if a lot of nodes were found
            control.finishNow = calls > 10_000;

            // Mutating the parent object and the child's context
            if (value instanceof Set) {
                value = Array.from(value);

                parent.value[key] = value;

                // You need to call this function to notify changes like this
                control.useEntry(key, value);
            }
        }

        // Getting ancestral values
        if (depth >= 4) {
            const _parent = child.parentValue;
            const grandparent = parent.parentValue;
            const greatGrandparent = log.get(grandparent).at(-1).parentValue;
            const greatGreatGrandparent = log.get(greatGrandparent).at(-1).parentValue;
        }

        const ident = "    ".repeat(depth);
        const keyStr = toPathString([key]);

        // Checking circular references
        if (log.has(value)) {
            const { path, visits } = log.get(value).at(-1);
            console.log(`\n${ident}# CIRCULAR REFERENCE ${visits} TO ${path || "THE ROOT"}`);
        }

        // Printing a tree on the console
        console.log(`${ident}${keyStr} = ${toSimpleString(value)}`);
    },
    {
        visitLogType: "map",
        pathType: "string",
        maxParentVisits: 1
    }
);

console.log("\nTotal callback calls: " + calls);
