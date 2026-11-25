import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import AppNavigator from '../../src/navigation/AppNavigator';

// GameScreen memakai kamera native yang tidak tersedia di Jest.
jest.mock('../../src/screens/GameScreen', () => () => null);
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

type Renderer = ReactTestRenderer.ReactTestRenderer;

const screenText = (renderer: Renderer) => JSON.stringify(renderer.toJSON());

/** Menekan elemen yang punya prop onPress dan accessibilityLabel/Role tertentu. */
const press = async (
  renderer: Renderer,
  match: (props: Record<string, unknown>) => boolean,
) => {
  const target = renderer.root.findAll(
    node => typeof node.props.onPress === 'function' && match(node.props),
  )[0];
  await act(async () => {
    target.props.onPress();
  });
};

const renderApp = async () => {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(<AppNavigator />);
  });
  return renderer;
};

describe('navigasi aplikasi', () => {
  it('mulai dari layar Welcome', async () => {
    const renderer = await renderApp();
    expect(screenText(renderer)).toContain('Continue as Guest');
  });

  it('Continue as Guest membuka Home', async () => {
    const renderer = await renderApp();
    await press(renderer, p => p.accessibilityRole === 'link');
    expect(screenText(renderer)).toContain('Daily Streak');
  });
});
