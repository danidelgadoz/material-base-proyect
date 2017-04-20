app.config([
'$stateProvider', '$urlRouterProvider',
function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: 'login',
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
    });

    $stateProvider.state({
        name: 'dashboard',
        abstract: true,
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardNavCtrl'
    });
    $stateProvider.state({
        name: 'dashboard.inicio',
        url: '/dashboard',
        templateUrl: 'views/modules/inicio.html'
    });
    $stateProvider.state({
        name: 'dashboard.cliente',
        url: '/cliente',
        templateUrl: 'views/modules/cliente.html',
        controller: 'clienteCtrl'
    });

    // For submenu demo ...
    $stateProvider.state({
        name: 'dashboard.indicador_indicador1',
        url: '/indicador/indicador1',
        template: '<div layout-margin layout-padding><h2>INDICADOR 1</h2></div>'
    });
    $stateProvider.state({
        name: 'dashboard.indicador_indicador2',
        url: '/indicador/indicador2',
        template: '<div layout-margin layout-padding><h2>INDICADOR 2</h2></div>'
    });
    $stateProvider.state({
        name: 'dashboard.indicador_indicador3',
        url: '/indicador/indicador3',
        template: '<div layout-margin layout-padding><h2>INDICADOR 3</h2></div>'
    });

    $urlRouterProvider.otherwise('/login');

}]);