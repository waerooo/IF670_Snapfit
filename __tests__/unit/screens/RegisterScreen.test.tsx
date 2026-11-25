import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import RegisterScreen from '../../../src/screens/RegisterScreen';
import { createUserWithEmailAndPassword } from '../../../src/services/firebase/authService';

jest.mock('../../../src/services/firebase/authService', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

const createAccount = jest.mocked(createUserWithEmailAndPassword);

describe('RegisterScreen', () => {
  beforeEach(() => {
    createAccount.mockReset();
  });

  it('rejects mismatched passwords without calling Firebase', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<RegisterScreen onPressLogin={jest.fn()} />);
    });

    await act(async () => {
      renderer.root.findByProps({ testID: 'register-email' }).props.onChangeText('user@example.com');
      renderer.root.findByProps({ testID: 'register-password' }).props.onChangeText('secret123');
      renderer.root
        .findByProps({ testID: 'register-confirm-password' })
        .props.onChangeText('different123');
    });
    await act(async () => {
      await renderer.root.findByProps({ testID: 'register-submit' }).props.onPress();
    });

    expect(createAccount).not.toHaveBeenCalled();
    expect(
      renderer.root.findByProps({ children: 'Konfirmasi kata sandi tidak cocok.' }),
    ).toBeTruthy();
  });

  it('creates an account with the trimmed email and confirmed password', async () => {
    createAccount.mockResolvedValue({} as never);
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(<RegisterScreen onPressLogin={jest.fn()} />);
    });

    await act(async () => {
      renderer.root.findByProps({ testID: 'register-email' }).props.onChangeText(' user@example.com ');
      renderer.root.findByProps({ testID: 'register-password' }).props.onChangeText('secret123');
      renderer.root
        .findByProps({ testID: 'register-confirm-password' })
        .props.onChangeText('secret123');
    });
    await act(async () => {
      await renderer.root.findByProps({ testID: 'register-submit' }).props.onPress();
    });

    expect(createAccount).toHaveBeenCalledWith('user@example.com', 'secret123');
  });
});
