'use strict';
var fs = require('fs');
var path = require('path');

/**
 * Recursively walk through directories synchronously
 * @param dir
 * @param done
 */
var walkSync = function (dir, done) {
  var results, list, i = 0, file, stat;
  results = [];
  try {
    list = fs.readdirSync(dir);
    (function next() {
      // Get next file
      file = list[i++];
      // No more files
      if (!file) {
        done(null, results);
        return results;
      }
      // Create file path
      file = dir + '/' + file;
      stat = fs.statSync(file);
      // If it's a directory, go through this process again
      if (stat && stat.isDirectory()) {
        walkSync(file, function (err, res) {
          results = results.concat(res);
          next();
        });
        // If not, just
      } else {
        results.push(file);
        next();
      }
    })();
  } catch (e) {
    done(e);
  }
};

/**
 * Returns a list of router objects by recursively loading from the given routesFolder
 * Each file visited should export a router instance
 * @param sourceFolder
 * @param cb (err, routers)
 */
function loadRouters(sourceFolder, cb){
  walkSync(sourceFolder, function (err, files) {

    if (err){
      return cb(err);
    }

    // require all the router files
    var routers = files.map(function each(file) {
      return require(file);
    });

    cb(null, routers);

  });
}

module.exports = {
  loadSync: loadRouters
};
