var app = angular.module('myapp', ["ui.router", "ngResource", "ngCookies"])
.run(
    ['$rootScope', '$state', "$cookieStore", "$location",
        function($rootScope, $state, $cookieStore, $location) {

            $rootScope.$on('$stateChangeStart', function(event, nextLoc, currentLoc) {
                $rootScope.authToken = $cookieStore.get('currentUser');
            });

            var openToPublic = (-1 === $location.path().indexOf('/app'));
            if (!openToPublic) {
                if ($cookieStore.get('currentUser') == undefined) {
                    $location.path("/login");
                } else {
                    $location.path();
                }
            }

            $rootScope.logout = function() {
                $cookieStore.remove('currentUser');
                $state.go("login");
            }
        }
    ]
)
.config(function($stateProvider, $urlRouterProvider, $httpProvider){
      $httpProvider.interceptors.push(function($q, $rootScope, $location) {
                      return {
                          'request': function(config) {
                              var isRestCall = (config.url.indexOf('/api/') >= 0);
                              if (isRestCall && angular.isDefined($rootScope.authToken)) {
                                      config.headers["X-Auth-Token"] = $rootScope.authToken.token;
                              }
                              return config || $q.when(config);
                          },
                          'responseError': function(rejection) {
                              var status = rejection.status;
                              var config = rejection.config;
                              var method = config.method;
                              var url = config.url;
                              if (status == 401) {
                                  $location.path("/login");
                              }else if(status == 400){
                                  $rootScope.logout();
                              } else {
                                  $rootScope.error = method + " on " + url + " failed with status " + status;
                              }
                               rejection.status = 401;
                              return $q.reject(rejection);
                          }
                      };
                  });

      $urlRouterProvider.otherwise('/login')

      $stateProvider
        .state('login', {
          url: "/login",
          templateUrl: "views/login.html",
          controller: 'LoginCtrl as vm'
        })
        .state('app', {
          url: '/app',
          templateUrl: 'views/partial-home.html'
        })
        .state('app.populations', {
          url: "/populations",
          views: {
              'content': {
                  templateUrl: "views/populations.html",
                  controller: 'PopulationsCtrl as pc'
              }
          }
      });

    });