'use client';

import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/types';
import { ChannelType, MemberRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';
import { ActionTooltip } from '../action-tooltip';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channel' | 'member';
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}
const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400'>
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channel' && (
        <ActionTooltip label='Create Channel' side='top'>
          <button
            onClick={() => onOpen('createChannel', { channelType })}
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
          >
            <Plus className='size-4' />
          </button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === 'member' && (
        <ActionTooltip label='Manage Members' side='top'>
          <button
            onClick={() => onOpen('members', { server })}
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
          >
            <Settings className='size-4' />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
