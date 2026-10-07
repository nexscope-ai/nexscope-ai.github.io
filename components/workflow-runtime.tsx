'use client';

import { useEffect } from 'react';

export default function WorkflowRuntime() {
  useEffect(() => {
    if (!document.querySelector('[data-workflow-tool]')) return;
    const keySessionId = 'nexscope-tool-api-key-session';
    const coreId = 'nexscope-workflow-core';
    const uiId = 'nexscope-workflow-ui';
    const loadUi = () => {
      const mountedUi = (window as Window & { NexscopeWorkflowUi?: { version?: number; mount: () => void } }).NexscopeWorkflowUi;
      if (mountedUi?.version === 12) { mountedUi.mount(); return; }
      let script = document.getElementById(uiId) as HTMLScriptElement | null;
      if (script && !script.src.endsWith('/assets/workflow-tools.js?v=12')) { script.remove(); script = null; }
      if (!script) {
        script = document.createElement('script');
        script.id = uiId;
        script.src = '/assets/workflow-tools.js?v=12';
        document.body.appendChild(script);
      }
      script.addEventListener('load', () => {
        (window as Window & { NexscopeWorkflowUi?: { mount: () => void } }).NexscopeWorkflowUi?.mount();
      }, { once: true });
    };
    const loadCore = () => {
      if ((window as Window & { NexscopeWorkflowCore?: { version?: number } }).NexscopeWorkflowCore?.version === 6) { loadUi(); return; }
      let script = document.getElementById(coreId) as HTMLScriptElement | null;
      if (script && !script.src.endsWith('/assets/workflow-tools-core.js?v=6')) { script.remove(); script = null; }
      if (!script) {
        script = document.createElement('script');
        script.id = coreId;
        script.src = '/assets/workflow-tools-core.js?v=6';
        document.body.appendChild(script);
      }
      script.addEventListener('load', loadUi, { once: true });
    };
    const keyStore = (window as Window & { NexscopeToolApiKeySession?: { storage?: string } }).NexscopeToolApiKeySession;
    if (keyStore?.storage === 'localStorage') { loadCore(); return; }
    let keyScript = document.getElementById(keySessionId) as HTMLScriptElement | null;
    if (keyScript && !keyScript.src.endsWith('/assets/tool-api-key-session.js?v=2')) { keyScript.remove(); keyScript = null; }
    if (!keyScript) {
      keyScript = document.createElement('script');
      keyScript.id = keySessionId;
      keyScript.src = '/assets/tool-api-key-session.js?v=2';
      document.body.appendChild(keyScript);
    }
    keyScript.addEventListener('load', loadCore, { once: true });
  }, []);

  return null;
}
