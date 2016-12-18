'use strict';
const test = require('tape');
const MarkdownTask = require('../');
const ClientKitTask = require('clientkit-task');
const fs = require('fs');
const os = require('os');

test('instance of', (t) => {
  t.plan(1);
  const nt = new MarkdownTask();
  t.equal(nt instanceof ClientKitTask, true, 'instance of ClientKitTask');
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
  });
  task.execute((err) => {
    t.equal(err, null, 'not erroring');
    t.equal(fs.existsSync(outpath), true, 'file exists');
    t.equal(fs.readFileSync(outpath, 'utf8'), fs.readFileSync('test/expected/out.html', 'utf8'));
  });
});

/*
test('converts array of files and saves', (t) => {
  t.plan(3);
  const file = `out2-${new Date().getTime()}.js`;
  const outpath = `${os.tmpdir()}/${file}`;
  const files = {};
  files[file] = ['test/fixtures/in.md', 'test/fixtures/in2.md'];
  const task = new MarkdownTask('markdown', {
    dist: os.tmpdir(),
    files
  });
  task.execute((err) => {
    t.equal(err, null, 'not erroring');
    t.equal(fs.existsSync(outpath), true, 'file exists');
    t.equal(fs.readFileSync(outpath, 'utf8'), fs.readFileSync('test/expected/out2.js', 'utf8'));
  });
});

test('precompiles a file object', (t) => {
  t.plan(3);
  const file = `out3-${new Date().getTime()}.js`;
  const outpath = `${os.tmpdir()}/${file}`;
  const files = {};
  files[file] = {
    type: 'precompile',
    input: ['test/fixtures/in.md', 'test/fixtures/in2.md'],
    data: {
      dog: 'woof!',
      cat: 'meow!'
    }
  };
  const task = new MarkdownTask('markdown', {
    dist: os.tmpdir(),
    files
  });
  task.execute((err) => {
    t.equal(err, null, 'not erroring');
    t.equal(fs.existsSync(outpath), true, 'file exists');
    t.equal(fs.readFileSync(outpath, 'utf8'), fs.readFileSync('test/expected/out2.js', 'utf8'));
  });
});

test('returns an error if passed an array to compile option', (t) => {
  t.plan(1);
  const file = `out4-${new Date().getTime()}.js`;
  const files = {};
  files[file] = {
    type: 'compile',
    input: ['test/fixtures/in.md', 'test/fixtures/in2.md'],
    data: {
      dog: 'woof!',
      cat: 'meow!'
    }
  };
  const task = new MarkdownTask('markdown', {
    dist: os.tmpdir(),
    files
  });
  task.execute((err) => {
    t.notEqual(err, null, 'errors if you pass compile a list of files');
  });
});

test('compiles a file object', (t) => {
  t.plan(3);
  const file = `out5-${new Date().getTime()}.html`;
  const outpath = `${os.tmpdir()}/${file}`;
  const files = {};
  files[file] = {
    type: 'compile',
    input: 'test/fixtures/in3.md',
    data: {
      dog: 'woof!',
      cat: 'meow!',
      fox: '????'
    }
  };
  const task = new MarkdownTask('markdown', {
    dist: os.tmpdir(),
    files
  });
  task.execute((err) => {
    t.equal(err, null, 'not erroring');
    t.equal(fs.existsSync(outpath), true, 'file exists');
    t.equal(fs.readFileSync(outpath, 'utf8'), fs.readFileSync('test/expected/out4.html', 'utf8'));
  });
});
*/
