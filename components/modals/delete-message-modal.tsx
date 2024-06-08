'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import axios from 'axios';
import qs from 'query-string';
import { useState } from 'react';

const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'deleteMessage';

  const { apiUrl, query } = data;
  const [isLoading, SetIsLoading] = useState(false);

  const onClick = async () => {
    try {
      SetIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query: query,
      });
      await axios.delete(url);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
      SetIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>
            Delete Message
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure want to delete this?
            <br />
            The message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex w-full items-center justify-between'>
            <Button disabled={isLoading} onClick={onClose} variant='ghost'>
              Cancel
            </Button>
            <Button disabled={isLoading} variant='primary' onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
