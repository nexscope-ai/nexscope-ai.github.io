'use client';

import { useEffect } from 'react';

export default function WorkflowRuntime() {
  useEffect(() => {
    if (!document.querySelector('[data-workflow-tool]')) return;
    const coreId = 'nexscope-workflow-core';
    const uiId = 'nexscope-workflow-ui';
    const loadUi = () => {
      if (document.getElementById(uiId)) return;
      const script = document.createElement('script');
      script.id = uiId;
      script.src = '/assets/workflow-tools.js?v=10';
      document.body.appendChild(script);
    };
    const loadedCore = (window as Window & { NexscopeWorkflowCore?: unknown }).NexscopeWorkflowCore;
    if (loadedCore) {
      loadUi();
      return;
    }
    let coreScript = document.getElementById(coreId) as HTMLScriptElement | null;
    if (!coreScript) {
      coreScript = document.createElement('script');
      coreScript.id = coreId;
      coreScript.src = '/assets/workflow-tools-core.js?v=5';
      document.body.appendChild(coreScript);
    }
    coreScript.addEventListener('load', loadUi, { once: true });
  }, []);

  return null;
}
