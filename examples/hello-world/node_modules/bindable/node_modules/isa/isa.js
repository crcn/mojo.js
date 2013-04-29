(function(undefined){
  'use strict';

  var toString = Object.prototype.toString;

  /**
   * `isa` is a collection of methods which ease for type checking
   *
   * @module isa
   * @class isa
   * @static
   */
  var isa = {};

  /**
   * type checking for `number`
   *
   * @static
   * @method number
   * @param {Object} o given input
   * @return {boolean} true if given input is a `number`
   */
  isa.number = function(o) {
    return ('number' === typeof o) && !isNaN(o);
  };

  /**
   * type checking for `string`
   *
   * @static
   * @method string
   * @param {Object} o given input
   * @return {boolean} true if given input is a `string`
   */

  /**
   * type checking for `boolean`
   *
   * @static
   * @method boolean
   * @param {Object} o given input
   * @alias bool
   * @return {boolean} true if given input is a `boolean`
   */

  /**
   * type checking for `undefined`
   *
   * @static
   * @method undefined
   * @param {Object} o given input
   * @return {boolean} true if given input is a `undefined`
   */

  /**
   * type checking for `function`
   *
   * @static
   * @method function
   * @param {Object} o given input
   * @return {boolean} true if given input is a `function`
   */
  ['string', 'boolean', 'undefined', 'function'].forEach(function(p) {
    isa[p] = function(o) {
      this.name = p;
      return p === typeof o;
    }
  });

  isa.bool = isa.boolean;

  /**
   * type checking for `null`
   *
   * @static
   * @method null
   * @param {Object} o given input
   * @return {boolean} true if given input is a `null`
   */
  isa.null = function(o) {
    return null === o;
  };

  /**
   * type checking for `Array`
   *
   * @static
   * @method array
   * @param {Object} o given input
   * @return {boolean} true if given input is an instance of `Array`
   */
  isa.array = function(o) {
    return Array.isArray
      ? Array.isArray(o)
      : '[object Array]' === toString.call(o);
  }

  /**
   * type checking for NaN
   *
   * @static
   * @method nan
   * @param {Object} o given input
   * @alias NaN
   * @see isa.number
   * @return {boolean} true if given input is not a number
   */
  isa.nan = isa.NaN = function(o) {
    return !this.number(o);
  }

  module.exports = isa;

}());
