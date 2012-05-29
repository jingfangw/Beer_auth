
/**
  * Module dependencies.
  */
var db = require('../accessDB');
var emailer = require('mailer');
var bcrypt = require('bcrypt');


module.exports = {

  //app.get('/',..)
  index: function(req, res) {
    res.render('index.jade', { locals:
      { title: 'Beers' }
    });
  }, 
  
  // app.get('/account'...)
  	getAccount: function(req, res, next){
  	res.render('account.jade', { locals:
  		{ title: 'Beers'
  		, currentUser: req.user
  		}
  		});
  	},

  // app.get('/register'...)
  getRegister: function(req, res) {
    res.render('register.jade',{
    createAccount: req.query.createAccount,
    error: req.query.error
    }
    );
  },

  // app.post('/register'...)
  postRegister: function(req, res) {
  
  	if(!req.param('email') || !req.param('password') || !req.param('password2') || !req.param('name.first')||!req.param('name.last')){
  		res.redirect('/register/?error=fillInBlanks');
  		}
  	
    	
	else{
	if(req.param('password')===req.param('password2')){
    db.saveUser({
      fname : req.param('name.first')
    , lname : req.param('name.last')
    , email : req.param('email')
    , password : req.param('password')
    }, function(err,docs) {
      	res.redirect('/account/?createAccount=true');
    });
    } 
    else{
    res.redirect('/register/?error=PasswordDontMatch');
    }   
    }
 
  },

  // app.get('/about', ...
  about: function(req, res) {
    res.render('about.jade');
  },

  // app.get('/login', ...
  login: function(req, res) {
    res.render('login.jade');
    
  },

  // app.get('/logout'...)
  logout: function(req, res){
    req.logout();
    res.redirect('/');
  },
 
  // app.get('/forgot-password',..)
  getForgotPw: function(req, res, next){
    res.render('forgotpw.jade', {
      title: 'Forgot Password',
      passwordSent: req.query.passwordSent,
      password: '',
      error: req.query.error
    });
  },

  //app.post('/forgot-password',..)
  postForgotPw: function(req, res){

    if (req.param('email')) {
      db.emailPassword({
      email:req.param('email')}, function(err, user){
      	if (user && user.hash) {
          var name = user.name.first;
          var emailAdd = user.email;
          var oldPasswordHash =  encodeURIComponent(user.hash);
          var userId = user._id;
          var resetLink = "http://localhost:3001/reset-password/?userId="+userId+"&verify="+oldPasswordHash; 
          
          for(var i =0; i < 1; i++){
          emailer.send({
			ssl: true,
      		host : "smtp.gmail.com",               // smtp server hostname
      		port : 465,                     // smtp server port
      		domain : "[127.0.0.1]",             // domain used by client to identify itself to server
      		to : emailAdd,
      		from : "wjf1611@gmail.com",
      		subject : "Password Reset",
      		template: "./templates/templateEmail.txt",
      		data:{
      			"name": name,
      			"resetLink": resetLink
      			},
      		
      		authentication: "login",
      		username: "randomtestacc0@gmail.com",
    		password: "myPassword",
    		debug: true	
      	},	
      		
   		function(err, result){
      	if(err){ console.log(err); }
    	});
      }
    }	 
    res.redirect('/forgot-password/?passwordSent=true');
    });
    }
    else {
      res.redirect('/forgot-password/?error=NoEmailGiven');
      }
          
  },
  
  //app.get('/reset-password',..)
  getResetPw: function(req, res, next){
    var userId = req.query.userId;
    var verify = decodeURIComponent(req.query.verify);
    if (userId && verify) {
      db.reset_Password({
      userId: userId}, function(err, user){ 
      if (user && user.hash == verify ) {
          db.resetPassword({
          userId: user._id}, function (error, result) {
            if (error) {
              log.error(error);
              }
    	    else {
              res.render('forgotpw.jade', {
                title: 'Password Reset',
                passwordSent: '',
                password: result,
                error:'' 
              });
            }
           });
        }
    	});
    	}    
	},
	//app.get('/change-password)
	getChangePw: function(req, res, next){
		res.render('changepw.jade',{
		currentUser: req.user,
		done: req.query.done,
		error: req.query.error
		});
	},
	
	
	//app.post('/change-password'..)
	postChangePw: function(req, res, next){
		if(!(req.param('password1')==req.param('password2'))){
			res.redirect('/account/:id/change-password/?error=passwordDontMatch');
		}
		else {
			
			var Id = req.params.id;
			db.getOneUser({Id: Id}, function(err, user){
			 	var newPassword = '';
			 	newPassword = req.param('password1');
			 	var salt = bcrypt.genSaltSync(10);
			 	var newhash = bcrypt.hashSync(newPassword, salt);
			 	var userId = user._id;
			 	var emailAdd = user.email;
			 	db.updatePassword({
			 	userId: userId,
			 	password: newhash}, function(err){
			 	if(err) console.log(err);
			 	});
			 
			 for(var i =0; i < 1; i++){
          emailer.send({
			ssl: true,
      		host : "smtp.gmail.com",               // smtp server hostname
      		port : 465,                     // smtp server port
      		domain : "[127.0.0.1]",             // domain used by client to identify itself to server
      		to : emailAdd,
      		from : "wjf1611@gmail.com",
      		subject : "Your New Password",
      		template: "./templates/templateEmail2.txt",
      		data:{
      			"name": user.name.first,
      			"password": newPassword
      			},
      		
      		authentication: "login",
      		username: "randomtestacc0@gmail.com",
    		password: "myPassword",
    		debug: true	
      	},	
      		
   		function(err, result){
      	if(err){ console.log(err); }
    	});
    	}
			res.redirect('/account/:id/change-password/?done=passwordChanged');
		});
		}
	}
}
