export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' },
      },
    ],
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { node: 'current' },
          },
        ],
      ],
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
};
