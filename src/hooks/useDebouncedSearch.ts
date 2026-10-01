import { useCallback, useEffect, useRef, useState } from "react";

export function useDebouncedSearch(delay = 400) {
  const [search, setSearch] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputKeyword(value);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSearch(value);
        timeoutRef.current = null;
      }, delay);
    },
    [delay]
  );

  return { search, inputKeyword, handleSearchChange, setInputKeyword };
}
