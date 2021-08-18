var Test = function (exports) {
  'use strict';

  function test() {
    console.log('Yay');
  }

  function test2() {}

  function test3() {}

  exports.test = test;
  exports.test2 = test2;
  exports.test3 = test3;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  return exports;
}({});
