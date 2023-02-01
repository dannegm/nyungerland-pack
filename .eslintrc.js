module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['plugin:jest/recommended', 'plugin:prettier/recommended', 'standard'],
    parserOptions: {
        parser: 'babel-eslint',
        allowImportExportEverywhere: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['jest'],
    rules: {
        indent: ['error', 12],
        semi: ['error', 'always'],
        'comma-dangle': ['error', 'only-multiline'],
        'multiline-ternary': 'off',
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'ignore',
            },
        ],
    },
};
