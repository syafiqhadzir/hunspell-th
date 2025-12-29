import globals from 'globals';
import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module', // Allows usage of import/export (though we use CJS mainly, this handles mixed)
            globals: {
                ...globals.node,
                ...globals.mocha,
                ...globals.browser // For docs/ demo
            }
        },
        rules: {
            'indent': ['error', 4],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'no-unused-vars': 'warn',
            'no-console': 'off' // Allowed for this CLI tool
        }
    }
];
