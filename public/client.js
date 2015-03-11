
//remove focus and border on click of (post) input event
$(".postinput").on('click', function(){
	$(this).css({
			"border" : "none",
			"outline" : "none"
		})
})
// submit idea to your wall
$(".submit").on('click', function(e){

	e.preventDefault();

var postData = $(".postinput").val();

	$(".ideaBody").append('<p class="postedIdea">' + postData + '</p>')
})


// ANGULAR CLIENT SIDE
// var newsApp = angular.module('newsApp',
//   ['ngResource', 'ngRoute']
// );

// // Configure our client-side routing
// newsApp.config(function($routeProvider){
//   $routeProvider
//     .when('/', {
//       templateUrl: '/templates/home',
//       controller: 'homeController'
//     })
//     .when('/acct/:id/1-4', {
//       templateUrl: '/templates/view',
//       controller: 'viewController'
//     });
// });