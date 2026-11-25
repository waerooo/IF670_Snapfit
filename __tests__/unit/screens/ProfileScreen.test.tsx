import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import ProfileScreen from '../../../src/screens/ProfileScreen';
import { fetchUserStats } from '../../../src/services/firebase/databaseService';

jest.mock('../../../src/services/firebase/databaseService', () => ({
  fetchUserStats: jest.fn(),
}));

jest.mock('../../../src/services/firebase/authService', () => ({
  signOut: jest.fn(),
}));

const loadStats = jest.mocked(fetchUserStats);

describe('ProfileScreen', () => {
  beforeEach(() => {
    loadStats.mockReset();
  });

  it('shows the signed-in user stats', async () => {
    loadStats.mockResolvedValue({
      totalGames: 4,
      totalScore: 125,
      totalPoses: 17,
      bestScore: 60,
      averageAccuracy: 85,
    });
    let renderer!: ReactTestRenderer.ReactTestRenderer;

    await act(async () => {
      renderer = ReactTestRenderer.create(
        <ProfileScreen userId="user-1" email="player@example.com" onBack={jest.fn()} />,
      );
    });

    expect(loadStats).toHaveBeenCalledWith('user-1');
    expect(
      renderer.root.findByProps({ testID: 'profile-stat-value-games' }).props.children,
    ).toBe('4');
    expect(
      renderer.root.findByProps({ testID: 'profile-stat-value-score' }).props.children,
    ).toBe('125');
    expect(
      renderer.root.findByProps({ testID: 'profile-stat-value-accuracy' }).props.children,
    ).toBe('85%');
  });

  it('offers retry when stats cannot be loaded', async () => {
    loadStats.mockRejectedValue(new Error('offline'));
    let renderer!: ReactTestRenderer.ReactTestRenderer;

    await act(async () => {
      renderer = ReactTestRenderer.create(
        <ProfileScreen userId="user-1" email="player@example.com" onBack={jest.fn()} />,
      );
    });

    expect(
      renderer.root.findByProps({
        children: 'Statistik tidak dapat dimuat. Periksa koneksi lalu coba lagi.',
      }),
    ).toBeTruthy();

    loadStats.mockResolvedValue(null);
    await act(async () => {
      await renderer.root.findByProps({ testID: 'profile-retry' }).props.onPress();
    });
    expect(loadStats).toHaveBeenCalledTimes(2);
  });
});
