'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { db } from './firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

const ttlOptions: { [key: string]: number } = {
  '10m': 10 * 60,
  '1h': 60 * 60,
  '1d': 24 * 60 * 60,
  '1w': 7 * 24 * 60 * 60,
  never: Infinity,
};

const CreatePasteSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  ttl: z.string().refine((val) => Object.keys(ttlOptions).includes(val)),
});

export const createPaste = ai.defineFlow(
  {
    name: 'createPaste',
    inputSchema: CreatePasteSchema,
    outputSchema: z.void(),
  },
  async ({ id, content, ttl }) => {
    const expiryDurationSeconds = ttlOptions[ttl];
    const createdAt = Timestamp.now();
    
    const pasteData: {
      content: string;
      createdAt: Timestamp;
      expiresAt: Timestamp | null;
    } = {
      content,
      createdAt,
      expiresAt: null,
    };

    if (expiryDurationSeconds !== Infinity) {
      pasteData.expiresAt = new Timestamp(createdAt.seconds + expiryDurationSeconds, createdAt.nanoseconds);
    }
    
    await setDoc(doc(db, "pastes", id), pasteData);
  }
);

export const getPaste = ai.defineFlow(
  {
    name: 'getPaste',
    inputSchema: z.string(),
    outputSchema: z.string().nullable(),
  },
  async (id) => {
    const docRef = doc(db, "pastes", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const paste = docSnap.data();
    const expiresAt = paste.expiresAt; // Can be a Timestamp or null

    if (expiresAt && expiresAt instanceof Timestamp && expiresAt.toDate() < new Date()) {
      // Optionally, you could delete the expired paste from the DB here
      return null;
    }
    
    return paste.content;
  }
);
