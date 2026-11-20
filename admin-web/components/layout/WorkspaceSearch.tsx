'use client';

import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { searchCopy, searchableScreens } from '../../../shared/content/admin-web-screens';
import { CuIcon } from '../ui/CuIcon';
import styles from './WorkspaceSearch.module.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// Workspace search (approved prototype): finds Admin Web pages by name or description.
// An ARIA combobox: type to filter, Up and Down to move, Enter to open, Escape to clear.
export function WorkspaceSearch() {
  const id = useId();
  const listId = `${id}-results`;
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchableScreens()
      .filter((screen) => screen.name.toLowerCase().includes(q) || screen.scopeNote.toLowerCase().includes(q))
      .sort((a, b) => Number(b.name.toLowerCase().includes(q)) - Number(a.name.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [query]);

  const showList = open && query.trim().length > 0;
  const go = (index: number) => {
    const screen = results[index];
    if (screen) window.location.assign(`${base}${screen.path}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Enter') {
      if (showList && results.length) {
        event.preventDefault();
        go(active);
      }
    } else if (event.key === 'Escape') {
      if (showList) setOpen(false);
      else setQuery('');
    }
  };

  return (
    <div className={styles.search} role="search" aria-label={searchCopy.label}>
      <label className={styles.field}>
        <span className="visually-hidden">{searchCopy.label}</span>
        <CuIcon name="search" variant="badge" size={26} />
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results.length ? `${id}-option-${active}` : undefined}
          aria-describedby={`${id}-hint`}
          placeholder={searchCopy.placeholder}
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
      </label>
      <span id={`${id}-hint`} className="visually-hidden">
        {searchCopy.hint}
      </span>
      <ul id={listId} role="listbox" aria-label={searchCopy.label} className={styles.results} hidden={!showList}>
        {results.map((screen, index) => (
          <li
            key={screen.id}
            id={`${id}-option-${index}`}
            role="option"
            aria-selected={index === active}
            className={styles.option}
            // Keeps focus in the input so the click lands
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => go(index)}
          >
            <span className={styles.optionName}>{screen.name}</span>
            <span className={styles.optionNote}>{screen.scopeNote}</span>
          </li>
        ))}
        {showList && results.length === 0 && (
          <li className={styles.empty} role="presentation">
            {searchCopy.noResults(query.trim())}
          </li>
        )}
      </ul>
      <span className="visually-hidden" role="status">
        {showList ? (results.length ? searchCopy.resultCount(results.length) : searchCopy.noResults(query.trim())) : ''}
      </span>
    </div>
  );
}
