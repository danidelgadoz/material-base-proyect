app.controller('loginCtrl', [
  '$scope', '$rootScope', '$location', 'Session', 'SecurityService',
  function($scope, $rootScope, $location, Session, SecurityService) {
  if(localStorage.getItem('gn7_token'))
    $location.url("/dashboard");

  $scope.loginAlert = {message: null, style: {'color':'blue'}};
  $scope.logindisabled=false;
  
  if($rootScope.devolperTestEnviroment == false)
    $scope.user = {email: null, password: null};
  else
    $scope.user = {email: 'dedd1993@gmail.com', password: '123456'};  

  $scope.login = function() {
    $scope.logindisabled=true; 
    $scope.loginAlert = {message: "Verificando los datos.", style: {'color':'blue'}};
    
    Session.login($scope.user).then(function successCallback(response) {
      if(response.data.auth == true){
          SecurityService.init(response.data.data);

      }else{
        $scope.loginAlert = { message: response.data, style: {'color':'red'}};
        $scope.logindisabled=false;
      }

    });
  };
}]);