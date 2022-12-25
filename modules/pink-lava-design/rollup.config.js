import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import svg from 'rollup-plugin-svg-import';
import css from "rollup-plugin-import-css";
import commonjs from '@rollup/plugin-commonjs';
import url from 'rollup-plugin-url'
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import svgr from '@svgr/rollup';
import nodePolyfills from '@shumih/rollup-plugin-polyfill-node';
import { terser } from "rollup-plugin-terser";

export default [
    {
      input: './src/components/index.js',
      output: [
          {
            file: './dist/index.js',
            format: 'cjs'
          },
          {
            file: './dist/index.es.js',
            format: 'es',
            exports: 'named'
          }
      ],
      plugins: [
        resolve({
          preferBuiltins: false,
          browser: true,
        }),
        commonjs({
            ignoreGlobal: true,
            include: /\/node_modules\//,
            namedExports: {
            react: Object.keys(require('react')),
            },
        }),
        nodePolyfills(),
        external(),
        css(),
        babel({
          exclude: 'node_modules/**',
          presets: ['@babel/preset-react']
        }),
        svg({
          stringify: false
        }),  
        url({
          // by default, rollup-plugin-url will not handle font files
          include: ['**/*.ttf'],
          // setting infinite limit will ensure that the files 
          // are always bundled with the code, not copied to /dist
          limit: Infinity,
        }),
        image(),
        json(),
        svgr(),
        terser(),
      ],
      onwarn: function(warning) {
    
        if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
    
        console.warn( warning.message );
      }
    }
]