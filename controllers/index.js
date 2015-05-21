var indexController = {
	index: function(req, res) {
		res.render('index');
	},
	uploadHelper: function(req, res){
		uploadHelper.doUpload(req,res);
	}
};

module.exports = indexController;