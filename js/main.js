// Creación del módulo
var app = angular.module('MyAngularAppName', [
        'ngAnimate',
        'ngAria',
        'ngMessages',        
        'ngMaterial',
        'ui.router',
        'md.data.table'
  ]);

app.run([
  '$rootScope', '$location',
  function($rootScope, $location){
    $rootScope.user = {
      name : localStorage.getItem('session_username') ? localStorage.getItem('session_username'): 'Invitado',
      type : localStorage.getItem('session_type'),
      token: localStorage.getItem('session_token'),
    };
  }
]);


/*app.controller('waitCtrl', ['$mdDialog', '$rootScope', function waitCtrl($mdDialog, $rootScope) {
    var vm = this;

    $rootScope.$on("hide_wait", function (event, args) {
        $mdDialog.cancel();
    }); 

}]);*/