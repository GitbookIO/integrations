module.exports = {
    extends: ['plugin:import/typescript', 'prettier'],
    plugins: ['@typescript-eslint', 'import', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        'import/extensions': ['.js', '.ts', '.jsx', '.tsx'],
    },
    env: {
        es6: true,
        node: true,
    },
    rules: {
        curly: ['error', 'all'],
        //
        // Imports
        //
        'import/export': 'error',
        'import/first': 'error',
        // FIXME: This causes juge performance hits in some instances and will require a big refactor. Do in a followup
        // PR to the eslint fixes
        'import/no-cycle': 'off',
        'import/newline-after-import': 'error',
        'import/no-deprecated': 'error',
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: true,
                optionalDependencies: true,
                peerDependencies: true,
            },
        ],
        'import/no-internal-modules': [
            'error',
            {
                allow: [],
            },
        ],
        'import/order': [
            'error',
            {
                groups: [
                    ['builtin', 'external'],
                    ['sibling', 'parent', 'internal', 'index'],
                ],
                pathGroups: [
                    {
                        pattern: '@gitbook/**',
                        group: 'external',
                        position: 'after',
                    },
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'import/no-mutable-exports': 'error',
        'import/no-named-as-default': 'error',
        'import/no-named-as-default-member': 'error',
        'import/no-unresolved': ['error', { ignore: ['\\\.raw\.js'] }],
        //
        // Code
        //
        'constructor-super': 'error',
        'dot-notation': [
            'error',
            {
                allowKeywords: true,
            },
        ],
        eqeqeq: ['error', 'smart'],
        'linebreak-style': 'error',
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': ['error'],
        'no-class-assign': 'error',
        'no-console': [
            'error',
            {
                allow: ['warn', 'error'],
            },
        ],
        'no-const-assign': 'error',
        'no-debugger': 'error',
        'no-dupe-args': 'error',
        'no-dupe-class-members': 'off',
        '@typescript-eslint/no-dupe-class-members': ['error'],
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-empty': 'error',
        'no-empty-character-class': 'error',
        'no-empty-pattern': 'error',
        'no-ex-assign': 'error',
        'no-extend-native': 'error',
        'no-extra-boolean-cast': 'error',
        'no-func-assign': 'error',
        'no-invalid-regexp': 'error',
        'no-native-reassign': 'error',
        'no-negated-in-lhs': 'error',
        'no-new-object': 'error',
        'no-new-symbol': 'error',
        'no-path-concat': 'error',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error'],
        'no-regex-spaces': 'error',
        'no-sequences': 'error',
        'no-tabs': 'error',
        'no-this-before-super': 'error',
        'no-throw-literal': 'error',
        'no-unneeded-ternary': 'error',
        'no-unreachable': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'no-useless-call': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-undef': 'error',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                args: 'none',
                ignoreRestSiblings: true,
                caughtErrors: 'none',
            },
        ],
        'no-var': 'error',
        'no-void': 'error',
        'no-with': 'error',
        'object-shorthand': ['error', 'always'],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
        'prefer-const': [
            'error',
            {
                destructuring: 'all',
                ignoreReadBeforeAssign: true,
            },
        ],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'prettier/prettier': [
            'error',
            {
                printWidth: 100,
                singleQuote: true,
                tabWidth: 4,
            },
        ],
        radix: 'error',
        'spaced-comment': [
            'error',
            'always',
            {
                exceptions: ['-'],
            },
        ],
        'use-isnan': 'error',
        'valid-typeof': 'error',
        'yield-star-spacing': ['error', 'after'],
        yoda: ['error', 'never'],
    },
    globals: {
        NodeJS: true,
    },
};
