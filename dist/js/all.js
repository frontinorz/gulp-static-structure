"use strict";
// 處理 require 無法使用
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

/* --- 箭頭函式、ES6 變數、ES6 陣列方法 --- */
var mynumber = [3, 5, 1, 1, 2];
var result = (0, _filter.default)(mynumber).call(mynumber, function (item) {
  return item > 2;
});
console.log(result);
/* --- Class 語法糖 --- */

var Circle = function Circle() {
  (0, _classCallCheck2.default)(this, Circle);
};
/* --- Promise 物件 --- */


var promise = _promise.default.resolve();