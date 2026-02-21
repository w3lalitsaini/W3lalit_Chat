import { io, Socket } from 'socket.io-client';
import type { Message, TypingEvent } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    this.userId = userId;
    // userId stored for future reference (reconnection, etc.)
    void this.userId;
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.socket?.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  // Typing indicators
  emitTyping(conversationId: string, isTyping: boolean) {
    this.socket?.emit('typing', { conversationId, isTyping });
  }

  onTyping(callback: (data: TypingEvent) => void) {
    this.socket?.on('typing', callback);
    return () => this.socket?.off('typing', callback);
  }

  // Message events
  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on('new_message', callback);
    return () => this.socket?.off('new_message', callback);
  }

  onMessageDeleted(callback: (data: { messageId: string }) => void) {
    this.socket?.on('message_deleted', callback);
    return () => this.socket?.off('message_deleted', callback);
  }

  onMessageReaction(callback: (data: { messageId: string; reactions: any[] }) => void) {
    this.socket?.on('message_reaction', callback);
    return () => this.socket?.off('message_reaction', callback);
  }

  onMessageSeen(callback: (data: { messageId: string; seenBy: string; seenAt: string }) => void) {
    this.socket?.on('message_seen', callback);
    return () => this.socket?.off('message_seen', callback);
  }

  // Online status
  onUserOnline(callback: (data: { userId: string }) => void) {
    this.socket?.on('user_online', callback);
    return () => this.socket?.off('user_online', callback);
  }

  onUserOffline(callback: (data: { userId: string; lastSeen: string }) => void) {
    this.socket?.on('user_offline', callback);
    return () => this.socket?.off('user_offline', callback);
  }

  // Call events
  onCallOffer(callback: (data: { from: string; offer: RTCSessionDescriptionInit; type: 'video' | 'audio' }) => void) {
    this.socket?.on('call_offer', callback);
    return () => this.socket?.off('call_offer', callback);
  }

  onCallAnswer(callback: (data: { from: string; answer: RTCSessionDescriptionInit }) => void) {
    this.socket?.on('call_answer', callback);
    return () => this.socket?.off('call_answer', callback);
  }

  onIceCandidate(callback: (data: { from: string; candidate: RTCIceCandidateInit }) => void) {
    this.socket?.on('ice_candidate', callback);
    return () => this.socket?.off('ice_candidate', callback);
  }

  onEndCall(callback: (data: { from: string }) => void) {
    this.socket?.on('end_call', callback);
    return () => this.socket?.off('end_call', callback);
  }

  emitCallOffer(to: string, offer: RTCSessionDescriptionInit, type: 'video' | 'audio') {
    this.socket?.emit('call_offer', { to, offer, type });
  }

  emitCallAnswer(to: string, answer: RTCSessionDescriptionInit) {
    this.socket?.emit('call_answer', { to, answer });
  }

  emitIceCandidate(to: string, candidate: RTCIceCandidateInit) {
    this.socket?.emit('ice_candidate', { to, candidate });
  }

  emitEndCall(to: string) {
    this.socket?.emit('end_call', { to });
  }

  emitMessageSeen(messageId: string, conversationId: string) {
    this.socket?.emit('message_seen', { messageId, conversationId });
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
