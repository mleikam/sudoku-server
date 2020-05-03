'use strict'
var logger = function(req, res,next) {
  const now = Date.now();
  console.log('App handling request at '+now);
  console.log('URL:', req.originalUrl );
  next();
}

module.exports = logger; 