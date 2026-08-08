/** @internal */
export type LightEntriesIterator<
    K = unknown,
    V = unknown,
    D extends PropertyDescriptor = PropertyDescriptor & { get: Function },
    E = unknown
> = Iterator<[key: K, value: V, desc?: D, error?: E], null | undefined, never> & {
    size?: number;
    source?: "entriesMethod" | "ownProperties";
    [Symbol.iterator]?: () => Iterator<[K, V]>;
};
