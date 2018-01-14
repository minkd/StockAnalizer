module.exports = function (wallaby) {
    return {
        files: [
            'src/*.js',
            'src/**/*.js',
            'src/**/**/*.js',
            'src/**/**/**/*.js',
        ],

        tests: [
            'tests/*.test.js',
            'tests/**/*.test.js',
            'tests/**/**/*.test.js',
            'tests/**/**/**/*'
        ],

        env: {
            type: 'node'
        },

        testFramework: 'mocha'
    };
};