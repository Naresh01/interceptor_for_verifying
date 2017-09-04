app
   .controller('PopulationsCtrl', PopulationsCtrl)
   .controller('LoginCtrl', LoginCtrl);

function PopulationsCtrl($scope, RestAPIService) {

    // Init
    init();

    function init() {
        RestAPIService.getUsers().then(function(result){
            $scope.Users = {};
            $scope.Users = result.data;
        });
    }
}

function LoginCtrl($scope, $state, AuthenticationService) {
    $scope.login = function(user){
        AuthenticationService.Login(user.username, user.password, function (result) {
            if (result.success === true) {
                 $state.go("app.populations");
            } else {
                $scope.ErrorMsg = {message: result.message, type: 'error'};
            }
        });
    }
}