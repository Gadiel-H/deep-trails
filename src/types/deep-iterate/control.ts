/**
 * Specifies control flags to alter the behavior of deep iteration traversal.
 *
 * Notes:
 * - The effects of using this object are applied after the callback is called.
 * - This object should be used only in callbacks for `deepIterate`.
 *
 * Evaluation order:
 * - useEntry()
 * - finishNow
 * - finishAfterNode
 * - stopParentNow
 * - stopParentAfterNode
 * - skipNode
 * - skipKey
 * - skipValue
 *
 * @since 3.0.0-beta.0
 */
export type Control<K = unknown, V = unknown> = {
    /**
     * **Finish the entire traversal** when the current call to the callback ends.
     *
     * @example
     * control.finishNow = child.key === "finish"
     */
    finishNow: boolean;

    /**
     * **Finish the entire traversal** after iterating over the current child.
     *
     * Once requested, it cannot be cancelled.
     *
     * @example
     * control.finishAfterNode = typeOf(child.value) === "Set"
     */
    finishAfterNode: boolean;

    /**
     * **Stops iterating over the current parent** when this call to the **callback ends**.
     *
     * @example
     * control.stopParentNow = child.index > 20
     */
    stopParentNow: boolean;

    /**
     * **Stops iterating over the current parent** after deeply iterating over the **current child**.
     *
     * Once requested, it cannot be cancelled.
     *
     * @example
     * control.stopParentAfterNode = child.index >= 10
     */
    stopParentAfterNode: boolean;

    /**
     * **Skips iterating** over the **key** and **value** of the current child.
     *
     * @example
     * control.skipNode = child.depth > 10
     */
    skipNode: boolean;

    /**
     * **Skips iterating** over the **key** of the current child.
     *
     * @example
     * control.skipKey = !isPlainObject(child.key)
     */
    skipKey: boolean;

    /**
     * **Skips iterating** over the **value** of the current child.
     *
     * @example
     * control.skipValue = !Array.isArray(child.value)
     */
    skipValue: boolean;

    /**
     * Assigns the provided key and value to the context of the current child.
     *
     * If the path is an array and a new key is received, the last element will be replaced.
     *
     * @returns A number that indicates how many things will change.
     * - `0` - Nothing.
     * - `1` - The value.
     * - `2` - The key and the path.
     * - `3` - The value, the key, and the path.
     */
    readonly useEntry: (key?: K, value?: V) => 0 | 1 | 2 | 3;
};
