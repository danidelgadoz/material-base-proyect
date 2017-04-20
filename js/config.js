app.constant('APP_API_URL', 'http://localhost:8000/api/');
app.constant('DEVELOPMENT_ENVIRONMENT', true);
app.constant('GMAP_KEY', 'AIzaSyDSdD9RHz1vrCg7zHc03_JeYkblx1KiJiE');

// AngularJS config
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
  $locationProvider.html5Mode(false);
}]);

app.config(['$qProvider', function ($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}]);

app.config(['$httpProvider', function($httpProvider){
  $httpProvider.interceptors.push(['$q', 'SecurityService', '$location', function($q, SecurityService, $location) {
    return {
      'request': function(config) {
        SecurityService.secureRequest(config);
        return config;
      },

      'requestError': function(rejection) {
        // do something on error
        /*if (canRecover(rejection)) {
          return responseOrNewPromise
        }*/
        return $q.reject(rejection);
      },

      'response': function(response) {
        if(response.data.auth == false){ //Gn7 Apis will return false just when token send invalid...
          console.log("No se encontro autorizacion...");
          SecurityService.end();
          $location.url("/login");
        }
        return response;
      },

     'responseError': function(rejection) {
        // do something on error
        /*if (canRecover(rejection)) {
          return responseOrNewPromise
        }*/
        return $q.reject(rejection);
      }
    };
  }]);
}]);

// Angular Material Config
app.config(['$mdThemingProvider', function($mdThemingProvider){
  // Configuracion de los temas...
  $mdThemingProvider.definePalette('fuse', 
      $mdThemingProvider.extendPalette('blue-grey', {
        '50': '#7a869f',  //55%
        '100': '#6b7894', //50%
        '200': '#606c85', //45%
        '300': '#566076', //40%
        '400': '#4b5468', //35%
        '500': '#404859', //30%
        '600': '#2d323e', //21%
        '700': '#282c37', //19% this is fuse theme
        '800': '#20242c', //15%
        '900': '#15181e', //10%

        'contrastDefaultColor': 'light',
        'contrastDarkColors': undefined, //hues which contrast should be 'dark' by default               
        'contrastLightColors': undefined,   // could also specify this if default was 'dark'
      })
  );

  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue', {
      'default': '600', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '50', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    .accentPalette('pink')
    .backgroundPalette('grey')
    .warnPalette('red');
    // .dark();

  $mdThemingProvider.theme('FuseSideNavTheme')
    .primaryPalette('blue')
    .accentPalette('blue')
    .backgroundPalette('fuse', {
      'default': '600',//md-subhearder color for dark theme
      'hue-1': '600'//md-content color for dark theme
    })
    .warnPalette('red')
    .dark();
}]);

app.config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('YYYY-MM-DD');
    };
}]);
