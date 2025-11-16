'use client';

import dynamic from 'next/dynamic';

const LazySupportModal = dynamic(() => import('@/app/components/SupportModal'), {
  ssr: false,
  loading: () => null,
});

const SupportModalRoot = () => {
  return <LazySupportModal />;
};

export default SupportModalRoot;
