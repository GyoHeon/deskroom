'use client';
import { useState } from 'react';

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  // Get initial value from local storage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error getting from local storage:', error);
      return initialValue;
    }
  });

  // Update local storage when the state changes
  const setValue: SetValue<T> = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting to local storage:', error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
