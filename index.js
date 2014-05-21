var compiler = require('ember-template-compiler');
var through = require('through2');
var gutil = require('gulp-util');
var PliginError = gutil.PliginError;

const PLUGIN_NAME = 'gulp-ember-templates';
const TEMPLATE_SUFFIX = '); });';

function compile(templatePrefix) {
  templatePrefix = templatePrefix || '';

  var stream = through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb();
    }

    var compilerOutput;

    try {
      compilerOutput = compiler.precompile(file.contents.toString());
    } catch(e) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, e));
      return cb();
    }

    if (compilerOutput) {
      if (file.isBuffer()) {
        file.contents = new Buffer('define("' + templatePrefix + '/' + file.relative.replace('.hbs', '') + '", ["exports"], function (__exports__) { __exports__["default"] = Ember.Handlebars.template(' + compilerOutput.toString() + TEMPLATE_SUFFIX);
      }

      this.push(file);
    }
    return cb();
  });

  return stream;
}

module.exports = compile;
