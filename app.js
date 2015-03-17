

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


mongoose.connect('mongodb://localhost/express-passport-local');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views/');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
require('./models/seeds/acctsSeed.js');
app.use(session({
  secret: 'keyboard cat'
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
app.get('/:id/home', function (req, res) {
  res.render('home', {user: req.user});
});
app.post('/ideaPosted', usersController.AddPost);






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
app.post('/editSettings', usersController.EditSettings);
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
app.get('/:username/discover', function (req, res) {
  res.render('discover', {user: req.user})
});
app.get('/:username/favorites', function (req, res) {
  res.render('favorites', {user: req.user})
});
app.get('/:username/notifications', function (req, res) {
  res.render('notifications', {user: req.user})
});
app.get('/changeUsername', function (req, res) {
  res.render('changeUsername');
});
app.get('/changePassword', function (req, res) {
  res.render('changePassword');
});
var server = app.listen(6591, function () {
  console.log('Express server listening on port ' + server.address().port);
});
