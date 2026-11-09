'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import styles from '@/app/home-sections.module.css';

type ExampleTab = 'request' | 'response';

export default function HomeExampleCard({
  kicker,
  request,
  response,
  responseLabel = 'Example response shape',
}: {
  kicker: string;
  request: string;
  response: string;
  responseLabel?: string;
}) {
  const [tab, setTab] = useState<ExampleTab>('request');
  const baseId = useId();
  const requestRef = useRef<HTMLButtonElement>(null);
  const responseRef = useRef<HTMLButtonElement>(null);
  const noteId = `${baseId}-note`;
  const requestTabId = `${baseId}-request`;
  const responseTabId = `${baseId}-response`;
  const requestPanelId = `${baseId}-request-panel`;
  const responsePanelId = `${baseId}-response-panel`;

  function select(next: ExampleTab) {
    setTab(next);
    const target = next === 'request' ? requestRef : responseRef;
    target.current?.focus();
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const order: ExampleTab[] = ['request', 'response'];
    const index = order.indexOf(tab);
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (index + 1) % order.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (index - 1 + order.length) % order.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = order.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    select(order[next]);
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
        <button
          ref={requestRef}
          className={styles.exampleTab}
          type="button"
          role="tab"
          id={requestTabId}
          aria-selected={tab === 'request'}
          aria-controls={requestPanelId}
          tabIndex={tab === 'request' ? 0 : -1}
          onClick={() => setTab('request')}
          onKeyDown={onTabKeyDown}
        >
          Request
        </button>
        <button
          ref={responseRef}
          className={styles.exampleTab}
          type="button"
          role="tab"
          id={responseTabId}
          aria-selected={tab === 'response'}
          aria-controls={responsePanelId}
          tabIndex={tab === 'response' ? 0 : -1}
          onClick={() => setTab('response')}
          onKeyDown={onTabKeyDown}
        >
          Response
        </button>
      </div>
      <div className={styles.exampleScroll}>
        <div
          role="tabpanel"
          id={requestPanelId}
          aria-labelledby={requestTabId}
          aria-describedby={noteId}
          hidden={tab !== 'request'}
          tabIndex={tab === 'request' ? 0 : -1}
          className={`${styles.codeBody} ${styles.exampleBody}`}
        >
          <p className={styles.exampleTag}>Example request</p>
          <pre>
            <code>{request}</code>
          </pre>
        </div>
        <div
          role="tabpanel"
          id={responsePanelId}
          aria-labelledby={responseTabId}
          aria-describedby={noteId}
          hidden={tab !== 'response'}
          tabIndex={tab === 'response' ? 0 : -1}
          className={`${styles.codeBody} ${styles.exampleBody}`}
        >
          <p className={styles.exampleTag}>{responseLabel}</p>
          <pre>
            <code>{response}</code>
          </pre>
        </div>
      </div>
      <p id={noteId} className={styles.codeComment}>
        Illustrative sample from the public API docs. Not a live response.
      </p>
    </div>
  );
}
