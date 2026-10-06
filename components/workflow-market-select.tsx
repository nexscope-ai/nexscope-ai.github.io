'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

type WorkflowMarketSelectProps = {
  label: string;
  name: 'amazonDomain' | 'region';
  options: { value: string; label: string }[];
};

export default function WorkflowMarketSelect({ label, name, options }: WorkflowMarketSelectProps) {
  const [value, setValue] = useState(options[0]?.value ?? '');
  const labelId = `wf-${name}-label`;
  const errorId = `wf-${name}-error`;

  useEffect(() => {
    const syncMarket = (event: Event) => {
      const detail = (event as CustomEvent<{ name: string; value: string }>).detail;
      if (detail?.name === name && options.some((option) => option.value === detail.value)) {
        setValue(detail.value);
      }
    };
    document.addEventListener('workflow-market-sync', syncMarket);
    return () => document.removeEventListener('workflow-market-sync', syncMarket);
  }, [name, options]);

  return (
    <div className="wf-market-field">
      <span id={labelId}>{label}</span>
      <Select name={name} value={value} onValueChange={(next) => {
        if (!next) return;
        setValue(next);
        document.dispatchEvent(new CustomEvent('workflow-market-change', { detail: { name } }));
      }}>
        <SelectTrigger className="wf-market-trigger" aria-labelledby={labelId} aria-describedby={errorId}>
          <span className="wf-market-value">{options.find((option) => option.value === value)?.label}</span>
        </SelectTrigger>
        <SelectContent className="wf-market-popup" align="start" alignItemWithTrigger={false}>
          {options.map((option) => (
            <SelectItem className="wf-market-option" key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="wf-field-error" id={errorId} data-error-for={name} role="alert" />
    </div>
  );
}
