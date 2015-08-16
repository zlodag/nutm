angular.module("nutmApp")
.factory("API", function($resource){
    return {
        user: $resource('/api/user/:userId',{},{
        	update: {method:'PUT'}
        }),
        task: $resource('/api/task/:taskId'),
		building: $resource('/api/building/:buildingId'),
		ward: $resource('/api/ward/:wardId'),
        specialty: $resource('/api/specialty/:specialtyId')
    };
})
.factory("Token", function($window,jwtHelper){
    var set = function (t){
    	console.log('setting token');
        token = t;
        $window.sessionStorage.setItem("token", token);
        decode();
    },
    del = function(){
        token = null;
        $window.sessionStorage.removeItem("token");
        decode();
    },
    decode = function (){
        if (token) {
            decoded = jwtHelper.decodeToken(token);
            console.log('Logged in as %s', decoded.name);
        } else {
            decoded = null;
        }
    },
    token  = $window.sessionStorage.getItem("token"),
    decoded;

    decode();

    return {
    	get token(){return token;},
    	set: set,
    	del: del,
    	get decoded(){return decoded;}
    };
})
.factory("User", function(Token,$state,$http) {
    var logout = function() {
        console.log('Logging out...');
        Token.del();
        $state.go('login');
    },
    login = function(auth){
        $http.post('/authenticate', auth)
        .then(function(response) {
            //Token.set(response.data);
            $state.go('task');
        }, function(response){
            console.log('Error logging in...');
            logout();
        });
    };

    return {
        get info(){return Token.decoded;},
        logout: logout,
        login: login,
        get loggedIn(){
        	return (Token.decoded && Token.decoded.sub);
        }
    };
});
