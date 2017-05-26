(function () {
    'use strict';

    angular.module('projetosofea.common.service').service('UsuarioService', UsuarioService);

    UsuarioService.$inject = ['$resource'];

    function UsuarioService($resource) {
        return $resource('/usuarios/:codigo', {
            codigo: '@codigo'
        });
    };
})();
