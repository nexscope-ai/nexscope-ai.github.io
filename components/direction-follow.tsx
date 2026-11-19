'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import styles from './future-directions.module.css';

type FollowState = 'loading' | 'ready' | 'saved' | 'temporary';

export function DirectionFollow({ feature }: { feature: string }) {
  const key = `nexscope:direction-follow:v1:${feature}`;
  const [state, setState] = useState<FollowState>('loading');

  const clicked = useRef(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        setState(window.localStorage.getItem(key) === '1' ? 'saved' : 'ready');
      } catch {
        setState('ready');
      }
    });

    function sync(event: StorageEvent) {
      if (event.key === key && event.newValue === '1') setState('saved');
    }
    window.addEventListener('storage', sync);
    return () => {
      active = false;
      window.removeEventListener('storage', sync);
    };
  }, [key]);

  function follow() {
    if (state !== 'ready' || clicked.current) return;
    clicked.current = true;

    try {
      if (window.localStorage.getItem(key) === '1') {
        setState('saved');
        return;
      }
      window.localStorage.setItem(key, '1');
      setState('saved');
    } catch {
      setState('temporary');
    }

    document.dispatchEvent(new CustomEvent('nexscope:direction-follow', { detail: feature }));
  }

  const following = state === 'saved' || state === 'temporary';
  return (
    <div>
      <button
        type="button"
        className={styles.followButton}
        disabled={state === 'loading'}
        aria-disabled={following || undefined}
        onClick={follow}
      >
        {following ? <Check size={17} aria-hidden="true" /> : null}
        {following ? 'Following' : 'Follow this direction'}
        {!following && <ArrowUpRight size={17} aria-hidden="true" />}
      </button>
      <p className={styles.followNote} aria-live="polite">
        {state === 'saved' ? 'Saved in this browser.' : state === 'temporary' ? 'Saved for this visit.' : 'Save your interest in this browser.'}
      </p>
    </div>
  );
}
