module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@screens': './src/screens',
            '@components': './src/components',
            '@services': './src/services',
            '@navigation': './src/navigation',
            '@contexts': './src/contexts',
            '@i18n': './src/i18n',
            '@types': './src/types'
          }
        }
      ]
    ]
  };
};
