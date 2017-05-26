(function () {
    'use strict';

    angular.module('projetosofea.application').config(ApplicationConfig);

    ApplicationConfig.$inject = ['$urlRouterProvider'];
    function ApplicationConfig($urlRouterProvider) {
		$urlRouterProvider.otherwise('/usuarios');
    }
})();
