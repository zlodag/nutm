var app = angular.module("nutmApp",["ngResource","ui.router","angular-jwt","ui.bootstrap"]);
app.config(function(
           $stateProvider,
           $urlRouterProvider,
           jwtInterceptorProvider,
           $httpProvider
) {
    jwtInterceptorProvider.tokenGetter = ['Token','config', function(Token,config) {
        // console.log(config);
        if (
            (config.url.substr(config.url.length - 5) === '.html') ||
            (config.url === '/authenticate')
            ) {
            // console.log('Not sending token to %s', config.url);
            return null;
        }
        // console.log('Sending token to %s', config.url);
        return Token.get();
    }];
    $httpProvider.interceptors.push('jwtInterceptor');
    $urlRouterProvider.otherwise('login');
    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: '/templates/login.html',
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
            controller: 'userController'
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
})
.run(function($rootScope, $state, Token, jwtHelper) {
    $rootScope.$on('$stateChangeStart', function(e, to) {
        // console.log('State changed from %s to %s', e.data.requiresLogin, to.data, Token.token);
        // console.log(to);
        if (to.name !== 'login') {
            // console.log('Checking token is valid...');
            var token = Token.get();
            if (!token || jwtHelper.isTokenExpired(token)) {
                e.preventDefault();
                console.log('You need a valid token for that!');
                $state.go('login');
            } else {
                // console.log('It appears the token was valid!');
            }
        }
        console.log('Going to login page...');
    });
});
