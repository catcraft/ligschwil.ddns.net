// subsites/subsite1/index.js
const path = require('path');
module.exports = function(req, res, next) {
  if (req.url === '/') {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
  };