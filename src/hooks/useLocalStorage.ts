import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  
    const [storedValue, setStoredValue] = useState(() => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    });


    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (err) {
            console.error('Failed to save to localStorage:', err);
        }
    };

    return [storedValue, setValue] as const;
}

export default useLocalStorage; 