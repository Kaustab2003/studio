
import type { Timestamp } from 'firebase/firestore';

export interface Poem {
  id: string;
  userId: string;
  poem: string;
  imageUrl: string;
  language: string;
  style: string;
  tone: string;
  createdAt: Timestamp;
}
