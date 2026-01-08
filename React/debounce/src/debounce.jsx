//debounce hook 

import { useState, useEffect } from "react"

export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)
    const safeDelay = typeof delay === "number" && delay > 0 ? delay : 500;
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, safeDelay);
        return () => clearTimeout(timer);
    }, [value, safeDelay])

    return debouncedValue;
}