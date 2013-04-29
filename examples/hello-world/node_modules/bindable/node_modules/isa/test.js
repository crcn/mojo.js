var isa = require('./isa');
var assert = require('assert');

describe('isa', function() {
  describe('number', function() {
    it('should return true if given input is a number', function() {
      assert.strictEqual(true, isa.number(5));
      assert.strictEqual(false, isa.number(''));
      assert.strictEqual(false, isa.number(false));
      assert.strictEqual(false, isa.number(null));
      assert.strictEqual(false, isa.number(undefined));
      assert.strictEqual(false, isa.number([]));
      assert.strictEqual(false, isa.number({}));
      assert.strictEqual(false, isa.number(function() {}));
      assert.strictEqual(false, isa.number(NaN));
    });
  });

  describe('string', function() {
    it('should return true if given input is a string', function() {
      assert.strictEqual(false, isa.string(5));
      assert.strictEqual(true, isa.string(''));
      assert.strictEqual(false, isa.string(false));
      assert.strictEqual(false, isa.string(null));
      assert.strictEqual(false, isa.string(undefined));
      assert.strictEqual(false, isa.string([]));
      assert.strictEqual(false, isa.string({}));
      assert.strictEqual(false, isa.string(function() {}));
      assert.strictEqual(false, isa.string(NaN));
    });
  });

  describe('boolean', function() {
    it('should return true if given input is a boolean', function() {
      assert.strictEqual(false, isa.boolean(5));
      assert.strictEqual(false, isa.boolean(''));
      assert.strictEqual(true, isa.boolean(false));
      assert.strictEqual(false, isa.boolean(null));
      assert.strictEqual(false, isa.boolean(undefined));
      assert.strictEqual(false, isa.boolean([]));
      assert.strictEqual(false, isa.boolean({}));
      assert.strictEqual(false, isa.boolean(function() {}));
      assert.strictEqual(false, isa.boolean(NaN));
    });
  });

  describe('null', function() {
    it('should return true if given input is a null', function() {
      assert.strictEqual(false, isa.null(5));
      assert.strictEqual(false, isa.null(''));
      assert.strictEqual(false, isa.null(false));
      assert.strictEqual(true, isa.null(null));
      assert.strictEqual(false, isa.null(undefined));
      assert.strictEqual(false, isa.null([]));
      assert.strictEqual(false, isa.null({}));
      assert.strictEqual(false, isa.null(function() {}));
      assert.strictEqual(false, isa.null(NaN));
    });
  });

  describe('undefined', function() {
    it('should return true if given input is a undefined', function() {
      assert.strictEqual(false, isa.undefined(5));
      assert.strictEqual(false, isa.undefined(''));
      assert.strictEqual(false, isa.undefined(false));
      assert.strictEqual(false, isa.undefined(null));
      assert.strictEqual(true, isa.undefined(undefined));
      assert.strictEqual(false, isa.undefined([]));
      assert.strictEqual(false, isa.undefined({}));
      assert.strictEqual(false, isa.undefined(function() {}));
      assert.strictEqual(false, isa.undefined(NaN));
    });
  });

  describe('array', function() {
    it('should return true if given input is a array', function() {
      assert.strictEqual(false, isa.array(5));
      assert.strictEqual(false, isa.array(''));
      assert.strictEqual(false, isa.array(false));
      assert.strictEqual(false, isa.array(null));
      assert.strictEqual(false, isa.array(undefined));
      assert.strictEqual(true, isa.array([]));
      assert.strictEqual(false, isa.array({}));
      assert.strictEqual(false, isa.array(function() {}));
      assert.strictEqual(false, isa.array(NaN));
    });
  });

  describe('function', function() {
    it('should return true if given input is a function', function() {
      assert.strictEqual(false, isa.function(5));
      assert.strictEqual(false, isa.function(''));
      assert.strictEqual(false, isa.function(false));
      assert.strictEqual(false, isa.function(null));
      assert.strictEqual(false, isa.function(undefined));
      assert.strictEqual(false, isa.function([]));
      assert.strictEqual(false, isa.function({}));
      assert.strictEqual(true, isa.function(function() {}));
      assert.strictEqual(false, isa.function(NaN));
    });
  });

  describe('nan', function() {
    it('should return true if given input is not a number (NaN)', function() {
      assert.strictEqual(false, isa.nan(5));
      assert.strictEqual(true, isa.nan(''));
      assert.strictEqual(true, isa.nan(false));
      assert.strictEqual(true, isa.nan(null));
      assert.strictEqual(true, isa.nan(undefined));
      assert.strictEqual(true, isa.nan([]));
      assert.strictEqual(true, isa.nan({}));
      assert.strictEqual(true, isa.nan(function() {}));
      assert.strictEqual(true, isa.nan(NaN));
    });
  });
});
