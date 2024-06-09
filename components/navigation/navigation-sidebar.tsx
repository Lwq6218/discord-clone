import NavigationAction from '@/components/navigation/navigation-action';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ModeToggle } from '../mode-toogle';
import NavigationItem from './navigation-item';

const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) return redirect('/');
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className='flex size-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]'>
      <NavigationAction />
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <ScrollArea className='w-full flex-1'>
        {servers.map((server) => (
          <NavigationItem
            key={server.id}
            id={server.id}
            imageUrl={server.imageUrl}
            name={server.name}
          />
        ))}
      </ScrollArea>
      <div className='mt-auto flex flex-col items-center gap-y-4 pb-3'>
        <ModeToggle />
        <UserButton
          afterSignOutUrl='/'
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]',
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
