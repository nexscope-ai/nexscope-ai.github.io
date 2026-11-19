'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowLeft, ArrowRight, Globe2, Layers3, RotateCcw } from 'lucide-react';
import { directionArtwork, futureDirections, type FutureDirection } from '@/lib/future-directions';
import { DirectionFollow } from './direction-follow';
import styles from './future-directions.module.css';

const sceneCaptions = {
  radar: ['Market opportunity map', 'United States · Kitchen storage', 'Germany · Home organization', 'Japan · Compact appliances'],
  growth: ['Compact kitchen scale', 'Listing review · Product dimensions', 'Priority fix · Battery requirements', 'Updated gallery · Display in use'],
  creative: ['Paint roller · Creative brief', 'Square · Main product image', 'Landscape · Detail visual', 'Portrait · Short video concept'],
} as const;

const chapterIds = ['overview', 'first-step', 'second-step', 'third-step'] as const;

export function DirectionPreview({ kind }: { kind: FutureDirection }) {
  const direction = futureDirections[kind];
  const main = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ReturnType<typeof import('./direction-scenes').mountDirectionScene> | null>(null);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const activeChapter = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const container = main.current;
    const element = canvas.current;
    if (!container || !element) return;

    let active = true;
    let scrollFrame = 0;
    const sections = Array.from(container.querySelectorAll('section[data-chapter]'));
    function updateChapter() {
      scrollFrame = 0;
      const readingLine = window.innerHeight * 0.55;
      const current = sections.findLastIndex((section) => section.getBoundingClientRect().top <= readingLine);
      const next = Math.max(0, current);
      if (activeChapter.current !== next) {
        activeChapter.current = next;
        setChapter(next);
        scene.current?.setChapter(next);
      }
    }
    function onScroll() {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateChapter);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    if (typeof WebGL2RenderingContext !== 'undefined') {
      import('./direction-scenes').then(({ mountDirectionScene }) => {
        if (!active) return;
        scene.current = mountDirectionScene(kind, element, () => {
          if (active) setInteractive(false);
        });
        scene.current.setChapter(activeChapter.current);
        setInteractive(true);
      }).catch(() => {
        if (active) setInteractive(false);
      });
    }

    return () => {
      active = false;
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
    scene.current?.rotate((event.clientX - start.x) * 0.008, (event.clientY - start.y) * 0.005);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function endDrag(event: PointerEvent<HTMLCanvasElement>) {
    if (drag.current?.id === event.pointerId) drag.current = null;
  }

  return (
    <main
      id="main"
      ref={main}
      className={styles.page}
      data-direction={kind}
      data-scene-state={interactive ? 'interactive' : 'static'}
      data-active-chapter={chapter}
    >
      <div className={styles.world}>
        {!interactive && (
          <div className={styles.fallback} aria-hidden="true">
            {kind === 'radar' && <div className={styles.fallbackGlobe}><Globe2 size="60%" strokeWidth={0.7} /></div>}
            {kind === 'growth' && (
              <div className={styles.fallbackTasks}>
                <Layers3 size={22} />
                <span>Compact kitchen scale</span>
                <strong>{chapter ? direction.labels[chapter - 1] : 'Listing review'}</strong>
              </div>
            )}
            {kind === 'creative' && <Image src={directionArtwork[Math.max(0, chapter - 1)]} alt="" width={348} height={348} unoptimized />}
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
        <div className={styles.shade} />
        <div className={styles.hud}>
          <p className={styles.sceneCaption} aria-live="polite">{sceneCaptions[kind][chapter]}</p>
          {interactive && (
            <div className={styles.controls}>
              <button type="button" aria-label="Rotate left" onClick={() => scene.current?.rotate(-0.32)}><ArrowLeft size={16} aria-hidden="true" /></button>
              <button type="button" aria-label="Rotate right" onClick={() => scene.current?.rotate(0.32)}><ArrowRight size={16} aria-hidden="true" /></button>
              <button type="button" aria-label="Reset view" onClick={() => scene.current?.reset()}><RotateCcw size={15} aria-hidden="true" /></button>
            </div>
          )}
        </div>
        <nav className={styles.chapterNav} aria-label="Concept chapters">
          {['Overview', ...direction.steps.map(([title]) => title)].map((label, index) => (
            <a key={label} href={'#' + chapterIds[index]} aria-label={label} aria-current={chapter === index ? 'step' : undefined} title={label}>
              <span />
            </a>
          ))}
        </nav>
      </div>
      <div className={styles.story}>
        <section id="overview" className={styles.chapter} data-chapter aria-labelledby="direction-title">
          <div className={styles.copy}>
            <p className={styles.eyebrow}>{direction.title}</p>
            <h1 id="direction-title">{direction.headline}</h1>
            <p className={styles.lede}>{direction.intro}</p>
            <DirectionFollow feature={direction.feature} />
            <a href="#first-step" className={styles.next}>
              <ArrowDown size={17} aria-hidden="true" /> Explore the concept
            </a>
          </div>
        </section>
        {direction.steps.map(([title, description], index) => (
          <section
            id={chapterIds[index + 1]}
            className={styles.chapter}
            data-chapter
            key={title}
            aria-labelledby={'direction-step-' + index}
          >
            <div className={styles.copy}>
              <p className={styles.eyebrow}>{direction.preview}</p>
              <h2 id={'direction-step-' + index}>{title}</h2>
              <p className={styles.lede}>{description}</p>
              {index === 0 && <p className={styles.example}>{direction.scenario}</p>}
              <a className={styles.next} href={'#' + chapterIds[(index + 2) % chapterIds.length]}>
                {index === 2 ? <RotateCcw size={16} aria-hidden="true" /> : <ArrowDown size={17} aria-hidden="true" />}
                {index === 2 ? 'Back to overview' : direction.steps[index + 1][0]}
              </a>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
