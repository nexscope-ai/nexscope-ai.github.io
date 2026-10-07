'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowRight, X } from 'lucide-react';
import { dataCreditsUrl, TOOL_CREDIT_MODAL_EVENT, type CreditShortfallStage } from '@/lib/tool-credit-modal';

export default function ToolCreditModalHost() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<CreditShortfallStage>('data');
  const [billingUrl, setBillingUrl] = useState('');

  useEffect(() => {
    const onShortfall = (event: Event) => {
      const detail = (event as CustomEvent<{ stage?: CreditShortfallStage }>).detail;
      setStage(detail?.stage === 'analysis' ? 'analysis' : 'data');
      setBillingUrl(dataCreditsUrl(window.location.pathname));
      setOpen(true);
    };
    window.addEventListener(TOOL_CREDIT_MODAL_EVENT, onShortfall);
    return () => window.removeEventListener(TOOL_CREDIT_MODAL_EVENT, onShortfall);
  }, []);

  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-[1199] bg-slate-950/55 backdrop-blur-[2px]" />
      <Dialog.Popup className="fixed top-1/2 left-1/2 z-[1200] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-violet-200 bg-white p-5 text-slate-900 shadow-2xl outline-none sm:p-6" data-testid="insufficient-credits-notice">
        <Dialog.Close aria-label="Dismiss insufficient credits notice" className="absolute top-4 right-4 grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-violet-500"><X size={18} /></Dialog.Close>
        <Dialog.Title className="pr-9 text-lg font-semibold">Insufficient Data credits</Dialog.Title>
        <Dialog.Description className="mt-2 pr-5 text-sm leading-6 text-slate-600">
          {stage === 'analysis'
            ? 'Your source results are still available. Add Data credits to generate the AI report, then retry analysis without repeating the data lookup.'
            : 'This API request could not complete with the available Data credits. Add credits, then retry when you are ready.'}
        </Dialog.Description>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Dialog.Close className="inline-flex min-h-10 items-center justify-center rounded-lg border border-violet-200 px-4 text-sm font-semibold text-violet-700 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-violet-500">Continue editing</Dialog.Close>
          <a href={billingUrl || 'https://www.nexscope.ai/seller/billing?mode=data#top-up'} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-semibold !text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-violet-500">Buy Data credits <ArrowRight size={15} /></a>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}
