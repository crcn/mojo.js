transformer = require "./transformer"

module.exports = transformer


for method in ["cast", "map", "preCast", "preMap", "postCast", "postMap"] then do (method) =>
  module.exports[method] = () -> 
    t = transformer()
    t[method].apply t, arguments