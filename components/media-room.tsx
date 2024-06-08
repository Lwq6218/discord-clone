'use client';

import { useUser } from '@clerk/nextjs';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}
export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (!token) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <Loader2 className='my-4 size-7 animate-spin text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading...</p>
      </div>
    );
  }
  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      connect={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme='default'
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
