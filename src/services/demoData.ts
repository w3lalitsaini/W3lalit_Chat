import type { User, Conversation, Message } from '../types';

export const demoUser: User = {
  _id: 'demo-user-1',
  username: 'johndoe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
  fullName: 'John Doe',
  bio: 'Love chatting with friends! 💬',
  isOnline: true,
  lastSeen: new Date().toISOString(),
  followers: [],
  following: []
};

export const demoUsers: User[] = [
  {
    _id: 'demo-user-2',
    username: 'sarahsmith',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    fullName: 'Sarah Smith',
    bio: 'Photographer 📸',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    followers: [],
    following: []
  },
  {
    _id: 'demo-user-3',
    username: 'mikejohnson',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    fullName: 'Mike Johnson',
    bio: 'Developer 💻',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    followers: [],
    following: []
  },
  {
    _id: 'demo-user-4',
    username: 'emilydavis',
    email: 'emily@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    fullName: 'Emily Davis',
    bio: 'Traveler ✈️',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    followers: [],
    following: []
  },
  {
    _id: 'demo-user-5',
    username: 'alexwilson',
    email: 'alex@example.com',
    avatar: '',
    fullName: 'Alex Wilson',
    bio: 'Designer 🎨',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    followers: [],
    following: []
  }
];

export const demoMessages: Message[] = [
  {
    _id: 'msg-1',
    conversation: 'conv-1',
    sender: demoUsers[0],
    content: 'Hey! How are you doing? 👋',
    messageType: 'text',
    mediaUrl: '',
    seenBy: [],
    deliveredTo: [],
    reactions: [],
    isDeleted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    _id: 'msg-2',
    conversation: 'conv-1',
    sender: demoUser,
    content: 'I\'m doing great! Just finished working on the new project. How about you?',
    messageType: 'text',
    mediaUrl: '',
    seenBy: [{ user: demoUsers[0], seenAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() }],
    deliveredTo: [{ user: demoUsers[0], deliveredAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() }],
    reactions: [{ user: demoUsers[0], emoji: '👍' }],
    isDeleted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString()
  },
  {
    _id: 'msg-3',
    conversation: 'conv-1',
    sender: demoUsers[0],
    content: 'That\'s awesome! Would love to see it when it\'s ready 🚀',
    messageType: 'text',
    mediaUrl: '',
    seenBy: [{ user: demoUser, seenAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() }],
    deliveredTo: [{ user: demoUser, deliveredAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() }],
    reactions: [],
    isDeleted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    _id: 'msg-4',
    conversation: 'conv-1',
    sender: demoUsers[0],
    content: '',
    messageType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
    seenBy: [{ user: demoUser, seenAt: new Date(Date.now() - 1000 * 60).toISOString() }],
    deliveredTo: [{ user: demoUser, deliveredAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() }],
    reactions: [{ user: demoUser, emoji: '❤️' }],
    isDeleted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    _id: 'msg-5',
    conversation: 'conv-1',
    sender: demoUser,
    content: 'Beautiful photo! Where was this taken?',
    messageType: 'text',
    mediaUrl: '',
    seenBy: [],
    deliveredTo: [],
    reactions: [],
    isDeleted: false,
    createdAt: new Date(Date.now() - 1000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 30).toISOString()
  }
];

export const demoConversations: Conversation[] = [
  {
    _id: 'conv-1',
    participant: demoUsers[0],
    isGroup: false,
    lastMessage: demoMessages[demoMessages.length - 1],
    unreadCount: 0,
    updatedAt: new Date().toISOString(),
    theme: 'default',
    emoji: '❤️'
  },
  {
    _id: 'conv-2',
    participant: demoUsers[1],
    isGroup: false,
    lastMessage: {
      _id: 'msg-last-2',
      conversation: 'conv-2',
      sender: demoUsers[1],
      content: 'Can you send me the file?',
      messageType: 'text',
      mediaUrl: '',
      seenBy: [],
      deliveredTo: [],
      reactions: [],
      isDeleted: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    theme: 'default',
    emoji: '👍'
  },
  {
    _id: 'conv-3',
    participant: demoUsers[2],
    isGroup: false,
    lastMessage: {
      _id: 'msg-last-3',
      conversation: 'conv-3',
      sender: demoUsers[2],
      content: 'The meeting is at 3 PM',
      messageType: 'text',
      mediaUrl: '',
      seenBy: [{ user: demoUser, seenAt: new Date().toISOString() }],
      deliveredTo: [{ user: demoUser, deliveredAt: new Date().toISOString() }],
      reactions: [],
      isDeleted: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    theme: 'default',
    emoji: '🔥'
  },
  {
    _id: 'conv-4',
    participant: demoUsers[3],
    isGroup: false,
    lastMessage: {
      _id: 'msg-last-4',
      conversation: 'conv-4',
      sender: demoUser,
      content: 'See you tomorrow!',
      messageType: 'text',
      mediaUrl: '',
      seenBy: [{ user: demoUsers[3], seenAt: new Date().toISOString() }],
      deliveredTo: [{ user: demoUsers[3], deliveredAt: new Date().toISOString() }],
      reactions: [{ user: demoUsers[3], emoji: '👋' }],
      isDeleted: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    theme: 'default',
    emoji: '🙌'
  }
];
