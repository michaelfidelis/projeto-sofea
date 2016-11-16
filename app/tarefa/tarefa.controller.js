(function (angular) {
    'use strict';
    angular.module('app').controller('TarefaController', TarefaController);

    TarefaController.$inject = ['TarefaService'];

    function TarefaController(TarefaService) {
        var self = this;
        self.tarefas = [];

        self.listarTarefas = function () {
            TarefaService.listar().then(isSuccess, isError);

            function isSuccess(data) {
                self.tarefas = data.data;
            }

            function isError() {
                self.tarefas = [];
                NotificationService.adicionar('danger', 'Erro ao obter tarefas.');
            }
        };
    };

})(window.angular);
