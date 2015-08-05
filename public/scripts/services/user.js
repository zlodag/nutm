angular.module("nutmApp")
.factory("Token", function($window){
    var token = $window.sessionStorage.getItem("token");
    return {
        get: function(){
            return token;
        },
        set: function(t){
            token = t;
            $window.sessionStorage.setItem("token", token);
        },
        del: function(){
            token = null;
            $window.sessionStorage.removeItem("token");
        },
        decode: function(){
            if (token) {return JSON.parse(atob(token.split(".")[1]));}
            else {return null;}
        }
    };
})
.factory("User", function($resource,Token){

    function logout() {
        Token.del();
    }
    function login(auth){
        nutmAuth.submit(auth, function(response) {
            //$scope.message = response.message;
            if (response.success === true) {
                Token.set(response.token);
            } else {
                logout();
            }
        });
    }
    nutmAuth = $resource('/authenticate',{},{
        submit: {method: 'POST'}
    });
    nutmAdmin = $resource('/users/:userId',{},{
        showUsers: {method: 'GET', headers:{'X-Access-Token':function(){
            return Token.get();
        }}}
    });

    return {
        get user(){return Token.decode();},
        login: login,
        logout: logout,
        admin: nutmAdmin
    };
});