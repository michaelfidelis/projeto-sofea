(function (angular) {
    angular.module('app')
        .component('notifications', {
            restrict: 'E',
            template: '<div uib-alert ng-repeat="notificacao in $ctrl.notificacoes track by notificacao.codigo" ng-class="alert- + (notificacao.tipo || warning)" close="$ctrl.closeAlert($index)" dismiss-on-timeout="2000">{{notificacao.mensagem}}</div>',
            controller: function (NotificationService) {
                var self = this;
                self.notificacoes = NotificationService.obterNotificacoes();

                self.closeAlert = function (index) {
                    NotificationService.remover(index);
                };
            },
        });
})(window.angular);
