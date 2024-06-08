'use client';

import { Channel, ChannelType, Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'members'
  | 'leaveServer'
  | 'deleteServer'
  | 'createChannel'
  | 'editChannel'
  | 'deleteChannel'
  | 'deleteMessage'
  | 'messageFile';
interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
}
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}
export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: ModalType, data = {}) => set({ type, data, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));
