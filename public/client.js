$(document).ready(function(){


	//remove focus and border on click of (post) input event
	$(".postinput").on('click', function(){
		$(this).addClass('noborder');
	});


	// var uniqueId = 0;

	// submit idea to your wall
	$("#submit1").on('click', function(e){

		e.preventDefault();

		var postData = $(".postinput").val();
		// var postData2 = $('#upload').val();
		console.log(postData)

		$('.postinput').removeClass('noborder');

		console.log($('#addPost'));


		$.post('/ideaPosted', {postData:postData, privacy: $('#myonoffswitch').is(':checked')} , function(data){
			// console.log(data);

			$('#ideaPosted').text(data.posts);

		});

		$('.postinput').val('');


		$(".ideaTable").prepend('<tr><td></td><td class="ideaBody"><h3>' + postData + '</h3></td><td><a class="delete">Remove</a></td></tr>');
	});







	$("#submit2").on('click', function(e){



		e.preventDefault();

		var usersProf = $('h5').text()

		// if (uniqueId === 0) {
		// 	uniqueId++
		// }
		// uniqueId++
		// console.log(uniqueId);
		console.log(usersProf);


		$.post('/follow', {usersProf:usersProf} , function(data){
			// console.log(data);

			$('h5').text(data.follow)

		});

		// $('#submit').remove();


		
	});

	// Go to users profile that was clicked(Routes will depend whether friends or not)
	// $('#findProfile').on('click', function () {
		
		

	// })




})


// var ideaDelete = function(e){
//   e.preventDefault();

//   var originalIdeaElement = $(this).closest('.idea');
//   var targetId = originalIdeaElement.attr('data-id');

//   $.post('/ideaRemoved', {targetId: targetId}, function(dataFromServer){
//     // When a success response is sent back
//     originalIdeaElement.remove();
//   });
// };	











// If searching through users then search through database





// // CLIENT-SIDE

// /**
//  * Handle submission of the new idea form
//  */
// var onIdeaSubmit = function(e){
//   // Prevent default submission behavior
//   e.preventDefault();

//   // Get data from form inputs:
//   //  The keys of this object need to match
//   //  up with the keys in our schema because
//   //  we are just directly storing the submitted
//   //  object into the database with req.body
//   //  on the server-side.
//   var newIdeaData = {
//     name: $('#idea-name').val(),
//     ABV: parseFloat($('#idea-abv').val()),
//     type: $('#idea-type').val(),
//     brewer: $('#idea-brewer').val()
//   };

//   // Reset the form easily
//   this.reset();

//   // Add validation here if necessary

//   // If the data is good, let's make an ajax call
//   $.post('/api/addIdea', newIdeaData, function(dataFromServer){
//     console.log('DataFromServer:', dataFromServer);

//     // Add the new idea to the list
//     // $('#idea-list').append(
//     //   '<li>' + dataFromServer.name + '</li>'
//     // );

//     // Clone the first idea in the list:
//     //  Works in a pinch, but if there are no beers
//     //  in the list to get, then this will fail
//     var newIdeaEl = $('.idea').first().clone();
//     newIdeaEl.find('strong').text(dataFromServer.name);
//     newIdeaEl.attr('data-id', dataFromServer._id);
//     $('#idea-list').append(newIdeaEl);
//   });
// };

// var ideaEdit = function(e){
//   e.preventDefault();

//   $('#edit-modal').modal('show');

//   var originalBeerElement = $(this).closest('.idea');
//   var targetId = originalBeerElement.attr('data-id');

//   $.get('/api/getIdea/' + targetId, function(dataFromServer){
//     $('#edit-modal .idea-name').val(dataFromServer.name);
//     $('#edit-modal .idea-abv').val(dataFromServer.ABV);
//     $('#edit-modal .idea-type').val(dataFromServer.type);
//     $('#edit-modal .idea-brewer').val(dataFromServer.brewer);
//     $('#edit-modal .idea-id').val(dataFromServer._id);
//   });
// };

// var ideaEditSubmit = function(e){
//   e.preventDefault();

//   var dataFromClient = {
//     name: $('#edit-modal .idea-name').val(),
//     ABV: $('#edit-modal .idea-abv').val(),
//     type: $('#edit-modal .idea-type').val(),
//     brewer: $('#edit-modal .idea-brewer').val()
//   };

//   var targetId = $('#edit-modal .idea-id').val();

//   $.post('/api/editIdea/' + targetId, dataFromClient, function(dataFromServer){
//     console.log(dataFromServer);

//     // Hide the modal in the end
//     $('#edit-modal').modal('hide');

//     // Update the on-page DOM element
//     $('[data-id="'+targetId+'"]')
//       .find('strong')
//       .text(dataFromServer.name);
//   });
// };

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


