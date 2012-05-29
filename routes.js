
/** routes.js
  */

var passport = require('passport');
var start = require('./routes/index');
var events = require('./routes/events');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
  
}

module.exports = function(app) {

  app.get('/', start.index);

  app.get('/register', start.getRegister);
  app.post('/register', start.postRegister);

  app.get('/about', start.about);

  app.get('/login', start.login);
  app.post('/login', passport.authenticate('local', 
    { 
      successRedirect: '/account', 
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  app.get('/account', ensureAuthenticated, start.getAccount);

  app.get('/logout', start.logout);
  
  app.get('/Orderbeers', ensureAuthenticated, events.getOrderBeers);
  
  app.get('/beers', ensureAuthenticated, events.getBeers);
  
  app.get('/beer/id/:id', ensureAuthenticated, events.getBeerId);
  app.get('/beer/remove/:id', ensureAuthenticated, events.getRemoveBeer);
  app.get('/beer/improve/:id', ensureAuthenticated, events.getImproveBeer);
  app.get('/beer/reduce/:id', ensureAuthenticated, events.getReduceBeer);
  
  app.get('/forgot-password', start.getForgotPw);
  app.post('/forgot-password', start.postForgotPw);
  
  app.get('/reset-password', start.getResetPw);
  
  app.get('/account/:id/change-password', ensureAuthenticated, start.getChangePw);
  app.post('/account/:id/change-password', ensureAuthenticated, start.postChangePw);
  
}

