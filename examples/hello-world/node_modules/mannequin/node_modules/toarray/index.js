module.exports = function(item) {
  if(item === undefined)  return [];
  return item instanceof Array ? item : [item];
}