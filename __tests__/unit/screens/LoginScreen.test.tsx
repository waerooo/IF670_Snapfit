import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import LoginScreen from '../../../src/screens/LoginScreen';
import { signInWithEmailAndPassword } from '../../../src/services/firebase/authService';

jest.mock('../../../src/services/firebase/authService', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

const signIn = jest.mocked(signInWithEmailAndPassword);

describe('LoginScreen', () => {
  beforeEach(() => {
    signIn.mockReset();
  });

  it('requires both email and password', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<LoginScreen onPressRegister={jest.fn()} />);
    });

    await act(async () => {
      await renderer.root.findByProps({ testID: 'login-submit' }).props.onPress();
    });

    expect(signIn).not.toHaveBeenCalled();
    expect(renderer.root.findByProps({ children: 'Masukkan email dan kata sandi.' })).toBeTruthy();
  });

  it('signs in with a trimmed email and the entered password', async () => {
    signIn.mockResolvedValue({} as never);
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<LoginScreen onPressRegister={jest.fn()} />);
    });

    await act(async () => {
      renderer.root.findByProps({ testID: 'login-email' }).props.onChangeText(' user@example.com ');
      renderer.root.findByProps({ testID: 'login-password' }).props.onChangeText('secret123');
    });
    await act(async () => {
      await renderer.root.findByProps({ testID: 'login-submit' }).props.onPress();
    });

    expect(signIn).toHaveBeenCalledWith('user@example.com', 'secret123');
  });

  it('shows a useful message when credentials are rejected', async () => {
    signIn.mockRejectedValue({ code: 'auth/invalid-credential' });
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<LoginScreen onPressRegister={jest.fn()} />);
    });

    await act(async () => {
      renderer.root.findByProps({ testID: 'login-email' }).props.onChangeText('user@example.com');
      renderer.root.findByProps({ testID: 'login-password' }).props.onChangeText('wrong-password');
    });
    await act(async () => {
      await renderer.root.findByProps({ testID: 'login-submit' }).props.onPress();
    });

    expect(renderer.root.findByProps({ children: 'Email atau kata sandi salah.' })).toBeTruthy();
  });
});
