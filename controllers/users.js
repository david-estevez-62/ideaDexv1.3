var User = require('../models/users.js');

var usersController = {
  getAll: function(req, res){
    if(req.query._id){
      // If there is a query parameter for _id,
      // get an individual item:
      User.findById(req.query._id, function(err, result){
        res.send(result);
      });
    } else {
      // else, get all items
      // Go to DB and find all news items
      User.find({}, function(err, results){
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
    var newUser = new User(req.body);
    newUser.save(function(err, result){
      res.send(result);
    });
  }
};

module.exports = usersController;