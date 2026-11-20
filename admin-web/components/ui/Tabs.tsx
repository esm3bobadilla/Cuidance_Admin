'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import styles from './Tabs.module.css';

export type TabItem = { id: string; label: string; content: ReactNode };

type TabsProps = {
  // Names the tab list for screen readers
  label: string;
  tabs: TabItem[];
  defaultTab?: string;
  // Optional: the screen controls which tab is open (for example after "Duplicate" opens Drafts)
  selectedTab?: string;
  onChange?: (id: string) => void;
};

// ARIA tabs. Left and Right move between tabs, Home and End jump to the ends.
// Selected tab: Compass Blue text plus a 2 px underline (not color alone).
export function Tabs({ label, tabs, defaultTab, selectedTab, onChange }: TabsProps) {
  const id = useId();
  const [internal, setSelected] = useState(defaultTab ?? tabs[0]?.id);
  const selected = selectedTab ?? internal;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (tabId: string) => {
    setSelected(tabId);
    refs.current[tabId]?.focus();
    onChange?.(tabId);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const next =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    select(tabs[next].id);
  };

  return (
    <div className={styles.tabs}>
      <div role="tablist" aria-label={label} className={styles.list}>
        {tabs.map((tab, index) => {
          const on = tab.id === selected;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                refs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${tab.id}`}
              aria-selected={on}
              aria-controls={`${id}-panel-${tab.id}`}
              tabIndex={on ? 0 : -1}
              className={styles.tab}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${id}-panel-${tab.id}`}
          aria-labelledby={`${id}-tab-${tab.id}`}
          hidden={tab.id !== selected}
          tabIndex={0}
          className={styles.panel}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
