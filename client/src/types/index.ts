
// User types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  points: number;
  level: number;
  createdAt: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  fullName?: string;
  bio?: string;
  website?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
  skills?: string[];
  achievements?: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

// CTF Challenge types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  points: number;
  tags: string[];
  solved: boolean;
  solvedBy: number;
  createdAt: Date;
  updatedAt: Date;
  timeLimit?: number; // Optional time limit in seconds
  downloadUrl?: string; // Optional URL for downloadable content
  fileType?: 'archive' | 'image' | 'text' | 'binary' | 'other'; // Optional file type
}

export type ChallengeCategory = 
  | 'web' 
  | 'crypto' 
  | 'osint' 
  | 'steganography' 
  | 'reverse-engineering' 
  | 'forensics'
  | 'pwn'
  | 'programming'
  | 'network';

// Knowledge Base types
export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  author: string;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isFeatured: boolean;
  isPopular: boolean;
  comingSoon: boolean;
  category: 'scanner' | 'monitor' | 'crypto' | 'pentest' | 'devsec' | 'network' | 'other';
}

// Community types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  timeZone: string;
  type: 'workshop' | 'competition' | 'webinar' | 'meetup';
  registeredUsers?: number;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}
