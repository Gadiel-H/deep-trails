import { PropertiesIterator } from "../iterate/index.js";

/**
 * Stateful iterable for iterating over object properties.
 *
 * See {@linkcode PropertiesIterator} to known the factory.
 *
 * @since 3.0.0
 */
export interface PropertiesIterable<
    T extends object,
    K extends PropertyKey = keyof T,
    V = T[K & keyof T]
> {
    /**
     * Returns the length of the keys array (obtained via the keys getter).
     *
     * Returns `undefined` if the reference to the keys array has been removed (due to `.destroy()`).
     */
    getSize: () => number | undefined;

    /** The object received to iterate it. */
    readonly object: T;

    /**
     * Returns an iterator over the current instance.
     *
     * The returned iterator shares the same internal iteration state.
     * Multiple iterators will interfere with each other.
     */
    [Symbol.iterator]: () => {
        next: PropertiesIterable<T, K, V>["next"];
    };

    /**
     * Advances in the iteration, changing its state.
     *
     * @returns The next state of the iteration.
     */
    next: () =>
        | {
              value: [key: K, value: V, index: number];
              done: false;
          }
        | { done: true; value: null };

    /**
     * Resets the iteration state.
     *
     * If reseted, only the iternal data (closure) will change.
     *
     * @returns True if reseted, otherwise false.
     */
    reset: () => boolean;

    /**
     * Peeks an iteration state.
     *
     * The entry will be:
     * - `null` if the zero-based index is out of the valid and known range.
     * - An array as entry otherwise.
     *
     * @param position - Where to peek from the current position. Default is +1.
     * - `=0`: Current entry.
     * - `>0`: Future entry.
     * - `<0`: Past entry.
     * - `"first"`: First entry, or `null` if empty.
     * - `"last"`: Last entry, or `null` if empty.
     */
    peek: (
        position?: number | "first" | "last"
    ) => { done: false; value: [key: K, value: V, index: number] } | { done: boolean; value: null };

    /**
     * Destroys the iterator, and makes it unusable.
     * This helps to eliminate the closure.
     *
     * @returns
     * True if it was destroyed in this call, false if it had already been destroyed.
     */
    destroy: () => boolean;
}
