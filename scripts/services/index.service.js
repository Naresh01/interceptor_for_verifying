(function() {
    'use strict';

    app.factory('AuthenticationService', Service)
        .factory('RestAPIService', RestAPIService);

    function Service($http, $cookieStore, $rootScope) {
        var service = {};
        service.Login = Login;

        return service;
        function Login(username, password, callback) {
            var response;
            // For testing static token here to add all after login API for validating logged in user
            var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOjEsInJvbGUiOiJTdXBlckFkbWluIiwiZXhwIjoxNTAzNzk2MTcxNDEwfQ.wdf3e8kAVPxR7eeEHm-FVh76Lw0nzLxPoL4wd12R0Dc";
            if (username == 'admin' && password == 'admin') {
                $cookieStore.put('currentUser',{ username: username, token: token });
                response = { success: true, message: 'successful login' };
                callback(response);
            } else {
                response = { success: false, message: 'ERROR : Username or password do not match !' };
                callback(response);
            }
        }
    }

    function RestAPIService($q, $http) {
        var service = {};
        service.getUsers = getUsers;

        return service;
        function getUsers(page) {
            return get('https://reqres.in/api/users?page='+page);
        }

        function get(targetUrl, json) {
       		var deferred = $q.defer();
       		$http({
       			url : targetUrl,
       			method : "GET",
       			params : json
       		}).success(function(data, status, headers, config) {
       			deferred.resolve(data);
       		});
       		return deferred.promise;
       	}
    }
})();