/**
 * Firebase Firestore database service for game sessions, user stats, and achievements.
 */

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
} from '@react-native-firebase/firestore';
import type { QueryDocumentSnapshot, Transaction } from '@react-native-firebase/firestore';
import type { GameSession, UserStats, Achievement } from '../../types';

// ── Collections ──────────────────────────────────────────────

const SESSIONS_COL = 'gameSessions';
const USERS_COL = 'users';
const ACHIEVEMENTS_COL = 'achievements';

const db = getFirestore();

// ── Game Session ─────────────────────────────────────────────

/**
 * Save a completed game session to Firestore.
 * Called by GameScreen after game ends.
 */
export async function saveGameSession(session: Omit<GameSession, 'id'>): Promise<string> {
  console.log('[Firestore] Attempting to save gameSession:', session);
  try {
    const colRef = collection(db, SESSIONS_COL);
    const savePromise = addDoc(colRef, {
      ...session,
      createdAt: serverTimestamp(),
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore write timeout after 5000ms')), 5000),
    );

    const docRef = await Promise.race([savePromise, timeoutPromise]);
    console.log('[Firestore] SUCCESS! Document created with ID:', docRef.id);

    // Update aggregate stats asynchronously (non-blocking)
    _incrementUserStats(session.userId, session).catch(e =>
      console.warn('[Firestore] _incrementUserStats async note:', e),
    );

    return docRef.id;
  } catch (err) {
    console.error('[Firestore] FAILED to save gameSession:', err);
    return `local-${Date.now()}`;
  }
}

/**
 * Fetch the last N game sessions for a user (for Stats screen).
 */
export async function fetchRecentSessions(
  userId: string,
  limitCount: number = 10,
): Promise<GameSession[]> {
  try {
    const colRef = collection(db, SESSIONS_COL);
    const q = query(
      colRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount),
    );
    const snap = await getDocs(q);

    return snap.docs.map((d: QueryDocumentSnapshot) => ({
      id: d.id,
      ...(d.data() as object),
    } as GameSession));
  } catch (err) {
    console.error('[DB] fetchRecentSessions error:', err);
    return [];
  }
}

// ── User Stats ───────────────────────────────────────────────

/**
 * Fetch aggregate stats for the signed-in user's profile.
 */
export async function fetchUserStats(userId: string): Promise<UserStats | null> {
  try {
    const docRef = doc(db, USERS_COL, userId);
    const d = await getDoc(docRef);
    const exists = typeof d.exists === 'function' ? d.exists() : Boolean(d.exists);
    if (!exists) return null;
    const data = d.data() as { stats?: UserStats } | undefined;
    return data?.stats ?? null;
  } catch (err) {
    console.error('[DB] fetchUserStats error:', err);
    throw err;
  }
}

/** Internal: increment aggregate stats atomically after each game. */
async function _incrementUserStats(
  userId: string,
  session: Omit<GameSession, 'id'>,
): Promise<void> {
  const userDocRef = doc(db, USERS_COL, userId);

  await runTransaction(db, async (tx: Transaction) => {
    const d = await tx.get(userDocRef);
    const exists = typeof d.exists === 'function' ? d.exists() : Boolean(d.exists);
    const data = exists ? (d.data() as { stats?: UserStats }) : undefined;
    const current: UserStats = data?.stats ?? {
      totalGames: 0,
      totalScore: 0,
      totalPoses: 0,
      bestScore: 0,
      averageAccuracy: 0,
    };

    const newTotal = current.totalGames + 1;
    const newScore = current.totalScore + session.score;
    const newPoses = current.totalPoses + session.poseCount;
    const newBest = Math.max(current.bestScore, session.score);
    const newAvgAcc = Math.round(
      (current.averageAccuracy * current.totalGames + session.accuracy) / newTotal,
    );

    tx.set(
      userDocRef,
      {
        stats: {
          totalGames: newTotal,
          totalScore: newScore,
          totalPoses: newPoses,
          bestScore: newBest,
          averageAccuracy: newAvgAcc,
        },
        lastPlayedAt: session.timestamp,
      },
      { merge: true },
    );
  });
}

// ── Achievements ─────────────────────────────────────────────

/**
 * Fetch all achievements for the Achievement screen.
 * Unlocked achievements have `unlockedAt` set.
 */
export async function fetchAchievements(userId: string): Promise<Achievement[]> {
  try {
    const achColRef = collection(db, ACHIEVEMENTS_COL);
    const q = query(achColRef, orderBy('requiredScore'));
    const userAchColRef = collection(db, USERS_COL, userId, 'unlockedAchievements');

    const [masterSnap, userSnap] = await Promise.all([
      getDocs(q),
      getDocs(userAchColRef),
    ]);

    const unlockedMap = new Map<string, number>();
    userSnap.docs.forEach((d: QueryDocumentSnapshot) => {
      const data = d.data() as { unlockedAt?: number };
      if (data?.unlockedAt) {
        unlockedMap.set(d.id, data.unlockedAt);
      }
    });

    return masterSnap.docs.map((d: QueryDocumentSnapshot) => ({
      id: d.id,
      ...(d.data() as Omit<Achievement, 'id' | 'unlockedAt'>),
      unlockedAt: unlockedMap.get(d.id),
    }));
  } catch (err) {
    console.error('[DB] fetchAchievements error:', err);
    return [];
  }
}

/**
 * Check and unlock achievements based on latest stats.
 * Call after saveGameSession resolves.
 */
export async function checkAndUnlockAchievements(
  userId: string,
  stats: UserStats,
): Promise<Achievement[]> {
  try {
    const all = await fetchAchievements(userId);
    const newlyUnlocked: Achievement[] = [];

    for (const ach of all) {
      if (ach.unlockedAt) continue; // already unlocked

      const scoreOk = ach.requiredScore ? stats.bestScore >= ach.requiredScore : true;
      const posesOk = ach.requiredPoses ? stats.totalPoses >= ach.requiredPoses : true;

      if (scoreOk && posesOk) {
        const unlockedAt = Date.now();
        const achDocRef = doc(db, USERS_COL, userId, 'unlockedAchievements', ach.id);
        await setDoc(achDocRef, { unlockedAt });

        newlyUnlocked.push({ ...ach, unlockedAt });
      }
    }

    return newlyUnlocked;
  } catch (err) {
    console.error('[DB] checkAndUnlockAchievements error:', err);
    return [];
  }
}
