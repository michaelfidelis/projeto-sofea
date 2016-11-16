(function (angular) {
    'use strict';
    angular.module('app').controller('TarefaController', TarefaController);

    TarefaController.$inject = ['TarefaService'];

    function TarefaController(TarefaService) {
        var self = this;
        self.tarefas = [
            {
                titulo: 'Instalar NPM'
            },
            {
                titulo: 'Inicializar o projeto com  npm init'
            },
            {
                titulo: 'Instalar Grunt'
            },
            {
                titulo: 'Configurar as tasks do Grunt'
            },
            {
                titulo: 'Instalar Bower'
            },
            {
                titulo: 'Configurar o Proxy do Bower'
            },

        ];

        self.listarTarefas = function () {
            TarefaService.listar().then(isSuccess, isError);

            function isSuccess(data) {
                self.tarefas = data.data;
            }

            function isError() {
                NotificationService.adicionar('danger', 'Erro ao obter tarefas.');
            }
        };
    };

})(window.angular);
