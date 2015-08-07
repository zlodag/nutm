var app = angular.module("nutmApp",["ngResource","ui.router"]);
app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('auth', {
      url: '/login',
      templateUrl: '/templates/auth.html',
      controller: 'authController'
    });

  $urlRouterProvider.otherwise('login');
});