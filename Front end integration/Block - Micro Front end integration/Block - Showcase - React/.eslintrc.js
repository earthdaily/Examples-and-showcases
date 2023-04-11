module.exports = {
    extends: [
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors.
        'plugin:prettier/recommended',
        'plugin:react-hooks/recommended', // This ESLint plugin enforces the Rules of Hooks. https://reactjs.org/docs/hooks-rules.html
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    plugins: ['@typescript-eslint'],
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    // Fine tune rules
    rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
        'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
        //'@typescript-eslint/max-len': ['error', { code: 150 }],
    },
};
