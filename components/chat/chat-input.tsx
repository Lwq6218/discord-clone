'use client';

import { Form, FormControl, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/use-modal-store';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Plus } from 'lucide-react';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EmojiPicker } from '../EmojiPicker';
import { useRouter } from 'next/navigation';
interface ChatInputProps {
  apiUrl: string;
  query: Record<string, string>;
  name: string;
  type: 'conversation' | 'channel';
}

const fromScheme = z.object({
  content: z.string().min(1),
});
const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof fromScheme>>({
    resolver: zodResolver(fromScheme),
    defaultValues: {
      content: '',
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof fromScheme>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormControl>
              <div className='relative p-4 pb-6'>
                <button
                  type='button'
                  onClick={() => onOpen('messageFile', { query, apiUrl })}
                  className='absolute left-8 top-7 flex size-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300'
                >
                  <Plus className='text-white dark:text-[#313338]' />
                </button>
                <Input
                  disabled={isLoading}
                  {...field}
                  placeholder={`Message ${type === 'conversation' ? name : '#' + name}`}
                  className='border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200'
                />
                <div className='absolute right-8 top-7'>
                  <EmojiPicker
                    onChange={(emoji: string) =>
                      field.onChange(`${field.value} ${emoji}`)
                    }
                  />
                </div>
              </div>
            </FormControl>
          )}
        />
      </form>
    </Form>
  );
};
export default ChatInput;
