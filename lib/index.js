/**
 * Module dependencies.
 */

var mocha = require('mocha');
var Base = mocha.reporters.Base
  , cursor = Base.cursor
  , color = Base.color;
var JSONCov = mocha.reporters.JSONCov;

/**
 * Expose `SpecCov`.
 */

exports = module.exports = SpecCov;

/**
 * Initialize a new `SpecCov` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function SpecCov(runner) {
  // Run Tests
  JSONCov.call(this, runner, false);


  var self = this
    , stats = this.stats
    , indents = 0
    , n = 0;

  function indent() {
    return Array(indents).join('  ')
  }

  runner.on('start', function(){
    console.log();
  });

  runner.on('suite', function(suite){
    ++indents;
    console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function(suite){
    --indents;
    if (1 == indents) console.log();
  });

  runner.on('test', function(test){
    process.stdout.write(indent() + color('pass', '  ◦ ' + test.title + ': '));
  });

  runner.on('pending', function(test){
    var fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', function(test){
    if ('fast' == test.speed) {
      var fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s ');
      cursor.CR();
      console.log(fmt, test.title);
    } else {
      var fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s ')
        + color(test.speed, '(%dms)');
      cursor.CR();
      console.log(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', function(test, err){
    cursor.CR();
    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });


  runner.on('end', self.epilogue.bind(self));
  runner.on('end', function(){
    var coverage = Math.round(self.cov.coverage * 100) / 100
    var sloc = self.cov.sloc
    console.log(color(coverageColor(coverage), '  %d% %s, %s %s'), coverage, 'coverage', sloc, "SLOC" )
    var lowCov = self.cov.files.filter(function(file){return file.coverage < 50})
    lowCov.sort(function(a,b){
      if (a.coverage > b.coverage)
        return 1;
      if (a.coverage < b.coverage)
        return -1;
      return 0
    });
    if (lowCov && lowCov.length !== 0) {
      console.log(color(coverageColor(), '   %s'), "Files with below 50% coverage:");
      lowCov.forEach(function(file){
        console.log(color('pending', '    %s %d%'), file.filename, Math.round(file.coverage))
      });
    }

  });

}

/**
 * Inherit from `Base.prototype`.
 */

SpecCov.prototype.__proto__ = Base.prototype;


function coverageColor(n) {
  if (n >= 75) return 'bright pass';
  if (n >= 50) return 'bright yellow';
  if (n >= 25) return 'fail';
  return 'bright fail';
}
