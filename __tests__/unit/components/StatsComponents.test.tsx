import React from 'react';
import {StyleSheet} from 'react-native';
import ReactTestRenderer, {act} from 'react-test-renderer';
import BarChart from '../../../src/components/common/BarChart';
import ProfileButton, {
  getInitials,
} from '../../../src/components/common/ProfileButton';
import StatCard from '../../../src/components/common/StatCard';

type Renderer = ReactTestRenderer.ReactTestRenderer;

const render = async (element: React.ReactElement) => {
  let renderer!: Renderer;
  await act(async () => {
    renderer = ReactTestRenderer.create(element);
  });
  return renderer;
};

const screenText = (renderer: Renderer) => JSON.stringify(renderer.toJSON());

const barHeight = (renderer: Renderer, index: number) =>
  StyleSheet.flatten(renderer.root.findByProps({testID: `bar-${index}`}).props.style)
    .height;

describe('BarChart', () => {
  it('menampilkan label dan nilai tiap batang', async () => {
    const renderer = await render(
      <BarChart
        data={[
          {label: '20/11', value: 40},
          {label: '21/11', value: 80},
        ]}
      />,
    );
    const text = screenText(renderer);
    expect(text).toContain('20/11');
    expect(text).toContain('"80"');
  });

  it('tinggi batang sebanding dengan nilainya terhadap nilai terbesar', async () => {
    const renderer = await render(
      <BarChart
        height={100}
        data={[
          {label: 'a', value: 50},
          {label: 'b', value: 100},
        ]}
      />,
    );
    expect(barHeight(renderer, 0)).toBe(50);
    expect(barHeight(renderer, 1)).toBe(100);
  });

  it('memakai maxValue sebagai batas atas bila diberikan', async () => {
    const renderer = await render(
      <BarChart height={100} maxValue={100} data={[{label: 'a', value: 25}]} />,
    );
    expect(barHeight(renderer, 0)).toBe(25);
  });

  it('nilai nol tetap tampil sebagai garis tipis, bukan hilang', async () => {
    const renderer = await render(
      <BarChart
        height={100}
        data={[
          {label: 'a', value: 0},
          {label: 'b', value: 10},
        ]}
      />,
    );
    expect(barHeight(renderer, 0)).toBe(2);
  });

  it('semua nilai nol tidak menyebabkan pembagian dengan nol', async () => {
    const renderer = await render(
      <BarChart data={[{label: 'a', value: 0}]} />,
    );
    expect(barHeight(renderer, 0)).toBe(2);
  });

  it('menambahkan akhiran pada nilai (misalnya persen)', async () => {
    const renderer = await render(
      <BarChart valueSuffix="%" data={[{label: 'a', value: 85}]} />,
    );
    expect(screenText(renderer)).toContain('"85%"');
  });

  it('menampilkan teks pengganti bila data kosong', async () => {
    const renderer = await render(
      <BarChart data={[]} emptyText="Belum ada sesi." />,
    );
    expect(screenText(renderer)).toContain('Belum ada sesi.');
  });
});

describe('StatCard', () => {
  it('menampilkan label dan nilai', async () => {
    const renderer = await render(<StatCard label="Skor terbaik" value={60} />);
    const text = screenText(renderer);
    expect(text).toContain('Skor terbaik');
    expect(text).toContain('"60"');
  });
});

describe('getInitials', () => {
  it('mengambil dua huruf dari satu kata', () => {
    expect(getInitials('player@example.com')).toBe('PL');
  });

  it('mengambil huruf pertama dari dua kata atau dua bagian email', () => {
    expect(getInitials('Gilber Johan')).toBe('GJ');
    expect(getInitials('oki.rahmat@mail.com')).toBe('OR');
  });

  it('memberi tanda tanya bila kosong', () => {
    expect(getInitials('')).toBe('?');
    expect(getInitials('@mail.com')).toBe('?');
  });
});

describe('ProfileButton', () => {
  it('menampilkan inisial dan memanggil onPress', async () => {
    const onPress = jest.fn();
    const renderer = await render(
      <ProfileButton name="Gilber Johan" onPress={onPress} />,
    );
    expect(screenText(renderer)).toContain('GJ');

    const button = renderer.root.findAll(
      node =>
        node.props.accessibilityLabel === 'Profil' &&
        typeof node.props.onPress === 'function',
    )[0];
    await act(async () => {
      button.props.onPress();
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
