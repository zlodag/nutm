angular.module("nutmApp")
.factory("Token", function($window,$timeout){
    function decode(){
        if (token) {
            try {
                decoded = JSON.parse(atob(token.split(".")[1]));
                var exp = decoded.exp*1000;
                var milliseconds = exp - Date.now();
                timer = $timeout(function(){
                    console.log('Automatically logged out');
                    del();
                }, milliseconds);
                console.log('Automatic logout at %s', new Date(exp));
            }
            catch(err) {
                console.log(err);
                del();
            }
        } else {
            decoded = null;
            $timeout.cancel(timer);
        }
    }
    function init(){
        token = $window.sessionStorage.getItem("token");
        decode();
    }
    function set(t){
        del();
        token = t;
        $window.sessionStorage.setItem("token", token);
        decode();
    }
    function del(){
        token = null;
        $window.sessionStorage.removeItem("token");
        decode();
    }

    var token, decoded, timer;

    init();

    return {
        get token(){
            return token;
        },
        set: set,
        del: del,
        get decoded(){
            return decoded;
        }
    };
})
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
            if (response.success === true) {
                Token.set(response.token);
            } else {
                logout();
            }
        });
    }
    var nutmAuth = $resource('/authenticate',{},{
        submit: {method: 'POST'}
    }),
    nutmAdmin = $resource('/users/:userId',{},{
        showUsers: {method: 'GET', headers:{'X-Access-Token': function(){return Token.token;}}}
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