import { useState, useEffect, useCallback } from 'react';
import type { Conversation, Message } from '../types';
import { conversationAPI } from '../services/api';
import socketService from '../services/socket';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await conversationAPI.getAll();
      setConversations(response.data.conversations);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();

    // Listen for new messages to update conversation list
    const unsubscribe = socketService.onNewMessage((message: Message) => {
      setConversations(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c._id === message.conversation);
        
        if (index !== -1) {
          // Update existing conversation
          updated[index] = {
            ...updated[index],
            lastMessage: message,
            updatedAt: message.createdAt,
            unreadCount: updated[index].unreadCount + 1
          };
          // Move to top
          const [conv] = updated.splice(index, 1);
          updated.unshift(conv);
        }
        
        return updated;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [fetchConversations]);

  const markAsRead = async (conversationId: string) => {
    try {
      await conversationAPI.markAsRead(conversationId);
      setConversations(prev =>
        prev.map(c =>
          c._id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  };

  const getOrCreateConversation = async (userId: string) => {
    try {
      const response = await conversationAPI.getOrCreate(userId);
      const conversation = response.data.conversation;
      
      setConversations(prev => {
        const exists = prev.find(c => c._id === conversation._id);
        if (exists) return prev;
        return [conversation, ...prev];
      });
      
      return conversation;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create conversation');
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await conversationAPI.delete(conversationId);
      setConversations(prev => prev.filter(c => c._id !== conversationId));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete conversation');
    }
  };

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    markAsRead,
    getOrCreateConversation,
    deleteConversation
  };
};
