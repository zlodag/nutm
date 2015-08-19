var app = angular.module("handover", ["firebase"])
.factory("Auth",function($firebaseAuth, $window){
    return $firebaseAuth(new $window.Firebase("https://handover.firebaseio.com"));
})
.factory("Tasks",function($firebaseArray, $window){
    return $firebaseArray(new $window.Firebase("https://handover.firebaseio.com/tasks"));
})
.factory("Wards",function($firebaseObject, $window){
    return $firebaseObject(new $window.Firebase("https://handover.firebaseio.com/wards"));
})
.factory("Specialties",function($firebaseObject, $window){
    return $firebaseObject(new $window.Firebase("https://handover.firebaseio.com/specialties"));
})
.controller("TaskCtrl", function ($scope,$window,Auth,Tasks,Wards,Specialties) {

    // var ref = new Firebase("https://handover.firebaseio.com/wards");
    // ref.once("value", function(data) {
    //     $scope.testme = data.val();
    // });

    // any time auth status updates, add the user data to scope
    Auth.$onAuth(function(authData) {
      $scope.authData = authData;
      if(authData){
            $scope.tasks = Tasks;
            $scope.wards = Wards;
            $scope.specialties = Specialties;
            console.log("Logged in as:", authData.uid);
        } else {
            // Tasks.$destroy();
            // Wards.$destroy();
            // Specialties.$destroy();
            console.error("Not logged in");
        }
    });

    $scope.authMe = function (provider) {
        Auth.$authWithOAuthPopup(provider);
    };
    $scope.unauthMe = function () {
        Auth.$unauth();
    };

    $scope.newTask = {
        "patient": {
          "bed": "A12",
          "name": "Bob Geldof",
          "nhi": "LKJ1234",
          "specialty": "Obstetrics & Gynaecology",
          "ward": "AMU"
        },
        "text": "Adventure time",
        "urgency": 3,
      };

    $scope.addTask = function (task) {
        if (!$scope.authData) {
            console.log('Not logged in!');
            return false;
        }
        if ($scope.form.$invalid) {
            console.log('Invalid form!');
            return false;
        }
        var modifiedTask = angular.extend({
            added: {
                user: $scope.authData.uid,
                timestamp: $window.Firebase.ServerValue.TIMESTAMP
            }
        }, task);
        // console.log(JSON.stringify(modifiedTask));
        $scope.tasks.$add(modifiedTask);
    };
    $scope.updateTask = function(taskId,type,reason){
        var update = {
            reason: reason || null,
            user: $scope.authData.uid,
            timestamp: $window.Firebase.ServerValue.TIMESTAMP
        };
        Tasks.$ref().child(taskId + '/' + type).set(update);
    };

});
