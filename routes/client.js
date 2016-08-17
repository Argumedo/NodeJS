module.exports = function (app) {

  app.get('/', function(req, res) {
       	res.render('search');
  });

  app.get('/characters/:id', function(req, res){
  		res.render('details');
  });

  app.get('/characters/:main/versus/:challenger', function(req, res)
  {
  	res.render('versus');
  })

};
