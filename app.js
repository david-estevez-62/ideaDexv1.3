var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var _ = require('underscore');
var mongoose = require('mongoose');
var shortid = require('shortid');
var path = require('path');
var fs = require('fs');
var multer = require('multer')
var uploads = require('./routes/uploads');



var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var passportConfig = require('./config/passport');
var User = require('./models/users.js');

var indexController = require('./controllers/index.js');
var adminController = require('./controllers/admin');
var usersController = require('./controllers/users');
var postController = require('./controllers/post');



mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ideanote');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views/');
app.use(express.static(__dirname + '/public'));

// app.use(multer({
//   dest: './uploads/',
//   rename: function (fieldname, filename) {
//     return filename.replace(/\W+/g, '-').toLowerCase();
//   },
//   onFileUploadStart: function (file) {
//     process.stderr.write('Uploading file..........');
//   },
//   onFileUploadComplete: function (file) {
//     process.stderr.write('done\n');
//   },
// }));



// app.use(function(req, res){
//   if(!req.files || !req.files.album_cover){
//     // res.end("huh. Did you send a file?")
//   } else{
//     console.log(req.files);
//     res.end("You have asked to set the album cover for "
//         + req.body.albumid
//         + " to '" + req.files.album_cover.name + "'\n");
//   }
// })
// app.use(express.bodyParser({uploadDir:'./', keepExtensions: true}));
// app.use(express.bodyParser({uploadDir:'/uploads'}));
// app.use(express.bodyParser({uploadDir:'./uploads'}));
app.use(bodyParser.urlencoded({extended: false}));



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
    dest: “./uploads/”
}));
app.use(“./uploads”, uploads);




// Our get request for viewing the login page
app.get('/login', adminController.login);

// Post received from submitting the login form
app.post('/login', adminController.processLogin);

// Post received from submitting the signup form
app.post('/signup', adminController.processSignup);

// Any requests to log out can be handled at this url
app.get('/logout', adminController.logout);

// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()
app.get('/', indexController.index);
app.get('/createacct', function (req, res) {
  res.render('createacct');
});

app.use(passportConfig.isLoggedIn);
// app.use(passportConfig.ensureAuthenticated);



// app.get('/:username/home', function(req,res){
//  res.render('home', {user: req.user})
// })
// app.get('/home', function (req, res) {
//   res.render('home', {user: req.user});
// });
// Passing in ideas in res.render allows use to have access to ideas in jade
//
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
      // console.log('hi');
      // console.log(data.onoffswitch);


      newPost = {
        contents: [data.contents || '/img/'+data.fileInput],
        _id: uid,
        privacy: onOff,
        username: req.user.username,
        date: date,
        rating: Number(0),
        uwv: []
      };

      // console.log(data.fileInput)


      user.posts.push(newPost);
      // if (newPost.privacy === 'false') {
      //  user.publicPosts.push(newPost);
      // }

      user.save(function(err, user){
        // console.log(user)
        if(err) return handleErr(err);
        if(newPost.privacy === 'false'){
          for (var i = 0; i < user.followers.length; i++) {
            User.findOne({username:user.followers[i]}, function(err, follower){
              // console.log(follower
              follower.discover.push(newPost)
              follower.save();
            });
          }
        }
        // console.log(user)
        // res.redirect('/'+req.user.username+'/home');
      });
    });

function postFormData(uploads, data, callback){
    if (typeof FormData ==="undefined")
      throw new Error("FormData is not implemented");

    console.log(data.fileInput)

    var request = new XMLHttpRequest();
    request.open("POST", uploads);
    request.onreadystatechange = function(){
      if(request.readyState === 4 && callback)
        callback(request);
    };
    var formdata = new FormData();
    for(var name in data) {
      if(!data.hasOwnProperty(name)) continue;
      var value = data[name];
      if (typeof value === "function") continue;
      formdata.append(name, value);
    }

    request.send(formdata);

  }
  postFormData();

    
});
app.post('/ideaRemoved', usersController.RemovePost);
app.post('/upvote', postController.Upvote);
app.post('/downvote', postController.Downvote);
app.post('/favorite', usersController.Favorite);

// app.get('/users/:userid', readController.getByUser);
// // If already following dont have follow button other have follow btn
// app.get('/users/:userid/:otheruserid', readController.getByUser)





// app.get('/:id/edit', function (req, res) {
//   var id = user._id;
//   res.redirect('/'+id+'/edit');
// });
app.get('/:username/edit', function (req, res) {
  res.render('edit', {user: req.user});
});
//res.redirect('/guest-portal');




app.get('/:username/search', function (req, res) {
  res.render('search', {user: req.user});
});
app.post('/:username/search', function (req, res) {

  // User.findOne({'username':username}, function(err, user){
  User.find({username: new RegExp(req.body.search, 'i')}, function (err, user) {

    if (err) return handleErr(err);


        var matches =_.filter(user, function(obj){
          return obj.username !== req.params.username;
        });
        console.log(matches);

      res.render('search', {userlist: matches, user: req.user});
    });

    // res.('/search')
});





app.get('/user/:me/:username', function (req, res) {
  var isFollowing = req.user.following.indexOf(req.params.username);


      User.find({username: req.params.username}, function (err, data) {
        if (err) {
          res.send(err);
        }

          var allPosts= data[0].posts.reverse();
        //   console.log(allPosts)
        //   console.log(data[0].posts)

        // console.log(allPosts)

        var publicPosts=_.filter(allPosts, function(obj){
          return obj.privacy === false;
        });
        console.log(publicPosts);

        res.render('searchProfile', {
          user: req.params,
          isFollowing: isFollowing,
          publicPosts: publicPosts
        });

    });
});
app.post('/follow', usersController.FollowUser);


  // User.find({following: req.params.username}, function (err, user) {
  //     if (err) res.send(err);

  //     var following = following.indexOf(req.params.username)

  //     // map over array of friends to see if friends with hyperlink username that was clicked on
  //     //////////////////////////////////////////////////////////////////
  //     // if friends prefix with friend (i.e username/friend/username)//
  //     // if not friends yet (i.e. username/username)                //
  //     ///////////////////////////////////////////////////////////////

  //     console.log(following);
  //     res.render('searchProfile', {user: req.body});


app.get('/:username/discover', function (req, res) {
  var posts = req.user.discover.reverse();
    res.render('discover', {
      user: req.user,
      posts: posts
    });
});

app.get('/:username/favorites', function (req, res) {

  User.find({username: req.user.username}, function (err, data) {
    if (err) {
      res.send(err);
    }

    var favorites = req.user.favorites.reverse();
      res.render('favorites', {
        user: req.user,
        favorites: favorites
      });
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



app.post('/uploadProfilepic', function(req, res){

    User.findOne({username: req.user.username}, function (err, data) {
      if (err) return handleErr(err);

      data.imageUrl = req.body.imageUrl || "/img/gravatar.jpg";
      var par = req.body.imageUrl;
      console.log(par);
      data.save(function(err, user) {
        console.log('ji');
        if(err) return handleErr(err);
        res.send(user);
        // res.redirect('/'+username+'/edit');
      });

    });

});


// Use heroku's port if it is specified.
// Otherwise use our own local port.
// var port = process.env.PORT || 6591;
// var server = app.listen(port, function(){})
var server = app.listen(process.env.PORT || 6591, function () {
  console.log('Express server listening on port ' + server.address().port);
});
