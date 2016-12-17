'use strict';
const ClientKitTask = require('clientkit-task');
const markdown = require('markdown-it');
const hljs = require('highlight');
const async = require('async');
const fs = require('fs');

class MarkdownTask extends ClientKitTask {

  constructor(server, options, runner) {
    super(server, options, runner);
    this.markdown = new Markdown({
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value} </code></pre>`;
          } catch (__) {}
        }
        return '';
        // return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
      }
    });
  }

  compile(input, output, allDone) {
    if (Array.isArray(input.input)) {
      return allDone(new Error('Compile can only compile individual files, not lists of files'));
    }
    const data = input.data ? input.data : {};
    async.autoInject({
      buffer: (done) => fs.readFile(input.input, done),
      render: (buffer, done) => done(null, markdown.render(buffer.toString('utf-8')).render(data)),
      write: (compile, done) => this.write(output, compile, done)
    }, (err, results) => {
      if (err) {
        return allDone(err);
      }
      return allDone(null, results.compile);
    });
  }

  process(input, output, done) {
    // if it's a suitable compile specifier:
    if (typeof input === 'object' && input.type && input.input) {
      return this.compile(input, output, done);
    }
    // otherwise assume it's a filepath or list of filepaths:
    return this.precompile(input, output, done);
  }
}

module.exports = MarkdownTask;
