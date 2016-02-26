var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var _ = require('underscore');
var mongoose = require('mongoose');
var shortid = require('shortid');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var morgan = require('morgan');
var util = require("util");


var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var passportConfig = require('./config/passport');
var User = require('./models/users.js');

var indexController = require('./controllers/index.js');
var adminController = require('./controllers/admin');
var usersController = require('./controllers/users');
var postController = require('./controllers/post');
var uploadsController = require('./controllers/uploads.js');


mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ideanote');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();



app.set('view engine', 'jade');
app.set('views', __dirname + '/views/');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use("/bower_components", express.static(__dirname + '/bower_components'));


// app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));


app.use(cookieParser());
app.use(flash());

app.use(passport.initialize());

app.use(passport.session());
app.use(multer({
    dest: "./public/uploads/"
}));





// Our get request for viewing the login page
app.get('/login', adminController.login);

// Post received from submitting the login form
app.post('/login', adminController.processLogin);

// Post received from submitting the signup form
app.post('/signup', adminController.processSignup);

// Any requests to log out can be handled at this url
app.get('/logout', adminController.logout);





app.get('/', indexController.index);
app.get('/createacct', function (req, res) {
  res.render('createacct');
});




// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()  [// app.use(passportConfig.ensureAuthenticated);]

app.use(passportConfig.isLoggedIn);





app.get('/:username/home', function (req, res) {

  var posts = req.user.posts.reverse();

  res.render('home', {
    user: req.user,
    posts: posts
  });
});



app.post('/ideaPosted', function (req, res) {

    var data = req.body;
    var id = req.user._id;
    var username = req.user.username;
    var date = Date();
    var onOff = false;
    if (req.body.onoffswitch) {
      onOff = true;
    }
    // myid += 1;
    // console.log(myid);

    // console.log('this is req.body in guestUpdateInfo: ', req.user);
    User.findById(id, function(err, user) {
      if (err) return handleErr(err);

      var uid = shortid.generate();



      newPost = {
        contents: [data.contents || '/uploads/'+req.files.fileInput.name],
        _id: uid,
        privacy: onOff,
        username: req.user.username,
        date: date,
        rating: Number(0),
        uwv: []
      };

      user.posts.push(newPost);

      user.save(function(err, user){
        if(err) return handleErr(err);
        if(newPost.privacy === false){
          for (var i = 0; i < user.followers.length; i++) {
            User.findOne({username:user.followers[i]}, function(err, follower){
              follower.discover.push(newPost)
              follower.save();
            });
          }
        }
      });
    });
    

  // Upload images to uploads folder
    if (!req.files.fileInput || !req.files.fileInput.size) {
      console.log('do nothing')
      }
    else{
      console.log(util.inspect(req.files));
      if (req.files.fileInput.size === 0) {
                  return next(new Error("Hey, first would you select a file?"));
      }
      fs.exists(req.files.fileInput.path, function(exists) {
        if(!exists) {
          res.end("Well, there is no magic for those who don’t believe in it!");
        }
      });
    }
    res.redirect("/"+username+"/home");

});
app.post('/ideaRemoved', usersController.RemovePost);
app.post('/upvote', postController.Upvote);
app.post('/downvote', postController.Downvote);
app.post('/favorite', usersController.Favorite);


app.get('/:username/edit', function (req, res) {
  res.render('edit', {user: req.user});
});


app.get('/:username/search', function (req, res) {
  res.render('search', {user: req.user});
});
app.post('/:username/search', function (req, res) {
    console.log(req.cookies);
  // User.findOne({'username':username}, function(err, user){
  User.find({username: new RegExp(req.body.search, 'i')}, function (err, user) {

    if (err) return handleErr(err);


        var matches =_.filter(user, function(obj){
          return obj.username !== req.params.username;
        });

      res.render('search', {userlist: matches, user: req.user});

    });

});


app.get('/:username/discover', function (req, res) {
  var posts = req.user.discover.reverse();
    res.render('discover', {
      user: req.user,
      posts: posts
    });
});

app.get('/:username/favorites', function (req, res) {

    console.log(req.user.username);

    var favorites = req.user.favorites.reverse();
    console.log(favorites);

      res.render('favorites', {
        user: req.user,
        favorites: favorites
      });

});

app.get('/:username/notifications', function (req, res) {

  User.find({username: req.user.username}, function (err, data) {
    if (err) {
      res.send(err);
    }

      var counter = data[0].notifications.length;

      var notifications = data[0].notifications.reverse();


      // data[0].notifications.remove({})
      // User.update({"username":"req.user.username"}, {"$unset":{"notifications":{}}})
      User.update({"username":"req.user.username"}, {"$unset":{"notifications":{}}})
      // data[0].save()
      console.log(data[0].notifications.length);



      res.render('notifications', {
        user: req.user,
        // notifications will include followers and favorited posts
        notifications:notifications
      });


  });



});
app.get('/:username/changeUsername', function (req, res) {
  res.render('changeUsername', {user: req.user});
});
app.post('/changeUsername', usersController.ChngUsername);




app.get('/:username/changePassword', function (req, res) {
  res.render('changePassword', {user: req.user});
});
app.post('/changePassword', usersController.ChngPassword);








// app.get('/user/:me/:username', function (req, res) {
//   var isFollowing = req.user.following.indexOf(req.params.username);


//       User.find({username: req.params.username}, function (err, data) {

app.get('/:username/:usersprof', function (req, res) {
  console.log(req.cookies);
  var isFollowing = req.user.following.indexOf(req.params.usersprof);


      User.find({username: req.params.usersprof}, function (err, data) {
        if (err) {
          res.send(err);
        }

        var allPosts= data[0].posts.reverse();

        var publicPosts=_.filter(allPosts, function(obj){
          return obj.privacy === false;
        });
        console.log(publicPosts);

        res.render('searchProfile', {
          user: req.params,
          otherusers: data[0],
          isFollowing: isFollowing,
          publicPosts: publicPosts,

        });

    });
});
app.post('/follow', usersController.FollowUser);






app.post('/uploadProfpic', function(req, res){

    User.findOne({username: req.user.username}, function (err, data) {
      if (err) return handleErr(err);

      data.imageUrl = req.body.imageUrl || "/img/gravatar.jpg";
      
      data.save(function(err, user) {
        console.log('ji');
        if(err) return handleErr(err);
        res.send(user);
        // res.redirect('/'+username+'/edit');
      });

    });

});
app.post('/uploadProfilepic', function(req, res){
    var id = req.user._id;

    User.findById(id, function (err, data) {
      if (err) return handleErr(err);

      data.imageUrl = '/uploads/' + req.files.imageUrl.name || "/img/gravatar.jpg";
      
      data.save(function(err, user) {
        console.log('ji');
        if(err) return handleErr(err);
        // res.send(user);
        // res.redirect('/'+username+'/edit');
      });

    });

    if (!req.files.imageUrl || !req.files.imageUrl.size) {
      console.log('do nothing')
      }
    else{
      console.log(util.inspect(req.files));
      if (req.files.imageUrl.size === 0) {
                  return next(new Error("Hey, first would you select a file?"));
      }
      fs.exists(req.files.imageUrl.path, function(exists) {
        if(!exists) {
          res.end("Well, there is no magic for those who don’t believe in it!");
        }
      });
    }
    res.redirect("/"+req.user.username+"/home");


});


// Use heroku's port if it is specified.
// Otherwise use our own local port.
// var port = process.env.PORT || 6591;
// var server = app.listen(port, function(){})
var server = app.listen(process.env.PORT || 6591, function () {
  console.log('Express server listening on port ' + server.address().port);
});
