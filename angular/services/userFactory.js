angular.module("nutmApp")
.factory("User", function($http,Token){
    // function updateTime(){
    //     if (Token.token) {
    //         var exp = Token.decoded.exp;
    //         var now = Math.floor(Date.now()/1000);
    //         if (exp <= now) {
    //             //console.log('Time expired: logging out');
    //             //logout();
    //         } else {
    //             diff = exp - now;
    //             console.log(diff);
    //         }
    //     }
    // }
    function logout() {
        Token.del();
    }
    function login(auth){
        $http.post('/authenticate', auth)
        .then(function(response) {
            //$scope.message = response.message;
            console.log('That worked!');
            Token.set(response.data);
        }, function(response){
            console.log('Well - that failed...');
            logout();
        });
    }
    // var nutmAdmin = $resource('/api/user/:userId');
    // diff;
    // updateTime();
    // $interval(updateTime, 1000);
    // var detail;

    return {
        get loggedIn(){return Token.exists();},
        get token(){return Token.decoded()},
        login: login,
        logout: logout
        // admin: nutmAdmin
        //get diff(){return diff;}
    };
});
