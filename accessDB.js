// Module dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
// dependencies for authentication
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


var BeerModel = require('./models/beer');
var User = require('./models/user');


String.prototype.randomString = function(stringLength) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  if (!stringLength>0) {
    var stringLength = 8;
  }
  var randomString = '';
  for (var i=0; i<stringLength; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rnum,rnum+1);
  }
  return randomString; 
}

// Define local strategy for Passport
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    User.authenticate(email, password, function(err, user) {
      return done(err, user);
    });
  }
));
      
// serialize user on login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// deserialize user on logout
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

 

// connect to database
module.exports = {
  // Define class variable
  myBeerID: null,

  // initialize DB
  startup: function(dbToUse) {
    mongoose.connect(dbToUse);
    // Check connection to mongoDB
    mongoose.connection.on('open', function() {
      console.log('We have connected to mongodb');
    }); 

  },

  // save a user
  saveUser: function(userInfo, callback) {
    //console.log(userInfo['fname']);
    var newUser = new User ({
      name : { first: userInfo.fname, last: userInfo.lname }
    , email: userInfo.email
    , password: userInfo.password
    });
    
    
    newUser.save(function(err) {
      if (err) {throw err;}
      //console.log('Name: ' + newUser.name + '\nEmail: ' + newUser.email);
      callback(null, userInfo);
    });
  },
  
  //send email to reset pw
  emailPassword: function(userInfo, callback){	
    User.findOne({email: userInfo.email}, function (error, user) {
      	callback(null, user);
      	});
        
   },
  
  //give reset pw
  
  reset_Password: function(user, callback){
  
   User.findOne({_id: user.userId}, function (error, user) {
   		callback(null, user);
   		});
        
  },
  
  resetPassword: function (userId, callback) {
  //check to see if email exists
  var newPassword = '';
  newPassword = newPassword.randomString(10);
  var salt = bcrypt.genSaltSync(10);  
  var newhash = bcrypt.hashSync(newPassword, salt);
  User.update(
    {_id: userId.userId}
  , {$set: {hash: newhash}}
  , {multi:false,safe:true}
  , function( error, docs) {
      if (error) {
        callback(error);
      }
      else {
        callback(null, newPassword);
      }
  });
},

	updatePassword: function(userId, callback){
		User.update(
		  {_id: userId.userId}
		, {$set: {hash:userId.password}}
		, {multi:false,safe:true}
		, function(error, docs) {
			if(error) {
				callback(error);
			}
			
		});
	},
		  
		
  
  //Order beers (insert beers into database)
  OrderBeers: function(req, res){
  
  var Yuengling = new BeerModel({ brand:'Yuengling', brewery_age:105, rating: 40 });
  Yuengling.type.push({ name:'Lager', main_ingredient:'Malted Barley' });
  Yuengling.save(function(err){
    if (err) { console.log(err); } 
  });
  
  var Pecan = new BeerModel({ brand:'Southern Pecan', brewery_age:105, rating: 50 });
  Pecan.type.push({ name:'Ale', main_ingredient:'Malted Barley' });
  Pecan.save(function(err){ 
    if (err) { console.log(err); }
  });

  var BerryWeiss = new BeerModel({ brand:'Leinenkugle Berry Weiss', brewery_age:105, rating: 30 });
  BerryWeiss.type.push({ name:'Weiss', main_ingredient:'Wheat' });
  BerryWeiss.save(function(err){ 
    if (err) { console.log(err); }
  });

  var Cheriton = new BeerModel({ brand:'Cheriton Pots', brewery_age:105, rating: 40 });
  Cheriton.type.push({ name:'Stout', main_ingredient:'Hops' });
  Cheriton.save(function(err){ 
    if (err) { console.log(err); }
  });
},

  getBeerList: function(callback){
  	 BeerModel.find({}, function(err, beers){
  	 	callback(null, beers);
  	 });
  
},
  // disconnect from database
  closeDB: function() {
    mongoose.disconnect();
  },

  //get one user
  getOneUser: function(user, callback){
  	User.findOne({_id: user.Id}, function(err, user){
  		callback(null, user);
  	});
  },
  	
  // get all the users
  getUsers: function(callback) {
    User.find({}, ['name', '_id'], function(err, users) {
      callback(null, users);
    });
  }

}

