import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tble - Coming Soon',
};

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
