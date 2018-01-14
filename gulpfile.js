/*
 * Copyright 2016 Valassis Interactive, Inc.
 * All Rights Reserved.
 * NOTICE: All information contained herein is, and remains the property of
 * Valassis Interactive, Inc. The intellectual and technical concepts
 * contained herein are proprietary to Valassis Interactive, Inc. and
 * may be covered by U.S. and Foreign Patents, pending patents, and may be
 * protected by trade secret law. Dissemination of this information or
 * reproduction of this material is strictly forbidden unless prior written
 * permission is obtained from Valassis Interactive, Inc.
 *
 */

const fs = require('fs');
const gulp = require('gulp');
const packageJSON = require('./package');
const jshintConfig = packageJSON.jshintConfig;
const apidoc = require('gulp-apidoc');

const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const coveralls = require('gulp-coveralls');
const exit = require('gulp-exit');

const mochaDefaults = {
    reporter: process.env.GULP_REPORTER ? process.env.GULP_REPORTER : 'spec',
    reporterOptions: {
        mochaFile: process.env.GULP_REPORTER_OUTPUT_DIR ? process.env.GULP_REPORTER_OUTPUT_DIR : './testResults/testResults.xml'
    },
    timeout: 8000
};

const serverCodePath = getFiles(process.env.SERVER_CODE_PATH ? process.env.SERVER_CODE_PATH : './src');
const unitPath = getFiles(process.env.UNIT_TEST_CODE_PATH ? process.env.UNIT_TEST_CODE_PATH : './tests/unit');
const integrationPath = getFiles(process.env.INTEGRATION_TEST_CODE_PATH ? process.env.INTEGRATION_TEST_CODE_PATH : './tests/integration');

// Default task
gulp.task('default', ['unitcoverage']);

// Lint task
gulp.task('lint', function () {
    return gulp.src(serverCodePath)
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
        .pipe(exit());
});

// Unit tests task
gulp.task('unit', function () {
    return gulp.src(unitPath)
        .pipe(mocha(mochaDefaults))
});

// Integration tests task
gulp.task('integration', function () {
    return gulp.src(integrationPath)
        .pipe(mocha(mochaDefaults))
        .pipe(exit());
});


// Tests task
gulp.task('tests', function () {
    return gulp.src(unitPath.concat(integrationPath))
        .pipe(mocha(mochaDefaults))
        .pipe(exit());
});

// Combination of Unit + integration Coverage task
gulp.task('coverage', function () {
    return gulp.src(serverCodePath)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(unitPath.concat(integrationPath))
                .pipe(mocha(mochaDefaults))
                .pipe(istanbul.writeReports())
                .pipe(istanbul.enforceThresholds({thresholds: {global: 90}}))
                .once('error', function () {
                    console.log('\n\nCoverage below ' + 90 + '% for at least one area\n');
                    process.exit(1);
                });
        });
});

// Unit Test Coverage task
gulp.task('unit-coverage', function () {
    return gulp.src(serverCodePath)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function () {
            gulp.src(unitPath)
                .pipe(mocha(mochaDefaults))
                .pipe(istanbul.writeReports())
                .pipe(istanbul.enforceThresholds({thresholds: {global: 70}}))
                .once('error', function () {
                    console.log('\n\nCoverage below ' + 70 + '% for at least one area\n');
                    process.exit(1);
                });
        });
});

gulp.task('coveralls', function () {
    return gulp.src('./coverage/lcov.info')
        .pipe(coveralls())
        .pipe(exit());
});

gulp.task('apidoc', function (done) {
    return apidoc({
        src: "./src",
        dest: "./docs/api",
        debug: false,
        includeFilters: [ '.*\\.js$' ]
    }, done);
});

function getFiles(dir, files_) {
    files_ = files_ || [];
    try {
        const files = fs.readdirSync(dir);
        for (let i in files) {
            const name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()) {
                getFiles(name, files_);
            } else {
                if (name.indexOf('.js') > -1 && name.indexOf('.json') <= -1) {
                    files_.push(name);
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
    return files_;
}