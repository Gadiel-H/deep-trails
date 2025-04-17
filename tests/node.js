import { deepIterate } from "../index.js";

console.log("=== Running Deep Trails test ===" + "\n");

const testData = {
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

let totalIterations = 0;

try {
    // You can add objects here to avoid iterating over them.
    const visited = new WeakSet([ testData.config.flags[1] ]);
    // Do not modify the path to avoid errors.
    const path = [];
    
    deepIterate(
        testData,
        (key, value, path) => {
            const {
                depth,valueType, keyType,
                strPath, strKey, strValue
            } = deepIterate.help(key, value, path, testData);
            
            console.log(strPath);
            console.log(`  Key: ${strKey} (${keyType})`);
            console.log(`  Value: ${strValue} (${valueType})`);
            console.log(`  Depth: ${depth}`);
            console.log('---------------');
            
            totalIterations++;
        },
        {   // Settings options for all iterations.
            iterateKeys: true,
            addIndexInSet: true,
            doNotIterate: {
                keyTypes: [],
                objectTypes: []
            }
        },
        visited, // WeakSet of visited objects.
        path // Must be empty or not entered.
    );
    
    console.log("Total iterations: " + totalIterations);
    console.log("✅ All tests passed without errors.");
} catch (err) {
    console.error("❌ An error occurred during the test:");
    console.error(err.stack || err);
}
