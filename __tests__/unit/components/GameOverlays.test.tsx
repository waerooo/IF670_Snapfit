import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import GameHud from '../../../src/components/game/GameHud';
import GetReadyOverlay from '../../../src/components/game/GetReadyOverlay';
import {GAME_DURATION_SECONDS} from '../../../src/constants';
import {MOCK_HUD} from '../../../src/constants/mockData';

// GetReadyOverlay membaca safe area, yang butuh provider asli di aplikasi.
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

type Renderer = ReactTestRenderer.ReactTestRenderer;

const render = async (element: React.ReactElement) => {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(element);
  });
  return renderer;
};

const screenText = (renderer: Renderer) => JSON.stringify(renderer.toJSON());

describe('GetReadyOverlay', () => {
  it('menampilkan judul, angka hitung mundur, dan petunjuk cara main', async () => {
    const renderer = await render(<GetReadyOverlay count={3} />);
    const text = screenText(renderer);
    expect(text).toContain('Get Ready!');
    expect(text).toContain('"3"');
    expect(text).toContain('How to play');
    expect(text).toContain(`in ${GAME_DURATION_SECONDS} seconds`);
  });

  it('memakai durasi yang dikirim pada teks petunjuk', async () => {
    const renderer = await render(
      <GetReadyOverlay count={1} durationSeconds={45} />,
    );
    expect(screenText(renderer)).toContain('in 45 seconds');
  });

  it('menampilkan status badan terdeteksi secara bawaan', async () => {
    const renderer = await render(<GetReadyOverlay count={2} />);
    const text = screenText(renderer);
    expect(text).toContain('Full body detected');
    expect(text).not.toContain('Step back');
  });

  it('meminta mundur bila badan belum terlihat penuh', async () => {
    const renderer = await render(
      <GetReadyOverlay count={2} bodyDetected={false} />,
    );
    const text = screenText(renderer);
    expect(text).toContain('Step back');
    expect(text).not.toContain('Full body detected');
  });
});

describe('GameHud', () => {
  it('menampilkan jumlah pose dan sisa waktu', async () => {
    const renderer = await render(<GameHud {...MOCK_HUD} onPause={jest.fn()} />);
    const text = screenText(renderer);
    expect(text).toContain('POSE COUNT');
    expect(text).toContain('1:02'); // 62 detik
    expect(text).toContain('TIME LEFT');
  });

  it('tombol jeda memanggil onPause', async () => {
    const onPause = jest.fn();
    const renderer = await render(<GameHud {...MOCK_HUD} onPause={onPause} />);
    const button = renderer.root.findAll(
      node =>
        node.props.accessibilityLabel === 'Pause' &&
        typeof node.props.onPress === 'function',
    )[0];
    await act(async () => {
      button.props.onPress();
    });
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it('format waktu mengikuti detik tersisa (menit:detik)', async () => {
    const renderer = await render(
      <GameHud poseCount={0} secondsLeft={8} onPause={jest.fn()} />,
    );
    expect(screenText(renderer)).toContain('0:08');
  });
});
