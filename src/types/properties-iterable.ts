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
     * Returns `undefined` if the reference to the keys array has been removed (due to {@link PropertiesIterable.clear | `.clear()`}).
     *
     * @example
     * const iter = PropertiesIterator(
     *     { a: 1, b: 2, c: 3 }, () => [ "b", "c" ]
     * );
     *
     * iter.getSize();    // 2
     * iter.clear();      // true
     * iter.getSize();    // undefined
     */
    getSize: () => number | undefined;

    /** The object received to iterate it. */
    readonly object: T;

    /**
     * Returns an iterator over the current instance.
     *
     * Multiple iterators will interfere with each other because they share the same internal state.
     *
     * Remember to call {@link PropertiesIterable.reset | `.reset()`} if you want to refresh the keys and the iteration state.
     */
    [Symbol.iterator]: () => {
        next: PropertiesIterable<T, K, V>["next"];
    };

    /**
     * Advances in the iteration, changing its state.
     *
     * @example
     * const iter = PropertiesIterator({ a: 1, b: 2 });
     *
     * iter.next();  // { done: false, value: [ "a", 1, 0 ] }
     * iter.next();  // { done: false, value: [ "b", 2, 1 ] }
     * iter.next();  // { done: true, value: null }
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
     * When reset, it retrieves the keys again and sets the index to `-1`.
     *
     * @example
     * const iter = PropertiesIterator({ a: 1, b: 2 }, () => ["a"]);
     *
     * [...iter];     // [ [ "a", 1, 0 ] ]
     * iter.reset();  // true
     * [...iter];     // [ [ "a", 1, 0 ] ]
     *
     * iter.clear();  // true
     * iter.reset();  // false
     *
     * @returns `true` if reseted; `false` if object references were removed (due to {@link PropertiesIterable.clear | `.clear()`}).
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
     *
     * @example
     * const iter = PropertiesIterator({ a: 1, b: 2, c: 3 });
     *
     * iter.peek("first");   // { done: false, value: [ "a", 1, 0 ] }
     * iter.peek("last");    // { done: false, value: [ "c", 3, 2 ] }
     * iter.peek(0);         // { done: false, value: null }
     *
     * iter.next();          // { done: false, value: [ "a", 1, 0 ] }
     * iter.peek();          // { done: false, value: [ "b", 2, 1 ] }
     *
     * [...iter];            // [ ... ]
     * iter.peek(0);         // { done: true, value: null }
     * iter.peek(-1);        // { done: false, value: [ "c", 3, 2 ] }
     *
     * iter.clear();         // true
     * iter.peek(anyArg);    // { done: true, value: null }
     */
    peek: (
        position?: number | "first" | "last"
    ) => { done: false; value: [key: K, value: V, index: number] } | { done: boolean; value: null };

    /**
     * Removes internal references to objects within the closure, without modifying the iterator.
     *
     * This helps free up memory without breaking the API contract or throwing an error.
     *
     * After calling this method, other methods will behave as if the iteration had finished.
     *
     * @example
     * const iter = PropertiesIterator({ a: 1, b: 2, c: 3 });
     *
     * iter.next();         // { done: false, value: [ "a", 1, 0 ] }
     * iter.clear();        // true
     *
     * [...iter];           // []
     * iter.peek(anyArg);   // { done: true, value: null }
     * iter.clear();        // false
     *
     * @returns
     * `true` if called for the first time; `false` otherwise.
     */
    clear: () => boolean;
}
