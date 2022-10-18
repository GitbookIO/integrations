module.exports = {
    extends: ['./'],
    env: {
        browser: true,
        serviceworker: true,
    },
    globals: {
        environment: 'readonly',
    },
};
