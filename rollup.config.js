/* eslint-env node */

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import serve from 'rollup-plugin-serve';
import pkg from './package.json';

const plugins = [
  resolve(),
  commonjs(),
  buble({ exclude: ['node_modules/**'] })
];

if (process.env.ROLLUP_WATCH) {
  plugins.push(serve({ contentBase: '', open: true, openPage: '/test/' }));
}

export default [
  {
    input: 'src/main.js',
    output: [
      {
        name: 'PhaserPauseRenderPlugin',
        file: pkg.browser,
        format: 'umd',
        globals: { phaser: 'Phaser' }
      },
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    external: ['phaser'],
    plugins
  }
];
