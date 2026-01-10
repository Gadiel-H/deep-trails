"use strict";

const next = () => ({ done: true as true, value: null });

/**
 * Returns an iterator that does nothing.
 * @internal
 */
export const getSymbolIterator = () => ({ next });
