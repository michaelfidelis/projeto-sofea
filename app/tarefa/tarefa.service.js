(function (angular) {
    'use strict';

    angular.module('app').service('TarefaService', TarefaService);

    TarefaService.$inject = ['$http'];

    function TarefaService($http) {
        var service = {
            listar: listar,
            salvar: salvar
        };
        return service;

        function listar() {
            return $http.get('/aplicacao/api/v1/tarefas');
        };

        function salvar(tarefa) {
            return $http.post('aplicacao/api/v1/tarefas', tarefa);
        };

    };
})(window.angular);
