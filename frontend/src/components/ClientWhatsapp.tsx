'use client';

import dynamic from 'next/dynamic';

const WhatsappContact = dynamic(() => import('./WhatsappContact'), {
  ssr: false,
});

export default function ClientWhatsapp() {
  return <WhatsappContact />;
}
