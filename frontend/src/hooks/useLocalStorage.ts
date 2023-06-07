import { useState } from "react";

export default function useLocalStorage(key: string) {
  const lsValue = localStorage.getItem(key);
  const [value, setValueState] = useState<string | null>(
    lsValue === "null" ? null : lsValue
  );

  const setValue = (value: string) => {
    localStorage.setItem(key, value);
    setValueState(value);
  };

  return [value, setValue];
}
