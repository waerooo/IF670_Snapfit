module.exports = {
  preset: '@react-native/jest-preset',
  // Library navigasi ditulis dalam format ES module, jadi harus ikut
  // diterjemahkan oleh Babel agar bisa dibaca Jest.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-screens|react-native-safe-area-context)/)',
  ],
};
