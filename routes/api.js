var config = require('../config');
var superagent = require('superagent');
var async = require('async');

module.exports = function (app) 
{
	app.get('/characters/search' , function(req, res) {
		superagent
		.get(config.api.base)
		.query({api_key: config.api.key})
		.query({filter: 'name:' + req.query.name})
		.query({field_list:'name,deck,image,id'})
		.query({format: 'json'})
		.end(function(err, result){
			var parsed = result.body;
			if(typeof parsed.results[0] == 'undefined')
			{
				var main = {name: 'Error', deck: 'Could not find a character by that name. Try another name', image:{small_url: '/error.jpg'}, error: 'Error'};
      			var searchResults = [{results: main}];
				res.json(searchResults[0]);
			}
			else
			{
				res.json(parsed);
			}
		});
	});

	app.get('/characters/details', function(req, res)
	{
		var det = (config.api.details + req.query.id); 
		var fields = 'name,powers,deck,image,origin,publisher,character_friends,character_enemies,id'
		superagent
		.get(det)
		.query({api_key: config.api.key})
		.query({field_list: fields})
		.query({format: 'json'})
		.end(function(err, result){
			if(err || result.statusCode !== 200)
			{
				console.log("Uh-oh, Error was caught. Character's details are unavailable.")
				res.send(err);
			}
			else
			{
				var parsed = result.body;
				console.log('Details for ' + parsed.results.id + ' were found.');
				res.json(parsed);
			}
		});
	});

	app.get('/characters/versus', function(req, res)
	{	
		async.parallel({
			mainDetails: function(next){
				_characterDetails(req.query.main, next);
			},
			challengerDetails: function(next)
			{
				_characterDetails(req.query.challenger, next);
			}
			}	, function done(err, results)
			{
				if(err)
				{
					res.json(err);
				}
				else
				{
					res.json(results);
				}
			});
	});
};

function _characterDetails(id, callback)
{
	var det = (config.api.details + id); 
	var fields = 'name,powers,deck,image,origin,publisher,character_friends,character_enemies,id,teams'
	superagent
	.get(det)
	.query({api_key: config.api.key})
	.query({field_list: fields})
	.query({format: 'json'})
	.end(function(err, result){
		callback(err, result.body.results);
	});
}
