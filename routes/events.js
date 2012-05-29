

var db = require('../accessDB');
var BeerModel = require('../models/beer');

function sendResponse(res, output) {
  var navOutput = '<a href="/beers">List All</a> | <a href="/orderbeers">Place Order</a> | <a href="/account">Home</a> | <a href="/logout">Logout</a><br/><br/>'  + output;
  res.send(navOutput);
}

//app.get('/orderbeers'..) 

module.exports = {


getOrderBeers: function(req, res){
  
  db.OrderBeers(function(err){
	if(err) console.log(err);
  });
	res.render('OrderBeer.jade');
	
  
},

//app.get('/beers', 

getBeers: function(req, res){
	db.getBeerList(function(err, beers){
		res.render('listBeers.jade',{ locals:
		{ title: 'List of Beers'
		, myBeers: beers
		
		}
		});
	});

},

//app.get('/beer/id/:id', 

getBeerId: function(req, res, next){
  var id = req.params.id;

  BeerModel.findById(id, function(err, beer) {
    // Ensure item exists
    if (beer) {
    	res.render('findBeer.jade',{
    		myBeer: beer,
    		
    	}
    	); 
    } 
  });
},

//app.get('/beer/remove/:id', 

getRemoveBeer: function (req, res, next) {
  var id = req.params.id;

  BeerModel.findById(id, function(err, beer) {
    // If the beer exists, remove it
    if (beer) {
       beer.remove(function(err){
       	if(!err){
       		res.render('removeBeer.jade');
       	}
       }); 
    }
  });
  
},

//app.get('/beer/improve/:id', 

getImproveBeer: function (req, res, next) {
  var id = req.params.id;
    
  BeerModel.findById(id, function(err, beer) {
    // Ensure item exists
    if (beer) {
      beer.increaseRating();
      beer.save();
      res.render('findBeer.jade',{
      	myBeer: beer
      	}
      );
    }
  });
},

//app.get('/beer/reduce/:id', 

getReduceBeer: function (req, res, next) {
  var id = req.params.id;

  BeerModel.findById(id, function(err, beer) {
    // Ensure item exists
    if (beer) {
      beer.decreaseRating();
      beer.save();
      res.render('findBeer.jade',{
      	myBeer: beer
      	}
      );
    } 
  });
}

}

