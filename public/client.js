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