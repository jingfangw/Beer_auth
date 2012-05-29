/** Event Schema for Beers **/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

	Type = new Schema({
		  name	        : String,
		  main_ingredient : String
    }),
    
 	Beer = new Schema({
	    brand       : String,
  		type        : [Type],
  		brewery_age : Number,
  		rating      : Number
    }).method('increaseRating', function(){
      this.rating += 1;
      return this.rating;
    }).method('decreaseRating', function(){
      this.rating -= 1;
      return this.rating;
    });
 /**   
module.exports = {
    
    getMyBeers: function(callback){
    	Beer.find({}, function(err, myBeers){
    	 callback(null, myBeers);
    	 });
    }
    }
    	
    	**/

module.exports = mongoose.model('Beer', Beer);
