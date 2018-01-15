module.exports = function (wallaby) {
    return {
        files: [
            'src/*.js*',
            'src/**/*.js*',
            'src/**/**/*.js*',
            'src/**/**/**/*.js*',
        ],

        tests: [
            'tests/unit/*.test.js',
            'tests/unit/**/*.test.js',
            'tests/unit/**/**/*.test.js',
            'tests/unit/**/**/**/*'
        ],

        env: {
            type: 'node'
        },

        testFramework: 'mocha'
    };
};