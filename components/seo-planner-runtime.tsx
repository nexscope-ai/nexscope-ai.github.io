'use client';

import { useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import MdText from '@/components/md-text';

type MarkdownBridge = { render: (container: HTMLElement, text: string) => () => void };

export default function SeoPlannerRuntime() {
  useEffect(() => {
    if (!document.querySelector('[data-seo-planner]')) return;
    const roots = new Set<Root>();
    const markdownBridge: MarkdownBridge = {
      render(container, text) {
        const root = createRoot(container);
        roots.add(root);
        root.render(<MdText text={text} variant="document" />);
        return () => {
          if (!roots.delete(root)) return;
          root.unmount();
        };
      },
    };
    const runtimeWindow = window as Window & { NexscopeToolMarkdown?: MarkdownBridge };
    runtimeWindow.NexscopeToolMarkdown = markdownBridge;
    const loadPlanner = () => {
      const runtime = (window as Window & { NexscopeSeoPlanner?: { version?: number; mount: () => void } }).NexscopeSeoPlanner;
      if (runtime?.version === 6) { runtime.mount(); return; }
      const id = 'nexscope-seo-planner-runtime';
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (script && !script.src.endsWith('/assets/seo-keyword-planner.js?v=6')) { script.remove(); script = null; }
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.src = '/assets/seo-keyword-planner.js?v=6';
        document.body.appendChild(script);
      }
      script.addEventListener('load', () => {
        (window as Window & { NexscopeSeoPlanner?: { mount: () => void } }).NexscopeSeoPlanner?.mount();
      }, { once: true });
    };
    const keyStore = (window as Window & { NexscopeToolApiKeySession?: { storage?: string } }).NexscopeToolApiKeySession;
    if (keyStore?.storage === 'localStorage') loadPlanner();
    else {
      const keyId = 'nexscope-tool-api-key-session';
      let script = document.getElementById(keyId) as HTMLScriptElement | null;
      if (script && !script.src.endsWith('/assets/tool-api-key-session.js?v=2')) { script.remove(); script = null; }
      if (!script) {
        script = document.createElement('script');
        script.id = keyId;
        script.src = '/assets/tool-api-key-session.js?v=2';
        document.body.appendChild(script);
      }
      script.addEventListener('load', loadPlanner, { once: true });
    }
    return () => {
      roots.forEach(root => root.unmount());
      roots.clear();
      if (runtimeWindow.NexscopeToolMarkdown === markdownBridge) delete runtimeWindow.NexscopeToolMarkdown;
    };
  }, []);
  return null;
}
