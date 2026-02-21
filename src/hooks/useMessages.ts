import { useState, useEffect, useCallback, useRef } from 'react';
import type { Message } from '../types';
import { messageAPI } from '../services/api';
import socketService from '../services/socket';

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async (pageNum = 1) => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      const response = await messageAPI.getMessages(conversationId, pageNum);
      
      if (pageNum === 1) {
        setMessages(response.data.messages);
      } else {
        setMessages(prev => [...response.data.messages, ...prev]);
      }
      
      setHasMore(response.data.hasMore);
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    await fetchMessages(nextPage);
    setPage(nextPage);
  }, [hasMore, loading, page, fetchMessages]);

  useEffect(() => {
    if (conversationId) {
      setPage(1);
      fetchMessages(1);
    }
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribeNew = socketService.onNewMessage((message: Message) => {
      if (message.conversation === conversationId) {
        setMessages(prev => [...prev, message]);
        // Mark as seen
        setTimeout(() => {
          socketService.emitMessageSeen(message._id, conversationId);
        }, 1000);
      }
    });

    const unsubscribeDelete = socketService.onMessageDeleted(({ messageId }) => {
      setMessages(prev =>
        prev.map(m =>
          m._id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted' } : m
        )
      );
    });

    const unsubscribeReaction = socketService.onMessageReaction(({ messageId, reactions }) => {
      setMessages(prev =>
        prev.map(m =>
          m._id === messageId ? { ...m, reactions } : m
        )
      );
    });

    const unsubscribeSeen = socketService.onMessageSeen(({ messageId, seenBy, seenAt }) => {
      setMessages(prev =>
        prev.map(m =>
          m._id === messageId
            ? { ...m, seenBy: [...m.seenBy, { user: { _id: seenBy } as any, seenAt }] }
            : m
        )
      );
    });

    return () => {
      unsubscribeNew();
      unsubscribeDelete();
      unsubscribeReaction();
      unsubscribeSeen();
    };
  }, [conversationId]);

  const sendMessage = async (data: {
    content: string;
    messageType?: string;
    replyTo?: string;
    mediaUrl?: string;
    duration?: number;
  }) => {
    if (!conversationId) return;
    
    try {
      const response = await messageAPI.send(conversationId, data);
      // Optimistic update
      setMessages(prev => [...prev, response.data.message]);
      return response.data.message;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to send message');
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await messageAPI.delete(messageId);
      setMessages(prev =>
        prev.map(m =>
          m._id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted' } : m
        )
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete message');
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      const response = await messageAPI.addReaction(messageId, emoji);
      setMessages(prev =>
        prev.map(m =>
          m._id === messageId ? { ...m, reactions: response.data.message.reactions } : m
        )
      );
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add reaction');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    messages,
    loading,
    hasMore,
    messagesEndRef,
    sendMessage,
    deleteMessage,
    addReaction,
    loadMore,
    scrollToBottom
  };
};
