'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Globe2, RotateCcw } from 'lucide-react';
import { directionArtwork, futureDirections, type FutureDirection } from '@/lib/future-directions';
import styles from './future-directions.module.css';

export function DirectionPreview({ kind }: { kind: FutureDirection }) {
  const direction = futureDirections[kind];
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ReturnType<typeof import('./direction-scenes').mountDirectionScene> | null>(null);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    let active = true;
    const element = canvas.current;
    if (!element) return;

    if (typeof WebGL2RenderingContext === 'undefined') return;

    import('./direction-scenes').then(({ mountDirectionScene }) => {
      if (!active) return;
      let failed = false;
      scene.current = mountDirectionScene(kind, element, () => {
        failed = true;
        if (active) setInteractive(false);
      });
      if (!failed) setInteractive(true);
    }).catch(() => {
      if (active) setInteractive(false);
    });

    return () => {
      active = false;
      scene.current?.dispose();
      scene.current = null;
      drag.current = null;
    };
  }, [kind]);

  function startDrag(event: PointerEvent<HTMLCanvasElement>) {
    if (!interactive || !event.isPrimary || event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLCanvasElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    scene.current?.rotate((event.clientX - start.x) * 0.009, (event.clientY - start.y) * 0.006);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function endDrag(event: PointerEvent<HTMLCanvasElement>) {
    if (drag.current?.id === event.pointerId) drag.current = null;
  }

  return (
    <figure className={styles.figure} data-scene-state={interactive ? 'interactive' : 'static'}>
      <figcaption className={styles.figureHeader}>
        <div><span className={styles.previewTag}>Concept preview</span><h2>{direction.preview}</h2></div>
        <p>{direction.previewDescription}</p>
      </figcaption>
      <div className={styles.stage}>
        {!interactive && (
          <div className={styles.fallback} aria-hidden="true">
            {kind === 'radar' && <div className={styles.globe}><Globe2 size={132} strokeWidth={0.85} /><i/><i/><i/></div>}
            {kind === 'growth' && <div className={styles.taskStack}>{direction.labels.map((label, index) => (
              <div key={label}><span>{['Lead image', 'Product specifications', 'Gallery'][index]}</span><strong>{label}</strong></div>
            ))}</div>}
            {kind === 'creative' && <div className={styles.artwork}>{[1, 0, 2].map((index) => (
              <Image key={index} src={directionArtwork[index]} alt="" width={190} height={145} unoptimized />
            ))}</div>}
          </div>
        )}
        <canvas
          ref={canvas}
          aria-hidden="true"
          className={styles.canvas}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
        />
      </div>
      <div className={styles.figureFooter}>
        <ul aria-label="Preview examples">{direction.labels.map((label) => <li key={label}>{label}</li>)}</ul>
        {interactive && (
          <div className={styles.controls}>
            <span>Drag to rotate</span>
            <button type="button" aria-label="Rotate left" onClick={() => scene.current?.rotate(-0.32)}><ArrowLeft size={15}/></button>
            <button type="button" aria-label="Rotate right" onClick={() => scene.current?.rotate(0.32)}><ArrowRight size={15}/></button>
            <button type="button" aria-label="Reset view" onClick={() => scene.current?.reset()}><RotateCcw size={15}/></button>
          </div>
        )}
      </div>
    </figure>
  );
}
