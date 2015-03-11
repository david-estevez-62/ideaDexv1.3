var mongoose = require('mongoose');

var ideasSchema = mongoose.Schema({
  title: String,
  url: String,
  author: String,
  votes: Number,
  tags: [String],
  date: {
    type: Date,
    default: new Date()
  },
  content: String,
  imageUrl: String
});

// var News = mongoose.model('News', newsSchema);
// module.exports = News;

module.exports = mongoose.model('Ideas', newsSchema);