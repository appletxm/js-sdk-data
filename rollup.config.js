import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'

const isProduction = process.env.NODE_ENV === 'production'

const plugins = [
  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true
  }),
  commonjs(),
  resolve(),
  isProduction && uglify()
]


export default {
  input: 'src/hf-js-sdk.js',
  output: {
    file: `build/hf-js-sdk${isProduction ? '.min' : ''}.js`,
    format: 'umd',
    name: 'HFAgent',
    sourceMap: 'inline'
  },
  plugins: plugins
}
