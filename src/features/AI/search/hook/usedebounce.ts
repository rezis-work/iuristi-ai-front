"use client"

import { useEffect, useState } from "react"


export function useDebounce<T>(value: T, delay:number){
    const [debounceedValue, setDebounsedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounsedValue(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounceedValue
}