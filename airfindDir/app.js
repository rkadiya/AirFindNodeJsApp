var express = require('express');
var express_geocoding_api = require('express-geocoding-api');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

Airport = require('./models/airport.js');
State = require('./models/state.js');

app.use(express_geocoding_api({
	geocoder:{
		provider: 'google'
	}
}));

//mongoose connect
mongoose.connect('mongodb://localhost/airfind');
var db = mongoose.connection;

app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());

app.get('/api', function(req, res){
	res.send('Please use /api/airports or /api/states endpoints');
});

app.get('/api/airports', function(req, res){
	Airport.getAirports(function(err, docs){
		if(err){
			res.send(err);
		}
		res.json(docs);
	});
});

app.post('/api/airports/prox', function(req, res){
	var location = req.body;
	Airport.getAirportsByProximity(location, function(err, docs){
		if(err){
			res.send(err);
		}
		res.json(docs);
	});
});

app.post('/api/airports/nearest', function(req, res){
	var location = req.body;
	Airport.getLocationFromAddress(location, function(response){
		var str = '';

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
		  str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
		  newStr = JSON.parse(str);
		  var obj = new Object();
		  obj.lon = newStr['locations'][0]['longitude'];
		  obj.lat = newStr['locations'][0]['latitude'];
		  obj.distance = location.distance;
		  Airport.getNearestAirportByAddress(obj, function(err, docs){
				if(err){
					res.send(err);
				}
				res.json(docs);
			});
		});
	});
});

app.post('/api/airports/nearestInternational', function(req, res){
	var location = req.body;
	Airport.getLocationFromAddress(location, function(response){
		var str = '';

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
		  str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
		  newStr = JSON.parse(str);
		  var obj = new Object();
		  obj.lon = newStr['locations'][0]['longitude'];
		  obj.lat = newStr['locations'][0]['latitude'];
		  obj.distance = location.distance;
		  Airport.getNearestInternationalAirportByAddress(obj, function(err, docs){
				if(err){
					res.send(err);
				}
				res.json(docs);
			});
		});
	});
});

app.post('/api/airports/address/prox', function(req, res){
	var location = req.body;
	Airport.getLocationFromAddress(location, function(response){
		var str = '';

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
		  str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
		  newStr = JSON.parse(str);
		  var obj = new Object();
		  obj.lon = newStr['locations'][0]['longitude'];
		  obj.lat = newStr['locations'][0]['latitude'];
		  obj.distance = location.distance;
		  Airport.getAirportsByAddressProximity(obj, function(err, docs){
				if(err){
					res.send(err);
				}
				res.json(docs);
			});
		});
	});
});

app.post('/api/airports/locationFromAddress', function(req, res){
	var address = req.body;
	Airport.getLocationFromAddress(address, function(response){
		var str = '';

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
		  str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
		  newStr = JSON.parse(str);
		  res.json(newStr);
		});
	});
});

app.get('/api/states', function(req, res){
	State.getStates(function(err, docs){
		if(err){
			res.send(err);
		}
		res.json(docs);
	});
});

app.get('/api/states/state/:state', function(req, res){
	State.getState(req.params.state,function(err, docs){
		if(err){
			res.send(err);
		}
		res.json(docs);
	});
});

app.get('/api/airports/state/:state', function(req, res){
	Airport.getAirportByState(req.params.state,function(err, docs){
		if(err){
			res.send(err);
		}
		res.json(docs);
	});
});

app.get('/api/adjacentstates/state/:state', function(req, res){
	State.getAdjacentStatesToState(req.params.state,function(err, docs){
		if(err){
			res.send(err);
		}
		res.json(docs);
	});
});

app.listen(3000);
console.log('App started on port 3000');
