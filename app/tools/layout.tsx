import ToolCreditModalHost from '@/components/tool-credit-modal-host';

export default function ToolsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><ToolCreditModalHost />{children}</>;
}
