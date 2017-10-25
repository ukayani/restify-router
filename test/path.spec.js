'use strict';
var assert = require('assert');
var concat = require('../lib/path').concat;

describe('.concat', function () {
  it('should work for two strings as a simple string concatenation', function () {
    assert(concat('/test', '/foo') === '/test/foo', 'incorrect string concatenation');
  });

  it('should work for string and RegExp by returning escaped string concatenated with regex', function () {
    var path = new RegExp('/foo/b[ao]r');
    var prefix = '/test';

    var concatedPath = concat(prefix, path);

    var samplePath = '/test/foo/bor';
    var samplePathAlt = '/test/foo/bar';

    assert(samplePath.match(concatedPath) !== null, 'samplePath should match');
    assert(samplePathAlt.match(concatedPath) !== null, 'samplePathAlt should match');

    var badPath = 'sa/test/foo/boor';
    assert(badPath.match(concatedPath) === null, 'badPath should not match');
  });

  it('should work when both paths are RegExp by returning a concatenation', function () {
    var path = new RegExp('/foo/b[ao]r');
    var prefix = new RegExp('/te+st');

    var concatedPath = concat(prefix, path);

    var samplePath = '/test/foo/bor';
    var samplePathAlt = 'sa/teeest/foo/bar';

    assert(samplePath.match(concatedPath) !== null, 'samplePath should match');
    assert(samplePathAlt.match(concatedPath) !== null, 'samplePathAlt should match');

    var badPath = '/tesst/foo/bor';
    assert(badPath.match(concatedPath) === null, 'badPath should not match');
  });

  it('should preserve ^ if either RegExp makes use of it by keeping it as the first character', function () {
    var path = new RegExp('^/foo/b[ao]r');
    var prefix = new RegExp('/te+st');

    var concatedPath = concat(prefix, path);

    assert(concatedPath.source.startsWith('^'), 'concatenated path must start with ^');

    var samplePath = '/test/foo/bor';
    var samplePathAlt = '/teeest/foo/bar';

    assert(samplePath.match(concatedPath) !== null, 'samplePath should match');
    assert(samplePathAlt.match(concatedPath) !== null, 'samplePathAlt should match');

    var badPath = '/tesst/foo/bor';
    assert(badPath.match(concatedPath) === null, 'badPath should not match');
  });

  it('should NOT change ^ if it exist within [] in a RegExp', function () {
    var path = new RegExp('/foo/b[^ao]r');
    var prefix = new RegExp('/test');

    var concatedPath = concat(prefix, path);

    assert(!concatedPath.source.startsWith('^'), 'concatenated must not start with ^');

    var samplePath = '/test/foo/bir';

    assert(samplePath.match(concatedPath) !== null, 'samplePath should match');
  });

  it('should escape regex literals from string paths', function () {

    var path1 = '/test.png';
    var prefix = new RegExp('^/foo');
    var concatedPath1 = concat(prefix, path1);

    assert('/foo/test.png'.match(concatedPath1) !== null, 'Unable to match on literal .');
    assert('/foo/testapng'.match(concatedPath1) === null, 'Literal . was not escaped correctly');

    var path2 = '/test?abc=123';
    var concatedPath2 = concat(prefix, path2);

    assert('/foo/test?abc=123'.match(concatedPath2) !== null, 'Unable to match on literal ?');
    assert('/foo/tesabc=123'.match(concatedPath2) === null, 'Literal ? was not escaped correctly');

    var path3 = '/test?abc=$';
    var concatedPath3 = concat(prefix, path3);

    assert('/foo/test?abc=$'.match(concatedPath3) !== null, 'Unable to match on literal $');
  });

  it('should fail if path is not a string or RegExp', function () {
    assert.throws(function () {
      concat({}, 'test');
    }, TypeError, 'should not allow objects as paths');

    assert.throws(function () {
      concat(new RegExp('test'), {});
    }, TypeError, 'should not allow objects as paths');

    assert.throws(function () {
      concat({}, {});
    }, TypeError, 'should not allow objects as paths');

  });

  it('should preserve $ if either RegExp makes use of it by keeping it as the last character', function () {
    var path = new RegExp('/foo/b[ao]r$');
    var prefix = new RegExp('/test');

    var concatedPath = concat(prefix, path);

    assert(concatedPath.source.endsWith('$'), 'concatenated path must end with $');

    var samplePath = '/test/foo/bor';
    var samplePathAlt = '/test/foo/bar';

    assert(samplePath.match(concatedPath) !== null, 'samplePath should match');
    assert(samplePathAlt.match(concatedPath) !== null, 'samplePathAlt should match');

    var badPath = '/tesst/foo/bor';
    assert(badPath.match(concatedPath) === null, 'badPath should not match');
  });

  it('should preserve flags from original RegExps', function () {
    var path1 = new RegExp('/foo/bar', 'i');
    var prefix1 = new RegExp('/test', 'g');

    assert(concat(prefix1, path1).global, 'global flag not preserved');
    assert(concat(prefix1, path1).ignoreCase, 'ignoreCase flag not preserved');

    var path2 = new RegExp('/foo/bar');
    var prefix2 = '/test';

    assert(concat(prefix2, path2).global === false, 'global flag not preserved');
    assert(concat(prefix2, path2).ignoreCase === false, 'ignoreCase flag not preserved');
  });
});

