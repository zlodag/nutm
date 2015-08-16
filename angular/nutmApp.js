var app = angular.module("nutmApp",["ngResource","ui.router","angular-jwt","ui.bootstrap"]);
app.config(function(
           $stateProvider,
           $urlRouterProvider,
           $httpProvider
) {
    // jwtInterceptorProvider.tokenGetter = ['Token','config', function(Token,config) {
    //     // console.log(config);
    //     if (
    //         (config.url.substr(config.url.length - 5) === '.html') ||
    //         (config.url === '/authenticate')
    //         ) {
    //         // console.log('Not sending token to %s', config.url);
    //         return null;
    //     }
    //     // console.log('Sending token to %s', config.url);
    //     return Token.get();
    // }];
    // $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push(['$q','Token','$rootScope',function($q,Token,$rootScope){
        return {
            request: function(config){
                if (config.url.indexOf('/api/') === 0) {
                    var token = Token.token;
                    if (token) {
                        config.headers.Authorization = 'Bearer ' + token;
                        // console.log('Attached token to header');
                    }
                }
                return config;
            },
            response: function(response){
                if (response.config.url === '/authenticate' && response.data) {
                    // console.log('Obtained token');
                    Token.set(response.data);
                }
                return response;
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    $rootScope.$broadcast('AuthError', 'warning', 'You need to log in again, sorry.');
                    //User.logout();
                    // console.log('Rejection', rejection);
                }
                // if (canRecover(rejection)) {
                //     return responseOrNewPromise
                // }
                return $q.reject(rejection);
            }
        };
    }]);
    $urlRouterProvider.otherwise('login');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: '/templates/login.html',
        })
        .state('task', {
            url: '/tasks',
            templateUrl: '/templates/tasks.html',
            controller: 'taskController',
            resolve: {
                tasks : function(API){ return API.task.query(); }
            }
        })
        .state('newTask', {
            url: '/newTask',
            templateUrl: '/templates/newTask.html',
            controller: 'newTaskController',
            resolve: {
                wards : function(API){ return API.ward.query(); },
                specialties : function(API){ return API.specialty.query(); }
            }
        })
        .state('admin', {
            url: '/admin',
            templateUrl: '/templates/admin.html',
            controller: 'adminController'
        })
        .state('taskDetail', {
            url: '/tasks/:taskId',
            templateUrl: '/templates/taskDetail.html',
            controller: 'taskDetailController',
            resolve: {
                task : function(API,$stateParams){ return API.task.get($stateParams); }
            }
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
});
// .run(function($rootScope, $state, User, jwtHelper) {
//     // $rootScope.$on('$stateChangeStart', function(e, to) {
//     //     // console.log('State changed from %s to %s', e.data.requiresLogin, to.data, Token.token);
//     //     // console.log(to);
//     //     if (to.name !== 'login') {
//     //         console.log('Checking token is valid...');
//     //         var token = Token.get();
//     //         if (!token || jwtHelper.isTokenExpired(token)) {
//     //             e.preventDefault();
//     //             console.log('You need a valid token for that!');
//     //             $state.go('login');
//     //         } else {
//     //             console.log('It appears the token was valid!');
//     //         }
//     //     }
//     //     console.log('Going to login page... (doesnt need a valid token');
//     // });
// });
