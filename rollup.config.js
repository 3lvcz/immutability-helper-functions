import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

export default [
  // CommonJS
  {
    input: "src/functions.js",
    output: { file: "lib/ihf.js", format: "cjs", indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [babel()]
  },

  // ES
  {
    input: "src/functions.js",
    output: { file: "es/ihf.js", format: "es", indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [babel()]
  },

  // ES for Browsers
  {
    input: "src/functions.js",
    output: { file: "es/ihf.mjs", format: "es", indent: false },
    plugins: [
      nodeResolve({
        jsnext: true,
        main: true
      }),
      commonjs({
        include: "node_modules/**",
        sourceMap: false
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  },

  // UMD Development
  {
    input: "src/functions.js",
    output: {
      file: "dist/ihf.js",
      format: "umd",
      name: "ImmutableHelperFunctions",
      indent: false
    },
    plugins: [
      nodeResolve({
        jsnext: true,
        main: true
      }),
      commonjs({
        include: "node_modules/**",
        sourceMap: true
      }),
      babel({
        exclude: "node_modules/**"
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development")
      })
    ]
  },

  // UMD Production
  {
    input: "src/functions.js",
    output: {
      file: "dist/ihf.min.js",
      format: "umd",
      name: "ImmutableHelperFunctions",
      indent: false
    },
    plugins: [
      nodeResolve({
        jsnext: true,
        main: true
      }),
      commonjs({
        include: "node_modules/**",
        sourceMap: false
      }),
      babel({
        exclude: "node_modules/**"
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
];
