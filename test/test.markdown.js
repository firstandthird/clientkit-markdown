'use strict';
const test = require('tape');
const MarkdownTask = require('../');
const RunKitTask = require('runkit-task');
const fs = require('fs');
const os = require('os');

test('instance of', (t) => {
  t.plan(1);
  const nt = new MarkdownTask();
  t.equal(nt instanceof RunKitTask, true, 'instance of RunKitTask');
});

test('converts and saves', (t) => {
  t.plan(3);
  const file = `out1-${new Date().getTime()}.html`;
  const outpath = `${os.tmpdir()}/${file}`;
  const files = {};
  files[file] = 'test/fixtures/in.md';
  const task = new MarkdownTask('markdown', {
    dist: os.tmpdir(),
    files
  }, {});
  task.execute((err) => {
    t.equal(err, null, 'not erroring');
    t.equal(fs.existsSync(outpath), true, 'file exists');
    t.equal(fs.readFileSync(outpath, 'utf8'), fs.readFileSync('test/expected/out.html', 'utf8'), 'generates expected html');
  });
});

test('converts array of files and saves', (t) => {
  t.plan(3);
  const file = `out2-${new Date().getTime()}.html`;
  const outpath = `${os.tmpdir()}/${file}`;
  const files = {};
  files[file] = ['test/fixtures/in.md', 'test/fixtures/in2.md'];
  const task = new MarkdownTask('markdown', {
    dist: os.tmpdir(),
    files
  }, {});
  task.execute((err) => {
    t.equal(err, null, 'not erroring');
    t.equal(fs.existsSync(outpath), true, 'file exists');
    t.equal(fs.readFileSync(outpath, 'utf8'), fs.readFileSync('test/expected/out2.html', 'utf8'), 'generates expected html 2');
  });
});
