$(document).ready(function() {
		$('#addPost').on('submit', function(e) {
			e.preventDefault();
			$.post('/ideaPosted', $(this).serialize(), function(data){
				$('#ideaPosted').text(data.ideas.newidea);
				console.log(data.ideas.newidea)
			});
		});
})