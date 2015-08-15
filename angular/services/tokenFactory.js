angular.module("nutmApp")
.factory("Token", function($window,jwtHelper){
    var token, decoded,
    set = function (t){
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
        } else {
            decoded = null;
        }
    };

    token  = $window.sessionStorage.getItem("token");
    decode();

    return {
        get: function(){return token;},
        decoded: function(){return decoded;},
        set: set,
        del: del,
        exists: function(){return !!token;},
    };
});
