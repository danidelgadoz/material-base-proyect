/**
 * Avoid modifying this controller, the code written here is just
 * dashboard configuration (it'll be in directives soon).
 *
 * Just necesary to declare the submenus  
 */

app.controller('dashboardNavCtrl', [
  '$scope','$mdMedia', '$timeout', '$location', '$mdSidenav', 'SecurityService',
  function ($scope, $mdMedia, $timeout, $location, $mdSidenav, SecurityService) {
    $scope.$mdMedia = $mdMedia;
    $scope.navState = true;

    // Begin scripts for sidenav-content
    $scope.toggleLeft = buildDelayedToggler('left');  
    $scope.isOpenSideNav = function () { 
      return $mdSidenav('left').isOpen();
    };
    $scope.isLockedOpenSideNav = function(){
        return $mdSidenav('left').isLockedOpen();
    }
    $scope.closeSideNav = function () {
      $mdSidenav('left').close()
        .then(function () {
        });
    };
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    };
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
          });
      }, 300);
    };
    // End

    // Begin scripts for sidenav-menu-submenu-list
    $scope.subMenu = {
        collapse: function(item){
          for(var arrayItem in $scope.subMenuList){
            if(arrayItem != item )
              $scope.subMenuList[arrayItem].collapse = false;
          }
          $scope.subMenuList[item].collapse = !$scope.subMenuList[item].collapse;
        },
        getIconCollapse: function(item){
          var icon = ($scope.subMenuList[item].collapse == true) ? 'expand_less' : 'expand_more';
          return icon;
        },
        getItemStyle: function(item){
          var style = ($scope.subMenuList[item].collapse == true) ? {'background-color':'rgba(0,0,0,.12)'} : null;
          return style;
        }
    };
    // End

    $scope.logout = function(){
      SecurityService.end();
    };

    // sidenav-menu-submenu-list declaration    
    $scope.subMenuList = {
      'indicadores'   : {'collapse': $location.url().startsWith('/indicador') },
      'usuarios'      : {'collapse': false},
    };
  }
]);