app.service('SecurityService', ['$rootScope', '$location', function($rootScope, $location) {
  this.init = function(response) {
    localStorage.setItem("session_username", response.name);
    localStorage.setItem("session_token", response.remember_token);
    localStorage.setItem("session_type", 'ADMIN');

    $rootScope.user.name = response.name;
    $rootScope.user.token = response.remember_token;
    $rootScope.user.type = 'ADMIN';
    $location.url("/dashboard");
  };

  this.end = function() {
    localStorage.clear();

    $location.url("/login");
    // location.reload();
    return;
  };

  this.getToken = function() {
      return localStorage.getItem('session_token');
  };

  this.secureRequest = function(requestConfig) { //look in config Service
    var token = this.getToken();

    if(token != null && token != '' && token != 'undefined') {      
      requestConfig.headers['Authorization'] = 'Bearer ' + token;
    } else{
      //$location.url("/login");
    }
  };
}]);

app.service('myAlertServ', ['$mdDialog', function($mdDialog){
  this.aviso = function(tit, msj){    
    $mdDialog.show(
      $mdDialog.alert()
        .title(tit)
        .textContent(msj)
        .ariaLabel('Navigation demo')
        .ok('OK')
        .targetEvent(null)
    )
  };
}]);

app.service('LoadBackdrop', ['$mdDialog', '$rootScope', function ($mdDialog,  $rootScope){      
    return {
        hideWait: function () {            
               $rootScope.$emit("hide_wait");            
        },
        showWait: function (_loadingMessage, _ngElement) {
            var loadingMessage = _loadingMessage ? _loadingMessage : "";
            var ngElement = _ngElement ? _ngElement : document.querySelector('#appContent');

            $mdDialog.show({
                // controller: 'waitCtrl',
                controller: function ($mdDialog, $rootScope) {
                    var vm = this;
                    $rootScope.$on("hide_wait", function (event, args) {
                        $mdDialog.cancel();
                    });
                },
                template: `<md-dialog id="plz_wait" style="background-color:transparent;box-shadow:none;min-height:60px;">
                                <div layout="column" layout-align="center center" aria-label="wait">
                                    <md-progress-circular md-mode="indeterminate" md-diameter="90"></md-progress-circular>
                                    <div class="loading-text" layout-padding>${loadingMessage}</div>
                                </div>
                         </md-dialog>`,
                parent: angular.element(ngElement),
                clickOutsideToClose:false,
                fullscreen: false,
                multiple: true
            })
            .then(function(answer) {            
            });
        }
    }
}]);