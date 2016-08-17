var app = angular.module('app', ['ngResource']);

app.factory('resources', function($resource, $location) {
  var url = $location.absUrl().split('/');
  var comicID=url[url.length-1];
  var factory = {};

  var mainID = url[url.length-3];
  var challengerID = url[url.length-1];
  
  factory.routes = {
    comicAPI: $resource('/characters/:action', {}, {
      fetch: {method: 'GET', params: {name: '@name', action: 'search'}, isArray: false },
      details: {method: 'GET', params:{id: comicID, action: 'details'}, isArray: false },
      versus: {method:'GET', params:{main: mainID, challenger: challengerID, action: 'versus'}, isArray: false}
    })
  };


  return factory;
});

app.controller('characterController', function($scope, resources) {

  $scope.searchCharacters = function() {
    resources.routes.comicAPI.fetch({name: $scope.name}, function done(response) {

      if(response.results.length >= 1)
      {
        $scope.comic = {main: response.results[0], alt: response.results};
      }
      else
      {
        $scope.comic = {main: response.results, alt: ''}
      } 

    });
  };

  $scope.changeCharacter = function(id, results)
  {
    for(i = 0; i < results.length; i++)
    {
      if(results[i].id == id)
      {
        $scope.comic = {main: results[i], alt: results};
        break;
      }
    }
  }
});

app.controller('detailController', function($scope, resources){
  function init()
  {
    resources.routes.comicAPI.details(function done(response){

      if(typeof response.results == 'undefined' || typeof response.results == null)
      { 
        Error = {error: "Error Detected", desc: "Unfortunately this character's details are unavailable right yyyynow.", img:"/error.jpg"};
        $scope.err = Error;
      
        console.log("Uh-oh, Error was caught. Character's details are unavailable.")

      }
      else
      {
        console.log("Character's details were found!");
        $scope.character = response.results;
        $scope.friendButtonText = '+ Show Friends';
        $scope.enemyButtonText = '+ Show Enemies';
        $scope.powerButtonText = '+ Show Powers';
      }

    });
  }

  init();
  $scope.togglePowers = function()
  {
    if($scope.displayPowers)
    {
      $scope.powerButtonText = '+ Show Powers';
      $scope.displayPowers = false;
    }
    else
    {
      $scope.powerButtonText = '- Hide Powers';
      $scope.displayPowers = true;
    }
  }

  $scope.toggleFriends = function()
  {
    if($scope.displayFriends)
    {
      $scope.friendButtonText = '+ Show Friends';
      $scope.displayFriends = false;
    }
    else
    {
      $scope.friendButtonText = '- Hide Friends';
      $scope.displayFriends = true;
    }
  }

  $scope.toggleEnemies = function()
  {
    if($scope.displayEnemies)
    {
      $scope.enemyButtonText = '+ Show Enemies';
      $scope.displayEnemies = false;
    }
    else
    {
      $scope.enemyButtonText = '- Show Enemies';
      $scope.displayEnemies = true;
    }
  }
});

app.controller('versusController', function($scope, resources)
{
  function init()
  {
    resources.routes.comicAPI.versus(function done(response)
    {
      $scope.character = response;
      console.log(response);
    })
  }
  init();
})