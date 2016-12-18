'use strict';
const ClientKitTask = require('clientkit-task');
const toc = require('markdown-it-toc-and-anchor');
const include = require('markdown-it-include');
const Markdown = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value} </code></pre>`;
      } catch (__) {}
    }
    return '';
  }
}).use(include, {})
// .use(toc, {});
const hljs = require('highlightjs');
const async = require('async');
const fs = require('fs');
const os = require('os');

class MarkdownTask extends ClientKitTask {

  constructor(server, options, runner) {
    super(server, options, runner);
    this.markdown = Markdown;
  }

  compile(input, output, allDone) {
    if (Array.isArray(input.input)) {
      return allDone(new Error('Compile can only compile individual files, not lists of files'));
    }
    const data = input.data ? input.data : {};
    async.autoInject({
      buffer: (done) => fs.readFile(input.input, done),
      render: (buffer, done) => done(null, this.markdown.render(buffer.toString('utf-8'), data)),
      write: (compile, done) => this.write(output, compile, done)
    }, (err, results) => {
      if (err) {
        return allDone(err);
      }
      return allDone(null, results.compile);
    });
  }

  precompile(input, output, done) {
    if (!Array.isArray(input)) {
      input = [input];
    }
    async.map(input, (file, next) => {
      async.autoInject({
        buffer: (bufferDone) => fs.readFile(file, bufferDone),
        render: (buffer, renderDone) => renderDone(null, this.markdown.render(buffer.toString('utf-8'))),
      }, (err, results) => {
        if (err) {
          return next(err);
        }
        return next(null, results.render);
      });
    }, (err, allResults) => {
      if (err) {
        return done(err);
      }
      this.write(output, allResults.join(os.EOL), done);
    });
  }

  process(input, output, done) {
    // a filepath or list of file paths:
    return this.precompile(input, output, done);
  }
}

module.exports = MarkdownTask;
