import React from 'react';
import {Text} from 'react-native';
import ReactTestRenderer, {act} from 'react-test-renderer';
import PauseDialog from '../../../src/components/game/PauseDialog';
import ResultCard from '../../../src/components/game/ResultCard';
import {MOCK_PAUSE, MOCK_RESULT} from '../../../src/constants/mockData';

type Renderer = ReactTestRenderer.ReactTestRenderer;

const render = async (element: React.ReactElement) => {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(element);
  });
  return renderer;
};

const screenText = (renderer: Renderer) => JSON.stringify(renderer.toJSON());

/** Teks gabungan di dalam sebuah node (untuk mencocokkan judul tombol). */
const labelOf = (node: ReactTestRenderer.ReactTestInstance) =>
  node
    .findAllByType(Text)
    .map(text => ([] as unknown[]).concat(text.props.children).join(''))
    .join('');

const pressButton = async (renderer: Renderer, title: string) => {
  const button = renderer.root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      labelOf(node).includes(title),
  )[0];
  await act(async () => {
    button.props.onPress();
  });
};

describe('PauseDialog', () => {
  const handlers = () => ({
    onResume: jest.fn(),
    onRestart: jest.fn(),
    onQuit: jest.fn(),
  });

  it('menampilkan jumlah pose dan sisa waktu', async () => {
    const renderer = await render(
      <PauseDialog visible {...MOCK_PAUSE} {...handlers()} />,
    );
    const text = screenText(renderer);
    expect(text).toContain('Paused');
    expect(text).toContain('Pose Count');
    expect(text).toContain('1:52'); // 112 detik
  });

  it('tidak menampilkan apa pun saat visible=false', async () => {
    const renderer = await render(
      <PauseDialog visible={false} {...MOCK_PAUSE} {...handlers()} />,
    );
    expect(screenText(renderer)).not.toContain('Paused');
  });

  it('memanggil handler yang sesuai untuk tiap tombol', async () => {
    const h = handlers();
    const renderer = await render(
      <PauseDialog visible {...MOCK_PAUSE} {...h} />,
    );
    await pressButton(renderer, 'Resume');
    await pressButton(renderer, 'Restart');
    await pressButton(renderer, 'Quit to Home');
    expect(h.onResume).toHaveBeenCalledTimes(1);
    expect(h.onRestart).toHaveBeenCalledTimes(1);
    expect(h.onQuit).toHaveBeenCalledTimes(1);
  });
});

describe('ResultCard', () => {
  const actions = () => ({onPlayAgain: jest.fn(), onContinue: jest.fn()});

  it('menampilkan ringkasan hasil dan kenaikan streak', async () => {
    const renderer = await render(
      <ResultCard {...MOCK_RESULT} {...actions()} />,
    );
    const text = screenText(renderer);
    expect(text).toContain("Time's Up!");
    expect(text).toContain('12.67'); // pose per menit, 2 desimal
    expect(text).toContain('+1'); // 11 -> 12
    expect(text).toContain('Adept Athlete');
    expect(text).toContain('NEW');
    expect(text).toContain('Progress saved');
  });

  it('menyembunyikan achievement dan chip kenaikan bila tidak ada', async () => {
    const renderer = await render(
      <ResultCard
        {...MOCK_RESULT}
        newAchievement={undefined}
        streakTo={MOCK_RESULT.streakFrom}
        {...actions()}
      />,
    );
    const text = screenText(renderer);
    expect(text).not.toContain('Achievement Gained');
    expect(text).not.toContain('+0');
    expect(text).not.toContain('NEW');
  });

  it('Play Again dan Continue memanggil handler masing-masing', async () => {
    const a = actions();
    const renderer = await render(<ResultCard {...MOCK_RESULT} {...a} />);
    await pressButton(renderer, 'Play Again');
    await pressButton(renderer, 'Continue');
    expect(a.onPlayAgain).toHaveBeenCalledTimes(1);
    expect(a.onContinue).toHaveBeenCalledTimes(1);
  });
});
