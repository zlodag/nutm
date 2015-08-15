angular.module("nutmApp")
.factory("User", function($resource,Token){
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
        nutmAuth.submit(auth, function(response) {
            //$scope.message = response.message;
            console.log('That worked!');
            Token.set(response.token);
        }, function(response){
            console.log('Well - that failed...');
            logout();
        });
    }
    var nutmAuth = $resource('/api/auth',{},{
        submit: {method: 'POST'}
    }),
    nutmAdmin = $resource('/api/user/:userId',{},{
        showUsers: {
            method: 'GET',
            headers:{
                'Authorization': function(){
                    if (Token.token) return 'JWT ' + Token.token;
                }
            },
            isArray: true
        }
    });
    // diff;
    // updateTime();
    // $interval(updateTime, 1000);

    return {
        get loggedIn(){return !!Token.token;},
        token: Token,
        login: login,
        logout: logout,
        admin: nutmAdmin
        //get diff(){return diff;}
    };
});