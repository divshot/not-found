var deliver = require('deliver');
var isUrl = require('is-url');
var fileExists = require('file-exists');

var notFound = function (options) {
  options = options || {};
  
  var filepath;
  
  if (options.exists) fileExists = options.exists; // TODO: test this
  if (!isUrl(options.file) && fileExists(options.file)) filepath = options.file;
  
  return function (req, res, next) {
    if (!filepath) return next();
    
    req.url = filepath;
    deliver(req, {
      statusCode: 404
    }).pipe(res);
  };
};


module.exports = notFound;