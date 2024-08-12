// for best fitting to your setting please see doc via https://github.com/antfu/eslint-config
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'curly': ['off'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'unused-imports/no-unused-vars': 'warn',
    'unused-imports/no-unused-imports': 'warn',
  },
})
