(function (angular) {
    'use strict';

    angular.module('app').config(AppConfig);

    AppConfig.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];

    function AppConfig($routeProvider, $locationProvider, $httpProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'app/tarefa/view/listar.html',
                controller: 'TarefaController',
                controllerAs: 'self',
            }).when('/adicionar', {
                templateUrl: 'app/tarefa/view/adicionar.html',
                controller: 'TarefaController',
                controllerAs: 'self',
            })
            // caso não seja nenhum desses, redirecione para a rota '/'
            .otherwise({
                redirectTo: '/'
            });
    }
})(window.angular);
