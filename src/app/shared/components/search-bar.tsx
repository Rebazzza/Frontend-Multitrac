import { useState, useEffect, useRef } from 'react';
import './search-bar.css';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({ onSearch, placeholder = 'Buscar...', debounceMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState('');
  const onSearchRef = useRef(onSearch);
  const isFirstRender = useRef(true);

  useEffect(() => {
    onSearchRef.current = onSearch;
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onSearchRef.current(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}