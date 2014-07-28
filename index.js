var deliver = require('deliver');
var isUrl = require('is-url');
var fileExists = require('file-exists');

var notFound = function (file, options) {
  options = options || {};
  
  if (options.exists) fileExists = options.exists;
  if (!isUrl(file) && !fileExists(file)) file = null;
  
  return function (req, res, next) {
    if (!file) return next();
    
    req.url = file;
    deliver(req, {
      statusCode: 404
    }).pipe(res);
  };
};


module.exports = notFound;