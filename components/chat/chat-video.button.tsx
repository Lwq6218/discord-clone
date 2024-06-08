'use client';

import { Video, VideoOff } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { ActionTooltip } from '../action-tooltip';

export const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVideo = searchParams?.get('video');
  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? 'End Video call' : 'Start video call';
  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || '',
        query: { video: isVideo ? undefined : true },
      },
      { skipNull: true }
    );

    router.push(url);
  };
  return (
    <ActionTooltip side='bottom' label={tooltipLabel}>
      <button onClick={onClick} className='mr-4 transition hover:opacity-75'>
        <Icon className='size-6 text-zinc-500 dark:text-zinc-400' />
      </button>
    </ActionTooltip>
  );
};
