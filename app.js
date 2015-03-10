var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);

app.get('/home', function(req,res){
	res.render('home')
})
app.get('/search', function(req, res){
	res.render('search')
})
app.get('/discover', function(req,res){
	res.render('discover')
})
app.get('/favorites', function(req, res){
	res.render('favorites')
})
app.get('/notifications', function(req, res){
	res.render('notifications')
})
app.get('/changeUsername', function(req, res){
	res.render('changeUsername')
})
app.get('/changePassword', function(req, res){
	res.render('changePassword')
})
var server = app.listen(6591, function() {
	console.log('Express server listening on port ' + server.address().port);
});
