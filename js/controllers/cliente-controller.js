app.controller('clienteCtrl', [
  '$q', '$scope', '$timeout', '$filter', 'Cliente', '$mdDialog', 'myAlertServ',
  function($q, $scope, $timeout, $filter, Cliente, $mdDialog, myAlertServ) { 
  'use strict';

    $scope.selected = [];
    $scope.limitOptions = [5, 10, 15];  
    $scope.options = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: true,
        limitSelect: true,
        pageSelect: true
    };
    $scope.query = {
        order: 'name',
        limit: 5,
        page: 1
    };
  
    $scope.list = function(){
        $scope.promise = Cliente.list($scope.query).then(function successCallback(response){
          $scope.selected = [];
          $scope.desserts = response.data.data;          
        });
    };
    $scope.list();

    $scope.toggleLimitOptions = function(){

        $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
    };
  
    $scope.logItem = function(item){

        console.log(item.correo, ' selected');
    };
  
    $scope.logOrder = function(order){

        console.log('order: ', order);
    };
  
    $scope.logPagination = function(page, limit){

        $scope.list();
    };

    $scope.create = function(ev){
        $mdDialog.show({
            controller: 'clienteDialogCtrl',
            templateUrl: 'views/dialogs/cliente-dialog.html',
            parent: angular.element(document.querySelector('#appContent')),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: true, // Only for -xs, -sm breakpoints.      
            locals:{
                _Cliente: null
            }
        }).then(function(answer) {// here goes code when close dialog sending a variable return
            $scope.list();            
          }, function() {// here goes code when close dialog without response
        });
    };

    $scope.show = function(ev, _cliente){
        ev.stopPropagation(); // in case autoselect is enabled
        $mdDialog.show({
            controller: 'clienteDialogCtrl',
            templateUrl: 'views/dialogs/cliente-dialog.html',
            parent: angular.element(document.querySelector('#appContent')),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: true, // Only for -xs, -sm breakpoints.
            locals:{
                _Cliente: _cliente
            }
        }).then(function(answer) {// here goes code when close dialog sending a variable return      
            $scope.list();            
          }, function() {// here goes code when close dialog without response
        });
    };

    $scope.delete = function(ev, _cliente){
        ev.stopPropagation(); // in case autoselect is enabled

        var confirm = $mdDialog.confirm()
            .title(`¿Está usted seguro de eliminar cliente?`)
            .textContent(`El cliente ${_cliente.razon_social} será eliminado.`)
            .ariaLabel('Eliminar cliente')
            .parent(angular.element(document.querySelector('#appContent')))
            .targetEvent(ev)
            .ok('OK')
            .cancel('CANCELAR');

        $mdDialog.show(confirm).then(function() {
            Cliente.delete(_cliente.id).then(function successCallback(response){                
                if (response.data.status == true) {
                    myAlertServ.aviso("INFORMACIÓN", `Cliente '${_cliente.razon_social}' eliminado con exito.`);
                    $scope.list();
                } else {
                    myAlertServ.aviso("INFORMACIÓN", 'Error al eliminar cliente.');
                }
            });
        });
    };

    $scope.deleteMultiple = function(ev){
        var confirm = $mdDialog.confirm()
          .title('¿Está usted seguro de eliminar los clientes seleccionados?')
          .textContent(`${$scope.selected.length} clientes serán eliminados.`)
          .ariaLabel('Eliminar clientes')
          .parent(angular.element(document.querySelector('#appContent')))
          .targetEvent(ev)
          .ok('OK')
          .cancel('CANCELAR');

        $mdDialog.show(confirm).then(function() {
            $scope.selected.forEach(function (cliente){
                Cliente.delete(cliente.id).then(function successCallback(response){
                });
            });
            $scope.list();            
        });
    };
}]);

app.controller('clienteDialogCtrl', [
  '_Cliente', '$scope', '$rootScope', '$mdDialog', '$timeout', '$filter', 'myAlertServ', 'Cliente', 'Ubigeo',
    function(_Cliente, $scope, $rootScope, $mdDialog, $timeout, $filter, myAlertServ, Cliente, Ubigeo){
        $scope.cliente = _Cliente ? angular.copy(_Cliente) : Cliente.structure();
        $scope.docPattern = $scope.cliente.tipo=='PERSONA' ? /^[0-9]{8}$/ : /^[0-9]{11}$/;

        $scope.ubigeo = {
            codigo: {
                departamento: $scope.cliente.ubigeo ? ($scope.cliente.ubigeo).slice(0,2) : null,
                provincia: $scope.cliente.ubigeo ? ($scope.cliente.ubigeo).slice(2,4) : null,
                distrito: $scope.cliente.ubigeo ? ($scope.cliente.ubigeo).slice(4,6) : null,
            },
            departamentos : function(){
                return Ubigeo.departamentos();
            },
            provincias : function(){
                return this.codigo.departamento ? Ubigeo.provincias(this.codigo.departamento) :null;
            },
            distritos : function(){
                return this.codigo.provincia ? Ubigeo.distritos(this.codigo.departamento, this.codigo.provincia) : null;
            },
            store : function(){
                $scope.cliente.ubigeo =  this.codigo.departamento.concat(this.codigo.provincia, this.codigo.distrito);
            }
        };

        $scope.store = function () {
            console.log("Verificando cliente...");
            console.log($scope.cliente);

            console.log("Agregando cliente...");
            var mensaje = null;
            Cliente.store($scope.cliente).then(function successCallback(response){
                console.log(response);

                if(response.data.status == true){
                    mensaje = "Cliente registrado con éxito";
                }
                else{
                    mensaje = "Ocurrio un error al registrar cliente: ";
                }

                $scope.closeDialog('OK');//send 'OK' for update table
                $timeout(function(){
                    myAlertServ.aviso("INFORMACIÓN", mensaje);
                },500);
            });
        };

        $scope.update = function () {
            console.log("Actualizando cliente...");            
            console.log($scope.cliente);

            var mensaje = null;
            Cliente.update($scope.cliente).then(function successCallback(response){
              console.log(response);

              if (response.data.status == true)
                mensaje = "Cliente editado con éxito";
              else
                mensaje = "Ocurrio un error al editar cliente, verifique";
              
              $scope.closeDialog('OK');//send 'OK' for update table
              $timeout(function(){
                myAlertServ.aviso("INFORMACIÓN", mensaje);
                //actualizando datos en tabla...
                // _Cliente = $scope.cliente;
              },500);
            });
        };

        $scope.closeDialog = function (answer) {
            if(answer)
              $mdDialog.hide(answer);  
            else
              $mdDialog.cancel();
        };

        // $scope.testxxx = $rootScope.testxxx;
}]);