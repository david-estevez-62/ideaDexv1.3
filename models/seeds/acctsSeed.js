
// var User = require('../users.js');

// User.find({}, function(err, results){
//   if(results.length === 0){

//     var user1 = new User({
//       username: 'bob',
//       password: "password",
//       ideas: {
//         contents: ["this is a good idea", "this is my idea"],
//         publicPost: ['this is a good idea'],
//         newIdea: {
//           lastPost: "this is my idea,"
//           username: 'bob',
//           date: {
//             type: Date,
//             default: new Date()
//           },
//           privacy: false,
//           category: 'NA'
//         },
//       },
//       followers: ["steve"],
//       following: ["steve"],
//       imageUrl: 'http://static.fjcdn.com/large/pictures/27/f1/27f1c3_4705638.jpg'
//     });
//     user1.save();

//     var user2 = new User({
//       username: 'steve',
//       password: 'password',
//       ideas: {
//         contents: ["this is a bad idea"],
//         publicPost: ['this is a bad idea'],
//         newIdea: {
//           lastPost: 'this is a bad idea',
//           username: 'steve',
//           date: {
//             type: Date,
//             default: new Date()
//           },
//           privacy: true,
//           category: 'NA'
//         },
//       },
//       followers: ["bob"],
//       following: ["bob"],
//       imageUrl: 'http://i.imgur.com/WcB5H.png'
//     });
//     user2.save();
//   }
// });


//   publicIdeas: ["this is my idea"],
//         privIdeas: ["this is a good idea"],


//     publicIdeas: [],
//   privIdeas: ['this is a bad idea'],







  // username: String,
  // password: String,
  // privacy: Boolean,
  // ideas: [String],
  // followers: [String],
  // following: [String],
  // imageUrl: String