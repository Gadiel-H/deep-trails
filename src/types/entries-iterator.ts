/**
 * Entries iterable iterator.
 *
 * The deep-trails factory functions create closures to store the iteration state. Therefore, they do not depend on `this`.
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
     * It is undefined if there was no known way to obtain it.
     */
    readonly size: number | undefined;

    /** The object received to iterate it. */
    readonly object: T;

    /**
     * Method that makes this iterator iterable.
     * Calling it resets the iteration state.
     * @returns An object with the "next" method.
     */
    [Symbol.iterator]: () => {
        next: EntriesIterator<F, T, K, V>["next"];
    };

    /**
     * Advances in the iteration, changing its state.
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
     * @returns True if reseted, otherwise false.
     */
    reset: () => boolean;

    /**
     * Peeks an iteration state.
     *
     * The entry will be:
     * - `null` if the index is out of the valid and known range.
     * - `undefined` if the iterator cannot provide peeking functionality.
     * - An array as entry otherwise.
     *
     * @param difference - Integer indicating where to look in. By default is +1.
     * - =0: Current.
     * - \>0: Future.
     * - \<0: Past.
     */
    peek: (
        difference?: number
    ) =>
        | { done: false; value: [key: K, value: V, index: number] }
        | { done: boolean; value: null | undefined };

    /**
     * Destroys the iterator, and makes it unusable.
     *
     * This helps to eliminate the closure if it exists.
     *
     * @returns True if it was destroyed in this call, false if it had
     * already been destroyed or does not have this functionality.
     */
    destroy: () => boolean;
};
