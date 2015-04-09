

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var passportConfig = require('./config/passport');
var User = require('./models/users.js');

var indexController = require('./controllers/index.js');
var adminController = require('./controllers/admin');
var usersController = require('./controllers/users');
var postController = require('./controllers/post');


mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/express-passport-local');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views/');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
require('./models/seeds/acctsSeed.js');
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());
app.use(flash());

app.use(passport.initialize());

app.use(passport.session());




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
app.get('/:username/home', function (req, res) {
  var posts = req.user.posts.reverse();

  res.render('home', {
    user: req.user,
    posts: posts
  });
});
app.post('/ideaPosted', usersController.AddPost);


app.post('/ideaRemoved', usersController.RemovePost)


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
    // if (err) return next(err);

        // // If user is not found...
        // if (!user){
        //   return next(null, false, req.flash('loginError', 'No user found.'));
        // }
        // console.log(user)

      res.render('search', {userlist: user, user: req.user});
    })
   
    // res.('/search')
});





app.get('/user/:me/:username', function (req, res) {
  var isFollowing = req.user.following.indexOf(req.params.username);

      User.find({username: req.params.username}, function (err, data) {
        if (err) {
          res.send(err);
        }

        res.render('searchProfile', {
          user: req.params,
          isFollowing: isFollowing,
          publicPosts: data[0].publicPosts
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
    })
});

app.get('/:username/favorites', function (req, res) {

  User.find({username: req.user.username}, function (err, data) {
    if (err) {
      res.send(err);
    }

      res.render('favorites', {
        user: req.user,
        favorites: data[0].favorites
      })
  });

});
app.get('/:username/notifications', function (req, res) {
  
  User.find({username: req.user.username}, function (err, data) {
    if (err) {
      res.send(err);
    }

      res.render('notifications', {
        user: req.user,
        // notifications will include followers and favorited posts
        notifications: data[0].notifications
      })
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



var server = app.listen(process.env.PORT || 6591, function () {
  console.log('Express server listening on port ' + server.address().port);
});
