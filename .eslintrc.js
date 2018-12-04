// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html', 'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 缩写格式的一致性统一两个字符
    'indent': [ 'off', 2 ],
    // 总是加分号
    "semi": ['error', "always"],
    // 操作符前后需要加空格
    'space-infix-ops': 'error',
    // 在定义对象或数组时，最后一项不能加逗号
    'comma-dangle': ['error', 'never'],
    // 注释前需要一个空格，符号｀／*｀ ｀／／｀，后面需要留一个空格
    'spaced-comment': ['error', 'always', { "markers": ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ','] }],
    // 如果逗号可以放在行首或行尾时，那么请放在行尾
    'comma-style': ['error', 'last'],
    // 不允许函数之间存在空格
    'space-before-function-paren': ['error', 'never'],
    // 其他先不检查
    'no-template-curly-in-string': 'off',
    // 忽略必须使用全等
    'eqeqeq': 'off',
    // 忽略空格滥用
    'no-tabs': 'off',
    // 忽略空格与Tab滥用
    'no-mixed-spaces-and-tabs': 'off',
    // 忽略关键字
    "no-dupe-keys": 'off',
    // 忽略没有定义的文本
    "no-undef": 'off'
  }
}
