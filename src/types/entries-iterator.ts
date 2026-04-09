/**
 * Entries iterable iterator.
 *
 * The deep-trails factory functions create closures to store the iteration state.
 * Therefore, they do not depend on `this`.
 *
 * @since 3.0.0-beta.0
 */
export type EntriesIterator<
    F extends <O extends T>(object: O, ...args: any[]) => EntriesIterator<F, T, K, V>,
    T extends object,
    K = unknown,
    V = unknown
> = {
    /** The function that created this iterator. */
    factory: F;

    /**
     * Number of items detected in the object.
     *
     * It is undefined if there was no known way to obtain it.
     */
    readonly size: number | undefined;

    /** The object received to iterate it. */
    readonly object: T;

    /**
     * Returns an iterator over the current instance.
     *
     * The returned iterator shares the same internal iteration state.
     * Multiple iterators will interfere with each other.
     */
    [Symbol.iterator]: () => {
        next: EntriesIterator<F, T, K, V>["next"];
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
     * - `undefined` if the iterator cannot provide peeking functionality.
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
    ) =>
        | { done: false; value: [key: K, value: V, index: number] }
        | { done: boolean; value: null | undefined };

    /**
     * Destroys the iterator, and makes it unusable.
     * This helps to eliminate the closure.
     *
     * @returns
     * True if it was destroyed in this call, false if it had already been destroyed.
     */
    destroy: () => boolean;
};
