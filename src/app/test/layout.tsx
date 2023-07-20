import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-localstorage-manager test',
  description: 'react-localstorage-manager test',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
