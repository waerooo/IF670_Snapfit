import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import StatisticsScreen from '../../../src/screens/StatisticsScreen';
import {
  fetchRecentSessions,
  fetchUserStats,
} from '../../../src/services/firebase/databaseService';

jest.mock('../../../src/services/firebase/databaseService', () => ({
  fetchUserStats: jest.fn(),
  fetchRecentSessions: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

const loadStats = jest.mocked(fetchUserStats);
const loadSessions = jest.mocked(fetchRecentSessions);

type Renderer = ReactTestRenderer.ReactTestRenderer;

const session = (id: string, score: number, accuracy: number, day: number) => ({
  id,
  userId: 'user-1',
  score,
  poseCount: 5,
  duration: 60,
  accuracy,
  timestamp: new Date(2026, 10, day, 12, 0, 0).getTime(), // 21 Nov 2026 dst.
});

const renderScreen = async (onBack = jest.fn()) => {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(
      <StatisticsScreen userId="user-1" onBack={onBack} />,
    );
  });
  return renderer;
};

const screenText = (renderer: Renderer) => JSON.stringify(renderer.toJSON());

describe('StatisticsScreen', () => {
  beforeEach(() => {
    loadStats.mockReset();
    loadSessions.mockReset();
  });

  it('memuat statistik dan sesi untuk pengguna yang sedang masuk', async () => {
    loadStats.mockResolvedValue(null);
    loadSessions.mockResolvedValue([]);
    await renderScreen();
    expect(loadStats).toHaveBeenCalledWith('user-1');
    expect(loadSessions).toHaveBeenCalledWith('user-1', 7);
  });

  it('menampilkan kartu angka dan dua grafik', async () => {
    loadStats.mockResolvedValue({
      totalGames: 4,
      totalScore: 125,
      totalPoses: 17,
      bestScore: 60,
      averageAccuracy: 84.6,
    });
    loadSessions.mockResolvedValue([
      session('b', 60, 90, 21), // terbaru lebih dulu, sesuai urutan server
      session('a', 40, 70, 20),
    ]);

    const renderer = await renderScreen();
    const text = screenText(renderer);

    expect(text).toContain('Statistik');
    expect(text).toContain('"125"'); // total skor
    expect(text).toContain('"85%"'); // 84.6 dibulatkan
    expect(text).toContain('Skor 2 sesi terakhir');
    expect(text).toContain('Akurasi per sesi');
    expect(
      renderer.root.findByProps({testID: 'statistics-chart-score'}),
    ).toBeTruthy();
  });

  it('grafik dibaca dari sesi paling lama ke paling baru', async () => {
    loadStats.mockResolvedValue({
      totalGames: 2,
      totalScore: 100,
      totalPoses: 9,
      bestScore: 60,
      averageAccuracy: 80,
    });
    loadSessions.mockResolvedValue([
      session('b', 60, 90, 21),
      session('a', 40, 70, 20),
    ]);

    const text = screenText(await renderScreen());
    expect(text.indexOf('20/11')).toBeGreaterThan(-1);
    expect(text.indexOf('20/11')).toBeLessThan(text.indexOf('21/11'));
  });

  it('menampilkan pesan bila belum ada permainan', async () => {
    loadStats.mockResolvedValue(null);
    loadSessions.mockResolvedValue([]);
    const text = screenText(await renderScreen());
    expect(text).toContain('Belum ada permainan');
    expect(text).not.toContain('Akurasi per sesi');
  });

  it('menampilkan pesan galat bila pemuatan gagal', async () => {
    loadStats.mockRejectedValue(new Error('gagal'));
    loadSessions.mockResolvedValue([]);
    const text = screenText(await renderScreen());
    expect(text).toContain('tidak dapat dimuat');
  });

  it('tombol kembali memanggil onBack', async () => {
    loadStats.mockResolvedValue(null);
    loadSessions.mockResolvedValue([]);
    const onBack = jest.fn();
    const renderer = await renderScreen(onBack);

    await act(async () => {
      renderer.root.findByProps({testID: 'statistics-back'}).props.onPress();
    });
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
