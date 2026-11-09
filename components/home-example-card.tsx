'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import styles from '@/app/home-sections.module.css';

type ExamplePanel = {
  id: string;
  label: string;
  tag: string;
  body: string;
};

export default function HomeExampleCard({
  kicker,
  request,
  response,
  responseLabel = 'Example response shape',
  mcp,
}: {
  kicker: string;
  request: string;
  response: string;
  responseLabel?: string;
  mcp?: string;
}) {
  const panels: ExamplePanel[] = [
    {
      id: 'request',
      label: 'Request',
      tag: 'Example request',
      body: request,
    },
    {
      id: 'response',
      label: 'Response',
      tag: responseLabel,
      body: response,
    },
  ];
  if (mcp) {
    panels.push({
      id: 'mcp',
      label: 'MCP',
      tag: 'Example MCP call',
      body: mcp,
    });
  }

  const [tab, setTab] = useState(panels[0].id);
  const baseId = useId();
  const noteId = `${baseId}-note`;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(nextId: string) {
    setTab(nextId);
    tabRefs.current[nextId]?.focus();
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const index = panels.findIndex((panel) => panel.id === tab);
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (index + 1) % panels.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (index - 1 + panels.length) % panels.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = panels.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    select(panels[next].id);
  }

  return (
    <div className={styles.codeCard}>
      <div className={styles.codeTop}>
        <span aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{kicker}</span>
      </div>
      <div
        className={styles.exampleTabs}
        role="tablist"
        aria-label={kicker}
        aria-orientation="horizontal"
      >
        {panels.map((panel) => {
          const tabId = `${baseId}-${panel.id}`;
          const selected = tab === panel.id;
          return (
            <button
              key={panel.id}
              ref={(node) => {
                tabRefs.current[panel.id] = node;
              }}
              className={styles.exampleTab}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={selected}
              aria-controls={`${baseId}-${panel.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(panel.id)}
              onKeyDown={onTabKeyDown}
            >
              {panel.label}
            </button>
          );
        })}
      </div>
      <div className={styles.exampleScroll}>
        {panels.map((panel) => {
          const selected = tab === panel.id;
          return (
            <div
              key={panel.id}
              role="tabpanel"
              id={`${baseId}-${panel.id}-panel`}
              aria-labelledby={`${baseId}-${panel.id}`}
              aria-describedby={noteId}
              hidden={!selected}
              tabIndex={selected ? 0 : -1}
              className={`${styles.codeBody} ${styles.exampleBody}`}
            >
              <p className={styles.exampleTag}>{panel.tag}</p>
              <pre>
                <code>{panel.body}</code>
              </pre>
            </div>
          );
        })}
      </div>
      <p id={noteId} className={styles.codeComment}>
        Illustrative sample from the public API docs. Not a live response.
      </p>
    </div>
  );
}
