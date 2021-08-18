import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import postcss from 'rollup-plugin-postcss';

var config = {
    input: 'app/index.js',
    plugins: [
      postcss({
        modules: true,
        extensions: [ '.css' ]
      })
    ],
    output: [
      {
        file: 'public/bundle.js',
        format: 'iife',
        name: process.env.APP_NAME,
        plugins: [
          getBabelOutputPlugin({
            presets: ['@babel/preset-env'],
            allowAllFormats: true
          })
        ]
      },
      {
        file: 'public/bundle.min.js',
        format: 'iife',
        name: process.env.APP_NAME,
        plugins: [
          getBabelOutputPlugin({
            presets: ['@babel/preset-env'],
            allowAllFormats: true
          }),
          terser()
        ]
      }
    ]
  };

  export default [
    config
  ];