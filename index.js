var deliver = require('deliver');
var isUrl = require('is-url');
var fileExists = require('file-exists');

var notFound = function (file, options) {
  options = options || {};
  
  if (options.exists) fileExists = options.exists;
  if (!isUrl(file) && !fileExists(file)) file = options._default;
  
  return function (req, res, next) {
    var reqOptions = {
      statusCode: 404
    };
    
    
    if (!file) return next();
    
    req.url = file;
    
    if (options.fullPath) {
      var p = options.fullPath(file);
      reqOptions.root = p.root;
      req.url = p.pathname;
    }
    
    deliver(req, reqOptions).pipe(res);
  };
};


module.exports = notFound;