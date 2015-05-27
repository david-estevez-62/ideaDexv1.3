var util = require("util");
var fs = require("fs");
var path = require('path');


var uploadsController = {
  uploads: function(req, res) {
    console.log(req.files)
    if (req.files) {
      
      console.log(util.inspect(req.files));
      if (req.files.fileInput.size === 0) {
                  return next(new Error("Hey, first would you select a file?"));
      }
      fs.exists(req.files.fileInput.path, function(exists) {
        if(exists) {
          res.end("Got your file!");
        } else {
          res.end("Well, there is no magic for those who don’t believe in it!");
        }
      });
    }
  }
};



module.exports = uploadsController;