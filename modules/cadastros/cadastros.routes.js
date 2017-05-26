(function () {
    'use strict';

    angular.module('projetosofea.cadastros').config(CadastrosConfig);

    CadastrosConfig.$inject = ['$stateProvider'];
    function CadastrosConfig($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('listarUsuarios', {
                url: '/usuarios',
                templateUrl: 'modules/cadastros/usuario/listar.html',
                controller: 'UsuarioController',
                controllerAs: 'usuarioController'
            }).state('adicionarUsuario', {
                url: '/usuarios/adicionar',
                templateUrl: 'modules/cadastros/usuario/adicionar.html',
                controller: 'UsuarioController',
                controllerAs: 'usuarioController'
            });
	    }
})();
