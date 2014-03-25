Custom mocha https://github.com/visionmedia/mocha reporter

The mocha-spec-cov reporter is the same as spec however when run against a library instrumented by node-jscoverage (or coffee-coverage) it will produce coverage output. Total coverage and source files that have < 50% coverage at the end of the report (see screenshot).


npm install mocha-spec-cov

mocha -R mocha-spec-cov


![Screen Shot](https://raw.github.com/startswithaj/mocha-spec-cov/gh-pages/screenshot.png)
