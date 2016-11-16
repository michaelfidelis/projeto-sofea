(function (angular) {
    'use strict';

    angular.module('app').service('NotificationService', NotificationService);

    NotificationService.$inject = [];

    function NotificationService() {
        var self = this;
        self.notificacoes = JSON.parse(sessionStorage.getItem('notificacoes')) || [];

        self.quantidadeNotificacoes = self.notificacoes.length;

        self.service = {
            adicionar: adicionar,
            limpar: limpar,
            obterNotificacoes: obterNotificacoes,
            remover: remover
        };
        return self.service;

        function adicionar(tipo, mensagem) {
            self.notificacoes.push({
                'codigo': self.quantidadeNotificacoes++,
                'tipo': tipo || 'success',
                'mensagem': mensagem
            });
            sessionStorage.setItem('notificacoes', JSON.stringify(self.notificacoes))
        };

        function limpar() {;
            self.notificacoes = [];
            self.quantidadeNotificacoes = 0;
            sessionStorage.setItem('notificacoes', JSON.stringify(self.notificacoes))
        };

        function remover(index) {;
            self.notificacoes.splice(index, 1);
            self.quantidadeNotificacoes = 0;
            sessionStorage.setItem('notificacoes', JSON.stringify(self.notificacoes))
        };


        function obterNotificacoes() {
            return self.notificacoes;
        };
    };
})(window.angular);
