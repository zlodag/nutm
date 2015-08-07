angular.module("nutmApp")
.factory("Token", function($window,$timeout){
    function decode(){
        if (token) {
            try {
                decoded = JSON.parse(atob(token.split(".")[1]));
                var exp = decoded.exp*1000;
                var milliseconds = exp - Date.now();
                timer = $timeout(function(){
                    console.log('Automatically logged out at %s', new Date());
                    del();
                }, milliseconds);
                console.log('You will be automatically logged out at %s', new Date(exp));
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
});