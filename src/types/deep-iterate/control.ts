/**
 * Specifies control flags to alter the behavior of deep iteration traversal.
 *
 * Notes:
 * - The effects of using this object are applied after the callback is called, except for `setValue()`.
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
 * @since 3.0.0
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
     * If the path is an array of keys and a new key is received, the last key will be replaced.
     *
     * @returns The number of things that will be updated in the context.
     * - `0` - Nothing.
     * - `1` - The value.
     * - `2` - The key and the path.
     * - `3` - The value, the key, and the path.
     *
     * @example
     * // Stringifying non-string values
     * if (typeof child.value !== "string") {
     *     const newValue = String(child.value);
     *     parent.value[child.key] = newValue;
     *     control.useEntry(child.key, newValue);  // returns 1
     * }
     *
     * @example
     * // Changing elements in sets
     * const object = parent.value;
     * if (object instanceof Set && typeof child.value !== "string") {
     *     const newValue = String(child.value);
     *     object.add(newValue);
     *     object.delete(child.value);
     *     control.useEntry(newValue, newValue);   // returns 3
     * }
     */
    readonly useEntry: (key?: K, value?: V) => 0 | 1 | 2 | 3;

    /**
     * Changes the value of the current node in the source structure and in the context.
     *
     * @remarks
     * When the current property is non-writable but configurable, setting `forceDescriptor` allows the property
     * descriptor to be rewritten so the new value can be assigned.
     *
     * @param newValue - The new value to assign. It must be different to the current one.
     * @param forceDescriptor - Changes the property descriptor if necessary and if possible. Defaults to `false`.
     * @returns An object with the result status.
     *
     * @example
     * // Stringifying values
     * deepIterate(obj, ({ value }, _, ctrl) => {
     *     if (typeof value !== "string") {
     *         const { ok, errorCode } = ctrl.setValue(String(value));
     *
     *         if (!ok) {
     *             console.error("Could not change the value because:", errorCode);
     *         }
     *     }
     * });
     */
    readonly setValue: (
        newValue: V,
        forceDescriptor?: boolean
    ) => Readonly<
        | { ok: true; errorCode: null }
        | {
              /** It is `false` if the value could not be changed. Check the error code to know the cause. */
              ok: false;
              /** It is a string that indicates the cause if the value change fails. */
              errorCode:
                  | "CANNOT_CHANGE_SET"
                  | "HAS_OWN_SET_METHOD"
                  | "READONLY_PROPERTY"
                  | "MISSING_VALUE"
                  | "SAME_VALUE";
          }
        | {
              ok: false;
              /** It is `"SETTER_ERROR"` if the property's setter threw any value when trying to assign the new one. */
              errorCode: "SETTER_ERROR";
              /** This property exists if an error thrown by a setter or a inherited `set` method was caught. */
              error: unknown;
          }
    >;
};
