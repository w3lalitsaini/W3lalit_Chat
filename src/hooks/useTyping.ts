import { useState, useEffect, useCallback, useRef } from 'react';
import socketService from '../services/socket';

export const useTyping = (conversationId: string | null) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = socketService.onTyping(({ conversationId: convId, userId, isTyping }) => {
      if (convId === conversationId) {
        setTypingUsers(prev => {
          if (isTyping) {
            return prev.includes(userId) ? prev : [...prev, userId];
          } else {
            return prev.filter(id => id !== userId);
          }
        });
      }
    });

    return () => {
      unsubscribe();
      setTypingUsers([]);
    };
  }, [conversationId]);

  const startTyping = useCallback(() => {
    if (!conversationId || isTypingRef.current) return;
    
    isTypingRef.current = true;
    socketService.emitTyping(conversationId, true);
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    if (!conversationId || !isTypingRef.current) return;
    
    isTypingRef.current = false;
    socketService.emitTyping(conversationId, false);
  }, [conversationId]);

  const handleInputChange = useCallback(() => {
    startTyping();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [startTyping, stopTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && conversationId) {
        socketService.emitTyping(conversationId, false);
      }
    };
  }, [conversationId]);

  return {
    typingUsers,
    handleInputChange,
    stopTyping
  };
};
