import React, { useEffect, useState } from 'react';

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  data: any;
};
export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  data,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    const topDiv = chatRef?.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };
    topDiv?.addEventListener('scroll', handleScroll);
    return () => {
      topDiv?.removeEventListener('scroll', handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef.current;
    const shouldAutoScroll = () => {
      // If the chat has not been initialized, scroll to the bottom
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }
      // If the chat has been initialized, only scroll to the bottom if the user is already at the bottom
      if (!topDiv) {
        return false;
      }
      // If the user is at the bottom of the chat, scroll to the bottom
      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      // If the user is within 100px of the bottom, scroll to the bottom
      return distanceFromBottom <= 500;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [chatRef, data, bottomRef, hasInitialized]);
};
