var app = angular.module("nutmApp",["ngResource","ui.router"]);
app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('auth', {
            url: '/login',
            templateUrl: '/templates/auth.html',
            controller: 'authController'
        })
        .state('task', {
            url: '/tasks',
            templateUrl: '/templates/tasks.html',
            controller: 'taskController',
            resolve: {
                postPromise: function(tasks){
                    tasks.getAll();
                }
            }
        })
        .state('taskDetail', {
            url: '/tasks/:taskId',
            templateUrl: '/templates/taskDetail.html',
            controller: 'taskDetailController'
        })
        .state('user', {
            url: '/user/:userId',
            templateUrl: '/templates/user.html',
            controller: 'userController',
            // resolve: {
            //     postPromise: function(tasks){
            //         tasks.getAll();
            //     }
            // }
        })
        .state('location', {
            url: '/location',
            templateUrl: '/templates/location.html',
            controller: 'locationController',
            controllerAs: 'locationCtrl'
        })
        .state('location.building', {
            url: '/:buildingId',
            templateUrl: '/templates/building.html',
            controller: 'buildingController',
            controllerAs: 'buildingCtrl'
        })
        .state('ward', {
            url: '/ward/:wardId',
            templateUrl: '/templates/ward.html',
            controller: 'wardController'
        });
    $urlRouterProvider.otherwise('login');
});