import { useCallback, useState } from "react";

export function useToggle(initialValue: boolean): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => {
    setValue((current) => !current);
  }, []);

  return [value, toggle];
}
