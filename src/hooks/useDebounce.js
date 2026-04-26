import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms of
 * inactivity. Use this to defer expensive computations (e.g. filter/search
 * useMemo calls) so fast keystrokes do not trigger them on every keystroke.
 *
 * @template T
 * @param {T} value  - The value to debounce.
 * @param {number} delay - Debounce delay in milliseconds (default 180).
 * @returns {T}
 */
export function useDebounce(value, delay = 180) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
