var request = require('superagent');
var superagent = require('superagent');
var config = require('../config');


var url = 'http://www.comicvine.com/api/character/'
var friends='http://www.comicvine.com/api/character/4005-1444/';
var key = '00c82de7626b7d7880f5d5594aca2d17775a3857'
var name = 'spider';


request.get('/', function(err, res){
  superagent
  .get(friends)
  .query({api_key: config.api.key})
  .query({format: 'json'})
  .end(function(err, result){
    var parsed = JSON.parse(result.text);
   //   var parsed = JSON.parse(result.text);
 //     parsed.results[0].description ='';
 	
     console.log(parsed.results.name);
  });
});
