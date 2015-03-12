
var User = require('../users.js');

User.find({}, function(err, results){
  if(results.length === 0){

    var user1 = new User({
      username: 'bob',
      password: "password",
      ideas: {
        contents: ["this is a good idea", "this is my idea"],
        newidea: {
          username: 'bob',
          date: {
            type: Date,
            default: new Date()
          },
          privacy: false,
          category: 'NA'
        },
      },
      followers: ["steve"],
      following: ["steve"],
      imageUrl: 'http://static.fjcdn.com/large/pictures/27/f1/27f1c3_4705638.jpg'
    });
    user1.save();

    var user2 = new User({
      username: 'steve',
      password: 'password',
      ideas: {
        contents: ["this is a bad idea"],
        newidea: {
          username: 'steve',
          date: {
            type: Date,
            default: new Date()
          },
          privacy: true,
          category: 'NA'
        },
      },
      followers: ["bob"],
      following: ["bob"],
      imageUrl: 'http://i.imgur.com/WcB5H.png'
    });
    user2.save();
  }
});


  // username: String,
  // password: String,
  // privacy: Boolean,
  // ideas: [String],
  // followers: [String],
  // following: [String],
  // imageUrl: String