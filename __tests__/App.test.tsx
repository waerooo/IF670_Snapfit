/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../src/screens/GameScreen', () => () => null);

jest.mock('../src/services/firebase/authService', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  observeAuthState: (onUserChanged: (user: null) => void) => {
    onUserChanged(null);
    return () => {};
  },
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('../src/services/firebase/databaseService', () => ({
  fetchUserStats: jest.fn(),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
