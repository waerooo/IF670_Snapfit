import React, {useEffect, useState} from 'react';
import {
  fetchRecentSessions,
  fetchUserStats,
} from '../../services/firebase/databaseService';
import type {GameSession, UserStats} from '../../types';
import StatisticsView from './StatisticsView';

interface StatisticsScreenProps {
  userId: string;
  onBack: () => void;
}

const SESSION_COUNT = 7;

/**
 * Halaman statistik pemain. Hanya mengambil data lewat fungsi yang sudah ada
 * di databaseService (tidak diubah), lalu menyerahkannya ke StatisticsView.
 */
const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  userId,
  onBack,
}) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    Promise.all([
      fetchUserStats(userId),
      fetchRecentSessions(userId, SESSION_COUNT),
    ])
      .then(([loadedStats, loadedSessions]) => {
        if (!cancelled) {
          setStats(loadedStats);
          setSessions(loadedSessions);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <StatisticsView
      stats={stats}
      sessions={sessions}
      isLoading={isLoading}
      hasError={hasError}
      onBack={onBack}
    />
  );
};

export default StatisticsScreen;
