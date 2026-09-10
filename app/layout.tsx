import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '电商热点雷达｜从趋势到增长机会',
  description:
    '追踪近期电商热点，把平台变化、AI 购物与增长趋势翻译成卖家可执行的机会。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
