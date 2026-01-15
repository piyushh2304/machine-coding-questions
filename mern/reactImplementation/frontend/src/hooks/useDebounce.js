import { useState, useEffect } from 'react'


/**
 * useDebounce Hook
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 */


export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        //set a timeout to update debounce value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        //clear timeout if valuje change before delay is finished
        return () => {
            clearTimeout(handler);
        }
    }, [value, delay]);
    return debouncedValue;
}