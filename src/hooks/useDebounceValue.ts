import React, { useEffect, useState } from 'react'


export default function useDebounceValue(value: string, delay: number = 500): string {
    const [debouncedValue, setDebouncedValue] = useState<string>(value);
  
    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
  
        return () => clearTimeout(handler);
      }, [value, delay]);
  
    return debouncedValue;
  }