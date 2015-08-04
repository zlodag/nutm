angular.module("nutmApp")
.factory("nutmAuth",function($resource){
    return $resource('/authenticate',{},{
        submit: {method: 'POST'}
    });
})
.factory("nutmAdmin",function($resource){
    return $resource('/users/:userId',{},{
        showUsers: {method: 'GET', headers:{'X-Access-Token':function(){
            return this.sessionStorage.token        }}}
    });
})
;
