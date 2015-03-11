var News = require('../models/ideas.js');

var newsController = {
  getAll: function(req, res){
    if(req.query._id){
      // If there is a query parameter for _id,
      // get an individual item:
      News.findById(req.query._id, function(err, result){
        res.send(result);
      });
    } else {
      // else, get all items
      // Go to DB and find all news items
      News.find({}, function(err, results){
        // Send the entire array of results
        // to the client as JSON
        res.send(results);
      });
    }
  },

  // getNonPriv: function(req,res){
// 
  // },

  createNew: function(req, res){
    var newIdeas = new Ideas(req.body);
    newIdeas.save(function(err, result){
      res.send(result);
    });
  }
};

module.exports = ideasController;