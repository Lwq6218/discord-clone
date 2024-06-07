'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrgin } from '@/hooks/use-origin';
import { useState } from 'react';
import axios from 'axios';

const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const orgin = useOrgin();
  const isModalOpen = isOpen && type === 'invite';
  const { server } = data;
  const [copied, setCopied] = useState(false);
  const [isLoading, SetIsLoading] = useState(false);

  const inviteUrl = `${orgin}/invite/${server?.inviteCode}`;
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const onNew = async () => {
    try {
      SetIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen('invite', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      SetIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>
            Invite Friends
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <div className='p-6'>
          <Label className='text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70'>
            Server invite link
          </Label>
          <div className='mt-2 flex items-center gap-x-2'>
            <Input
              disabled={isLoading}
              className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
              value={inviteUrl}
            />
            <Button disabled={isLoading} size='icon' onClick={onCopy}>
              {copied ? (
                <Check className='size-4' />
              ) : (
                <Copy className='size-4' />
              )}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            onClick={onNew}
            variant='link'
            size='sm'
            className='mt4 text-xs text-zinc-500'
          >
            Generatea a new link
            <RefreshCw className='ml-2 size-4' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
