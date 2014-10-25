module.exports = function(item) {
  if(item === undefined)  return [];
  return Object.prototype.toString.call(item) === "[object Array]" ? item : [item];
}