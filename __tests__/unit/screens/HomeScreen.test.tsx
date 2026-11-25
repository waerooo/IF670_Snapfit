import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import HomeScreen from '../../../src/screens/HomeScreen';

describe('HomeScreen', () => {
  it('provides actions to open the profile and start gameplay', async () => {
    const onOpenProfile = jest.fn();
    const onStartGame = jest.fn();
    let renderer!: ReactTestRenderer.ReactTestRenderer;

    await act(async () => {
      renderer = ReactTestRenderer.create(
        <HomeScreen
          email="player@example.com"
          onOpenProfile={onOpenProfile}
          onStartGame={onStartGame}
        />,
      );
    });

    act(() => renderer.root.findByProps({ testID: 'menu-profile' }).props.onPress());
    act(() => renderer.root.findByProps({ testID: 'menu-play' }).props.onPress());

    expect(onOpenProfile).toHaveBeenCalledTimes(1);
    expect(onStartGame).toHaveBeenCalledTimes(1);
  });
});
