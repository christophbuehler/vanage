'use strict';

exports = module.exports = (function(undefined) {
    if(typeof Object.keys === 'function') {
        return Object.keys;
    }

    return shim;
})();

exports.shim = shim;
function shim (obj) {
  var keys = [];
  
  for (var key in obj) {
      keys.push(key);
  }

  return keys;
}