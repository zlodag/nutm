angular.module("nutmApp").factory("nutmAuth",function($resource){
    return $resource('/authenticate');
});
