import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import ServerHeader from './server-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import ServerSearch from './server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

interface ServerSidebarProps {
  serverId: string;
}
const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 size-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 size-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 size-4' />,
};
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='text-rese-500 mr-2 size-4' />,
};
export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) return redirect('/');
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  if (!server) return redirect('/');
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  return (
    <div className='flex h-full w-full flex-col bg-[#f2F3F5] text-primary dark:bg-[#2B2D31]'>
      <ServerHeader server={server} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },

              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className='my-2 rounded-md bg-zinc-200 dark:bg-zinc-700' />
        {!!textChannels.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channel'
              channelType={ChannelType.TEXT}
              role={role}
              label='Text Channels'
            />
          </div>
        )}
        <div className='space-y-[2px]'>
          {textChannels.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
            />
          ))}
        </div>
        {!!audioChannels.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channel'
              channelType={ChannelType.AUDIO}
              role={role}
              label='Voide Channels'
            />
          </div>
        )}

        <div className='space-y-[2px]'>
          {audioChannels.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
            />
          ))}
        </div>
        {!!videoChannels.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channel'
              channelType={ChannelType.VIDEO}
              role={role}
              label='Video Channels'
            />
          </div>
        )}

        <div className='space-y-[2px]'>
          {videoChannels.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
            />
          ))}
        </div>
        {!!members.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='member'
              role={role}
              label='Members'
              server={server}
            />
          </div>
        )}

        <div className='space-y-[2px]'>
          {members.map((member) => (
            <ServerMember key={member.id} member={member} server={server} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
