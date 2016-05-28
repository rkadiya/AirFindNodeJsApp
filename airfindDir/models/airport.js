var mongoose = require('mongoose');
var http = require('http');

State = require('./state.js');

// Airport Schema
var airportSchema = mongoose.Schema({
        name: {
		type:{
			type: String
		}
	},
        type:{
		type:{
			type: String
		}
        },
	code:{
		type:{
			type: String
		}
	},
	loc:{
		type:{
			type: String
		},
		coordinates: {
			type: Array
		}
	}
});

var Airport = module.exports = mongoose.model('Airport', airportSchema);

// Get Airports 
module.exports.getAirports = function(callback, limit){
	Airport.find(callback);
}

// Get Airports By State
module.exports.getAirportByState = function(stateCode, callback, limit){
	State.findOne({code: stateCode}, function(err, state){
		var state = state;

		Airport.find({
			loc: {
				$geoWithin:{
					$geometry: state.loc
				}
			}
		},
		{
			name: 1,
			code: 1,
			loc:1,
			_id: 0
		}, callback).limit().sort([['name', 'ascending']]);
	});
}


// Get Airports By Proximity
module.exports.getAirportsByProximity = function(location, callback, limit){
	Airport.find({
		loc:{
			$near: {
				$geometry:{
					type:"Point",
					coordinates:[location.lon,location.lat]
				},
				$maxDistance: location.distance * 1000
			}
		}
	},
	{
		name: 1,
		code: 1,
		loc:1,
		_id: 0
	}, callback).limit(limit);
}

// Get Airports By Proximity
module.exports.getAirportsByAddressProximity = function(location, callback, limit){

	Airport.find({
		loc:{
			$near: {
				$geometry:{
					type:"Point",
					coordinates:[location.lon,location.lat]
				},
				$maxDistance: location.distance * 1000
			}
		}
	},
	{
		name: 1,
		code: 1,
		loc:1,
		_id: 0
	}, callback).limit(limit);
}

// Get Airports By Proximity
module.exports.getNearestAirportByAddress = function(location, callback, limit){

	Airport.find({
		loc:{
			$near: {
				$geometry:{
					type:"Point",
					coordinates:[location.lon,location.lat]
				},
				$maxDistance: 50000
			}
		}
	},
	{
		name: 1,
		code: 1,
		loc:1,
		_id: 0
	}, callback).limit(1);
}

// Get Airports By Proximity
module.exports.getNearestInternationalAirportByAddress = function(location, callback, limit){

	Airport.find({
		loc:{
			$near: {
				$geometry:{
					type:"Point",
					coordinates:[location.lon,location.lat]
				},
				$maxDistance: 500000
			}
		},
		type:"International"
	},
	{
		name: 1,
		code: 1,
		loc:1,
		_id: 0
	}, callback).limit(1);
}

// Get Airports By Proximity
module.exports.getLocationFromAddress = function(addressLocation, callback){
	var goodAddr = encodeURIComponent(addressLocation.address.trim());
	var options = {
		host: 'localhost',
		port: '3000',
		method: 'GET',
		path: '/geocode/location?address='+goodAddr,
		headers: {'Content-Type':'application/json'}
	}
	http.request(options, callback).end();
}
