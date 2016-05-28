var mongoose = require('mongoose');

// State Schema
var stateSchema = mongoose.Schema({
	name: {
		type: String
	},
	code:{
		type: String
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

var State = module.exports = mongoose.model('State', stateSchema);

// Get States
module.exports.getStates = function(callback, limit){
	State.find(callback);
}

// Get States
module.exports.getState = function(stateCode, callback, limit){
	State.find({code: stateCode},
		{
			name: 1,
			type: 1,
			code: 1,
			loc: 1,
			_id: 0
		},callback);
}

module.exports.getAdjacentStatesToState = function(stateCode, callback, limit) {
	State.findOne({code: stateCode}, function(err, state){
		var state = state;

		State.find({
			loc: {
				$geoIntersects:{
					$geometry: state.loc
				}
			},
			code: {
				$ne: stateCode
			},
		},
		{
			name: 1,
			type: 1,
			code: 1,
			loc: 1,
			_id: 0
		}, callback).limit().sort([['name', 'ascending']]);
	});
}
