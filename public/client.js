$(document).ready(function(){


	//remove focus and border on click of (post) input event
	$("#postinput").on('click', function(){
		$(this).addClass('noborder');
	});

	$("#upload").on('click', function(){
		$("#fileInput").click();
	});

	$('#searchbtn').on('click', function(){
		$("#searchform").submit();
	});

	// var uniqueId = 0;

	// submit idea to your wall
	//





	// $("#submit1").on('click', function(){


	// 	var postData = $("#postinput").val();
	// 	var date = Date();

	// 	// var postData2 = $('#upload').val();
	// 	// console.log(postData)

	// 	$('#postinput').removeClass('noborder')

	// 	$.post('/ideaPosted', {postData:postData, privacy: $('#myonoffswitch').is(':checked'), date:date} , function(data){
	// 		console.log(data.posts);

	// 		// console.log('test', data);

	// 		$(".ideaTable").prepend('<tr data-postid="'+data._id+'"><td data-postid2="'+data.username+'"><img src="/img/favoriteIcon.png" class="favorite" data-postid="'+data._id+'" data-cont="'+data.contents+'" height="35px" width="35px"></td><td data-postid2="'+data.username+'"><img src="/img/votearrow.jpg" alt="" useMap="#Map" /><map name="Map" id="Map"><area alt="" title="" shape="poly" coords="3,25,22,0,38,25" class="upvote" data-postid="'+data._id+'" /><h3 class="rating">'+0+'</h3><area alt="" title="" shape="poly" coords="40,63,21,90,4,63" class="downvote" data-postid="'+data._id+'" /></map><td class="ideaBody"><h3>'+postData+'</h3><h6>'+date+'</h6><h6>'+data.username+'</h6></td><td><a href="#" class="delete" data-postid="'+data._id+'">Remove</a></td>');


	// 	});

	// 	$('#postinput').val('');



	// 	// $(".ideaTable").prepend('<tr><td></td><td class="ideaBody"><h3>' + postData + '</h3></td><td><a class="delete">Remove</a></td></tr>');

	// });









	// $(".uploadTake").hover(function(){
	// 	// console.log("hi")
	// 	console.log($(this).parent())

	// 	$('.uploadTake').before('<input type="file" accept="image/*" id="upload">')
	// 	console.log($(this).closest('input'))
	// })
	$("#submit2").on('click', function(){


		var usersProf = $('h5').text()

		// if (uniqueId === 0) {
		// 	uniqueId++
		// }
		// uniqueId++
		// console.log(uniqueId);
		console.log(usersProf);


		$.post('/follow', {usersProf:usersProf} , function(data){
			console.log(data);
			$('#submit2').remove();

		});

		// $('#submit').remove();



	});

	// $(document).on("click", '.delete', function(){
	$('.delete').on('click', function(){


		var thisPost = $(this).attr('data-postid');

		// var table = $('tr').attr('data-postid');
		console.log($(this));


		$.post('/ideaRemoved', {thisPost:thisPost}, function(data){
			// console.log(remove);
			// console.log(data);
			// var remove = $(this).parent('tr');
			// console.log(remove);
			console.log(data);
			$(this).remove();


		})


	});


	$('.upvote').on('click', function(){
		var thisPost = $(this).attr('data-postid');

		var userPosted = $(this).parent().parent().attr('data-postid2');
		console.log(userPosted);

		console.log(thisPost);

		$.post('/upvote', {thisPost:thisPost, userPosted:userPosted}, function(data){
			console.log(data);
		})
	});

	$('.downvote').on('click', function(){
		var thisPost = $(this).attr('data-postid');

		var userPosted = $(this).parent().parent().attr('data-postid2');
		console.log(userPosted);

		console.log(thisPost);

		$.post('/downvote', {thisPost:thisPost, userPosted:userPosted}, function(data){
			console.log(data);
		})
	});


	$('.favorite').on('click', function(){
		var thisPost = $(this).attr('data-postid');
		var postCont = $(this).attr('data-cont');



		var post = postCont.split('');
		post.shift();
		post.shift();
		post.pop();
		post.pop();
		var postContent = post.join('');




		var userPosted = $(this).parent().attr('data-postid2');


		$.post('/favorite', {thisPost:thisPost, userPosted:userPosted, postContent:postContent}, function(data){
			console.log(data);
			// document.write(data)
		})

	})



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


